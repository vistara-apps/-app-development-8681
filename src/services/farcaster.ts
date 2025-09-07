import { BaseApiService } from './api/base';
import { FarcasterCast, FarcasterTrendData, ApiResponse } from '../types/api';

export class FarcasterService extends BaseApiService {
  constructor() {
    super({
      baseUrl: 'https://api.neynar.com/v2',
      // Note: API key should be handled by backend proxy in production
      timeout: 10000,
      rateLimit: {
        requests: 150,
        window: 60000 // 1 minute
      }
    });
  }

  async searchCasts(query: string, limit: number = 25): Promise<ApiResponse<FarcasterCast[]>> {
    try {
      // In production, this would call the actual Neynar API through a backend proxy
      // For now, we'll simulate the response structure
      const mockCasts: FarcasterCast[] = this.generateMockCasts(query, limit);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));

      return {
        data: mockCasts,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search casts',
        timestamp: Date.now()
      };
    }
  }

  async getTrendingCasts(timeframe: '1h' | '24h' | '7d' = '24h'): Promise<ApiResponse<FarcasterCast[]>> {
    try {
      const mockTrendingCasts: FarcasterCast[] = this.generateMockTrendingCasts();

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 700));

      return {
        data: mockTrendingCasts,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch trending casts',
        timestamp: Date.now()
      };
    }
  }

  async getCryptoTrendData(symbol: string): Promise<ApiResponse<FarcasterTrendData>> {
    try {
      const casts = await this.searchCasts(symbol, 50);
      
      if (!casts.success) {
        throw new Error('Failed to fetch casts for trend analysis');
      }

      const trendData: FarcasterTrendData = {
        keyword: symbol.toUpperCase(),
        mentions: casts.data.length,
        sentiment: this.calculateSentimentScore(casts.data),
        casts: casts.data.slice(0, 10), // Top 10 most relevant casts
        trendingScore: this.calculateTrendingScore(casts.data)
      };

      return {
        data: trendData,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        data: {} as FarcasterTrendData,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch crypto trend data',
        timestamp: Date.now()
      };
    }
  }

  async getBatchTrendData(symbols: string[]): Promise<ApiResponse<FarcasterTrendData[]>> {
    try {
      const trendPromises = symbols.map(symbol => this.getCryptoTrendData(symbol));
      const results = await Promise.all(trendPromises);
      
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
        error: error instanceof Error ? error.message : 'Failed to fetch batch trend data',
        timestamp: Date.now()
      };
    }
  }

  private generateMockCasts(query: string, limit: number): FarcasterCast[] {
    const mockCasts: FarcasterCast[] = [];
    const sampleTexts = [
      `Just bought more ${query}! This is going to the moon 🚀`,
      `${query} looking bullish on the charts. Time to accumulate?`,
      `The ${query} community is growing strong! Love the vibes`,
      `${query} holders, we're still early! Diamond hands 💎`,
      `Technical analysis on ${query} shows potential breakout`,
      `${query} memes are getting spicier by the day 🌶️`,
      `Whale alert: Someone just moved massive ${query} bags`,
      `${query} fundamentals looking solid despite the market`,
      `New ${query} partnership announcement coming soon?`,
      `${query} to $1 is not a meme anymore`
    ];

    for (let i = 0; i < Math.min(limit, 25); i++) {
      mockCasts.push({
        hash: `0x${Math.random().toString(16).substr(2, 8)}`,
        author: {
          fid: Math.floor(Math.random() * 100000),
          username: `user${Math.floor(Math.random() * 1000)}`,
          displayName: `Crypto User ${Math.floor(Math.random() * 1000)}`
        },
        text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
        timestamp: Date.now() - Math.floor(Math.random() * 86400000), // Random time in last 24h
        reactions: {
          likes: Math.floor(Math.random() * 100),
          recasts: Math.floor(Math.random() * 50),
          replies: Math.floor(Math.random() * 25)
        }
      });
    }

    return mockCasts;
  }

  private generateMockTrendingCasts(): FarcasterCast[] {
    const trendingTopics = ['PEPE', 'DOGE', 'SHIB', 'Base', 'DeFi', 'NFT', 'ETH', 'BTC'];
    const mockCasts: FarcasterCast[] = [];

    for (let i = 0; i < 10; i++) {
      const topic = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
      mockCasts.push({
        hash: `0x${Math.random().toString(16).substr(2, 8)}`,
        author: {
          fid: Math.floor(Math.random() * 100000),
          username: `influencer${Math.floor(Math.random() * 100)}`,
          displayName: `Crypto Influencer ${Math.floor(Math.random() * 100)}`
        },
        text: `Hot take on ${topic}: This is just the beginning! The fundamentals are stronger than ever 🔥`,
        timestamp: Date.now() - Math.floor(Math.random() * 3600000), // Random time in last hour
        reactions: {
          likes: Math.floor(Math.random() * 500) + 100,
          recasts: Math.floor(Math.random() * 200) + 50,
          replies: Math.floor(Math.random() * 100) + 25
        }
      });
    }

    return mockCasts.sort((a, b) => 
      (b.reactions.likes + b.reactions.recasts) - (a.reactions.likes + a.reactions.recasts)
    );
  }

  private calculateSentimentScore(casts: FarcasterCast[]): number {
    if (casts.length === 0) return 0;

    // Simple sentiment analysis based on keywords and engagement
    let totalSentiment = 0;
    
    casts.forEach(cast => {
      let sentiment = 0;
      const text = cast.text.toLowerCase();
      
      // Positive keywords
      const positiveKeywords = ['moon', 'bullish', 'buy', 'pump', 'rocket', '🚀', 'diamond', '💎', 'hodl', 'strong'];
      const negativeKeywords = ['dump', 'bearish', 'sell', 'crash', 'rip', 'dead', 'scam', 'rug'];
      
      positiveKeywords.forEach(keyword => {
        if (text.includes(keyword)) sentiment += 1;
      });
      
      negativeKeywords.forEach(keyword => {
        if (text.includes(keyword)) sentiment -= 1;
      });
      
      // Weight by engagement
      const engagementWeight = (cast.reactions.likes + cast.reactions.recasts) / 100;
      totalSentiment += sentiment * Math.min(engagementWeight, 2);
    });

    // Normalize to -1 to 1 scale
    return Math.max(-1, Math.min(1, totalSentiment / casts.length));
  }

  private calculateTrendingScore(casts: FarcasterCast[]): number {
    if (casts.length === 0) return 0;

    const totalEngagement = casts.reduce((sum, cast) => 
      sum + cast.reactions.likes + cast.reactions.recasts + cast.reactions.replies, 0
    );
    
    const avgEngagement = totalEngagement / casts.length;
    const mentionCount = casts.length;
    
    // Combine mention frequency and engagement for trending score
    return Math.min(100, (mentionCount * 2) + (avgEngagement / 10));
  }

  // Method to be called when real API integration is ready
  private async callRealFarcasterAPI(endpoint: string, params: any): Promise<any> {
    // This would be the actual implementation calling Neynar API
    // through a secure backend proxy
    const response = await this.get<any>(endpoint, { params });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch Farcaster data');
    }

    return response.data;
  }
}
