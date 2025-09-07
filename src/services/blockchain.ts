import { BaseApiService } from './api/base';
import { TokenBalance, TokenPrice, ApiResponse } from '../types/api';
import { createPublicClient, http, formatUnits, Address } from 'viem';
import { base } from 'viem/chains';

// Common ERC-20 tokens on Base
const COMMON_TOKENS = {
  'ETH': {
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    name: 'Ethereum'
  },
  'USDC': {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    name: 'USD Coin'
  },
  'WETH': {
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    name: 'Wrapped Ethereum'
  }
};

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    type: 'function'
  }
] as const;

export class BlockchainService extends BaseApiService {
  private publicClient;

  constructor() {
    super({
      baseUrl: 'https://mainnet.base.org',
      timeout: 15000
    });

    this.publicClient = createPublicClient({
      chain: base,
      transport: http()
    });
  }

  async getWalletBalances(walletAddress: string): Promise<ApiResponse<TokenBalance[]>> {
    try {
      const balances: TokenBalance[] = [];

      // Get ETH balance
      const ethBalance = await this.publicClient.getBalance({
        address: walletAddress as Address
      });

      balances.push({
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        name: 'Ethereum',
        balance: formatUnits(ethBalance, 18),
        decimals: 18
      });

      // Get ERC-20 token balances
      for (const [symbol, tokenInfo] of Object.entries(COMMON_TOKENS)) {
        if (symbol === 'ETH') continue;

        try {
          const balance = await this.publicClient.readContract({
            address: tokenInfo.address as Address,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [walletAddress as Address]
          });

          if (balance && balance > 0n) {
            balances.push({
              address: tokenInfo.address,
              symbol,
              name: tokenInfo.name,
              balance: formatUnits(balance, tokenInfo.decimals),
              decimals: tokenInfo.decimals
            });
          }
        } catch (error) {
          console.warn(`Failed to fetch ${symbol} balance:`, error);
        }
      }

      return {
        data: balances,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch wallet balances',
        timestamp: Date.now()
      };
    }
  }

  async getTokenPrice(symbol: string): Promise<ApiResponse<TokenPrice>> {
    try {
      // This would typically call a price API like CoinGecko or CoinMarketCap
      // For now, we'll use mock data with a note that this needs real implementation
      const mockPrices: Record<string, TokenPrice> = {
        'ETH': {
          symbol: 'ETH',
          price: 2340.50,
          change24h: 3.2,
          volume24h: 15000000000,
          marketCap: 281000000000,
          lastUpdated: Date.now()
        },
        'USDC': {
          symbol: 'USDC',
          price: 1.00,
          change24h: 0.01,
          volume24h: 5000000000,
          marketCap: 25000000000,
          lastUpdated: Date.now()
        },
        'WETH': {
          symbol: 'WETH',
          price: 2340.50,
          change24h: 3.2,
          volume24h: 8000000000,
          lastUpdated: Date.now()
        }
      };

      const price = mockPrices[symbol];
      if (!price) {
        throw new Error(`Price not found for ${symbol}`);
      }

      return {
        data: price,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        data: {} as TokenPrice,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch token price',
        timestamp: Date.now()
      };
    }
  }

  async getTokenPrices(symbols: string[]): Promise<ApiResponse<TokenPrice[]>> {
    try {
      const prices = await Promise.all(
        symbols.map(symbol => this.getTokenPrice(symbol))
      );

      const successfulPrices = prices
        .filter(response => response.success)
        .map(response => response.data);

      return {
        data: successfulPrices,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch token prices',
        timestamp: Date.now()
      };
    }
  }

  async getTransactionHistory(walletAddress: string, limit: number = 50): Promise<ApiResponse<any[]>> {
    try {
      // This would typically call a blockchain explorer API
      // For now, return empty array with a note that this needs real implementation
      console.warn('Transaction history not implemented - requires blockchain explorer API');
      
      return {
        data: [],
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch transaction history',
        timestamp: Date.now()
      };
    }
  }
}
