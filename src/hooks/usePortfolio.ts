import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { PortfolioSummary, PortfolioAsset } from '../types/portfolio';
import { BlockchainService } from '../services/blockchain';

const blockchainService = new BlockchainService();

export function usePortfolio() {
  const { address, isConnected } = useAccount();
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  const fetchPortfolio = useCallback(async () => {
    if (!address || !isConnected) {
      setPortfolio(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch wallet balances
      const balancesResponse = await blockchainService.getWalletBalances(address);
      
      if (!balancesResponse.success) {
        throw new Error(balancesResponse.error || 'Failed to fetch balances');
      }

      const balances = balancesResponse.data;
      
      // Get symbols for price fetching
      const symbols = balances.map(balance => balance.symbol);
      
      // Fetch prices for all tokens
      const pricesResponse = await blockchainService.getTokenPrices(symbols);
      
      if (!pricesResponse.success) {
        console.warn('Failed to fetch prices, using mock data');
      }

      const prices = pricesResponse.data || [];
      
      // Combine balances with prices to create portfolio assets
      const assets: PortfolioAsset[] = balances.map(balance => {
        const priceData = prices.find(p => p.symbol === balance.symbol);
        const price = priceData?.price || 0;
        const change24h = priceData?.change24h || 0;
        const value = parseFloat(balance.balance) * price;

        return {
          symbol: balance.symbol,
          name: balance.name,
          balance: parseFloat(balance.balance),
          price,
          change24h,
          value,
          address: balance.address,
          decimals: balance.decimals
        };
      }).filter(asset => asset.value > 0.01); // Filter out dust

      // Calculate portfolio summary
      const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
      const totalChange24h = assets.reduce((sum, asset) => sum + (asset.value * asset.change24h / 100), 0);
      const totalChangePercent = totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0;

      const portfolioSummary: PortfolioSummary = {
        totalValue,
        totalChange24h,
        totalChangePercent,
        assets,
        lastUpdated: Date.now()
      };

      setPortfolio(portfolioSummary);
      setLastUpdated(Date.now());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio';
      setError(errorMessage);
      console.error('Portfolio fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  const refreshPortfolio = useCallback(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  // Auto-refresh portfolio every 30 seconds when connected
  useEffect(() => {
    if (!isConnected || !address) {
      setPortfolio(null);
      return;
    }

    // Initial fetch
    fetchPortfolio();

    // Set up auto-refresh
    const interval = setInterval(() => {
      fetchPortfolio();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [address, isConnected, fetchPortfolio]);

  // Check if data is stale (older than 2 minutes)
  const isStale = useCallback(() => {
    return Date.now() - lastUpdated > 120000; // 2 minutes
  }, [lastUpdated]);

  return {
    portfolio,
    loading,
    error,
    refreshPortfolio,
    isStale: isStale(),
    lastUpdated
  };
}
