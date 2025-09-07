import { useState, useEffect, useCallback } from 'react';
import { MemeTrend, TrendingCoin } from '../types/trends';
import { SentimentService } from '../services/sentiment';
import { FarcasterService } from '../services/farcaster';
import { AIService } from '../services/ai';

const sentimentService = new SentimentService();
const farcasterService = new FarcasterService();
const aiService = new AIService();

export function useTrendAnalysis() {
  const [trends, setTrends] = useState<MemeTrend[]>([]);
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  const fetchTrendAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get trending sentiments from The Tie API
      const sentimentResponse = await sentimentService.getTrendingSentiments(10);
      
      if (!sentimentResponse.success) {
        throw new Error(sentimentResponse.error || 'Failed to fetch sentiment data');
      }

      const sentimentData = sentimentResponse.data;
      
      // Get Farcaster trend data for the same symbols
      const symbols = sentimentData.map(s => s.symbol);
      const farcasterResponse = await farcasterService.getBatchTrendData(symbols);
      
      const farcasterData = farcasterResponse.success ? farcasterResponse.data : [];

      // Generate AI analysis for memeability scores and hype predictions
      const aiAnalysisPromises = symbols.map(async (symbol) => {
        const sentiment = sentimentData.find(s => s.symbol === symbol);
        const farcaster = farcasterData.find(f => f.keyword === symbol);
        
        const analysisText = `${symbol} has ${sentiment?.mentions || 0} mentions with ${sentiment?.sentiment || 'neutral'} sentiment. Social engagement shows ${farcaster?.mentions || 0} Farcaster mentions.`;
        
        const [memeabilityResponse, hypePredictionResponse] = await Promise.all([
          aiService.calculateMemeabilityScore(symbol, [sentiment, farcaster]),
          aiService.predictHypeCycle(symbol, [])
        ]);

        return {
          symbol,
          memeabilityScore: memeabilityResponse.success ? memeabilityResponse.data : 50,
          hypePrediction: hypePredictionResponse.success ? hypePredictionResponse.data : 'stable'
        };
      });

      const aiAnalysisResults = await Promise.all(aiAnalysisPromises);

      // Combine all data into MemeTrend objects
      const memeTrends: MemeTrend[] = sentimentData.map((sentiment) => {
        const farcaster = farcasterData.find(f => f.keyword === sentiment.symbol);
        const aiAnalysis = aiAnalysisResults.find(a => a.symbol === sentiment.symbol);
        
        // Generate mock price data (in production, this would come from a price API)
        const mockPrice = Math.random() * 10;
        const mockChange24h = (Math.random() - 0.5) * 200; // -100% to +100%
        const mockVolume24h = Math.floor(Math.random() * 10000000);

        return {
          trendId: `trend_${sentiment.symbol}_${Date.now()}`,
          tokenSymbol: sentiment.symbol,
          tokenName: sentiment.symbol, // In production, get full name from token registry
          memeabilityScore: aiAnalysis?.memeabilityScore || 50,
          hypePrediction: aiAnalysis?.hypePrediction as any || 'stable',
          sentimentAnalysis: this.mapSentimentToAnalysis(sentiment.sentiment),
          trendStartDate: Date.now() - Math.floor(Math.random() * 86400000), // Random time in last 24h
          lastUpdated: Date.now(),
          price: mockPrice,
          change24h: mockChange24h,
          volume24h: mockVolume24h,
          socialMetrics: {
            mentions: sentiment.mentions,
            sentiment: sentiment.score / 100, // Normalize to -1 to 1
            engagement: farcaster?.trendingScore || 0,
            influencerScore: Math.random() * 100
          }
        };
      });

      // Create trending coins summary
      const trendingCoinsData: TrendingCoin[] = memeTrends
        .sort((a, b) => b.memeabilityScore - a.memeabilityScore)
        .slice(0, 10)
        .map((trend, index) => ({
          symbol: trend.tokenSymbol,
          name: trend.tokenName,
          price: trend.price,
          change24h: trend.change24h,
          volume24h: trend.volume24h,
          memeabilityScore: trend.memeabilityScore,
          hypePrediction: trend.hypePrediction,
          sentiment: trend.sentimentAnalysis,
          trendingRank: index + 1
        }));

      setTrends(memeTrends);
      setTrendingCoins(trendingCoinsData);
      setLastUpdated(Date.now());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch trend analysis';
      setError(errorMessage);
      console.error('Trend analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTrends = useCallback(() => {
    fetchTrendAnalysis();
  }, [fetchTrendAnalysis]);

  // Auto-refresh trends every 5 minutes
  useEffect(() => {
    // Initial fetch
    fetchTrendAnalysis();

    // Set up auto-refresh
    const interval = setInterval(() => {
      fetchTrendAnalysis();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchTrendAnalysis]);

  // Check if data is stale (older than 10 minutes)
  const isStale = useCallback(() => {
    return Date.now() - lastUpdated > 600000; // 10 minutes
  }, [lastUpdated]);

  // Helper method to map sentiment to analysis
  const mapSentimentToAnalysis = (sentiment: 'bullish' | 'bearish' | 'neutral'): 'very_bullish' | 'bullish' | 'neutral' | 'bearish' | 'very_bearish' => {
    switch (sentiment) {
      case 'bullish':
        return Math.random() > 0.5 ? 'very_bullish' : 'bullish';
      case 'bearish':
        return Math.random() > 0.5 ? 'very_bearish' : 'bearish';
      default:
        return 'neutral';
    }
  };

  return {
    trends,
    trendingCoins,
    loading,
    error,
    refreshTrends,
    isStale: isStale(),
    lastUpdated
  };
}
