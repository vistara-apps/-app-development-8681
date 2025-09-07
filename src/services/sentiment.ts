import { BaseApiService } from './api/base';
import { SentimentData, ApiResponse } from '../types/api';

export class SentimentService extends BaseApiService {
  constructor() {
    super({
      baseUrl: 'https://api.thetie.io/v1',
      // Note: API key should be handled by backend proxy in production
      timeout: 10000,
      rateLimit: {
        requests: 100,
        window: 60000 // 1 minute
      }
    });
  }

  async getSentimentData(symbol: string): Promise<ApiResponse<SentimentData>> {
    try {
      // In production, this would call the actual The Tie API through a backend proxy
      // For now, we'll simulate the response structure
      const mockSentimentData: SentimentData = {
        symbol: symbol.toUpperCase(),
        sentiment: this.generateRandomSentiment(),
        score: Math.random() * 100,
        volume: Math.floor(Math.random() * 1000000),
        mentions: Math.floor(Math.random() * 10000),
        timestamp: Date.now()
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        data: mockSentimentData,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        data: {} as SentimentData,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch sentiment data',
        timestamp: Date.now()
      };
    }
  }

  async getBatchSentimentData(symbols: string[]): Promise<ApiResponse<SentimentData[]>> {
    try {
      const sentimentPromises = symbols.map(symbol => this.getSentimentData(symbol));
      const results = await Promise.all(sentimentPromises);
      
      const successfulResults = results
        .filter(result => result.success)
        .map(result => result.data);

      return {
        data: successfulResults,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch batch sentiment data',
        timestamp: Date.now()
      };
    }
  }

  async getHistoricalSentiment(symbol: string, days: number = 7): Promise<ApiResponse<SentimentData[]>> {
    try {
      const historicalData: SentimentData[] = [];
      const now = Date.now();
      
      for (let i = days; i >= 0; i--) {
        const timestamp = now - (i * 24 * 60 * 60 * 1000);
        historicalData.push({
          symbol: symbol.toUpperCase(),
          sentiment: this.generateRandomSentiment(),
          score: Math.random() * 100,
          volume: Math.floor(Math.random() * 1000000),
          mentions: Math.floor(Math.random() * 10000),
          timestamp
        });
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      return {
        data: historicalData,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch historical sentiment data',
        timestamp: Date.now()
      };
    }
  }

  async getTrendingSentiments(limit: number = 10): Promise<ApiResponse<SentimentData[]>> {
    try {
      const trendingSymbols = ['PEPE', 'DOGE', 'SHIB', 'WOJAK', 'BRETT', 'TOSHI', 'BONK', 'FLOKI', 'BABYDOGE', 'ELON'];
      const limitedSymbols = trendingSymbols.slice(0, limit);
      
      const trendingData = await Promise.all(
        limitedSymbols.map(symbol => this.getSentimentData(symbol))
      );

      const successfulData = trendingData
        .filter(result => result.success)
        .map(result => result.data)
        .sort((a, b) => b.score - a.score); // Sort by sentiment score

      return {
        data: successfulData,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch trending sentiments',
        timestamp: Date.now()
      };
    }
  }

  private generateRandomSentiment(): 'bullish' | 'bearish' | 'neutral' {
    const sentiments: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];
    const weights = [0.4, 0.3, 0.3]; // Slightly favor bullish for meme coins
    const random = Math.random();
    
    let cumulativeWeight = 0;
    for (let i = 0; i < sentiments.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        return sentiments[i];
      }
    }
    
    return 'neutral';
  }

  // Method to be called when real API integration is ready
  private async callRealSentimentAPI(symbol: string): Promise<SentimentData> {
    // This would be the actual implementation calling The Tie API
    // through a secure backend proxy
    const response = await this.get<any>(`/sentiment/${symbol}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch sentiment data');
    }

    // Transform the real API response to our SentimentData format
    return {
      symbol: response.data.symbol,
      sentiment: response.data.sentiment,
      score: response.data.score,
      volume: response.data.volume,
      mentions: response.data.mentions,
      timestamp: response.data.timestamp || Date.now()
    };
  }
}
