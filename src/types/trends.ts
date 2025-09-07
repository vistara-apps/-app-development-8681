// Trend Analysis Types
export interface MemeTrend {
  trendId: string;
  tokenSymbol: string;
  tokenName: string;
  memeabilityScore: number;
  hypePrediction: 'explosive' | 'rising' | 'stable' | 'declining';
  sentimentAnalysis: 'very_bullish' | 'bullish' | 'neutral' | 'bearish' | 'very_bearish';
  trendStartDate: number;
  lastUpdated: number;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
  socialMetrics: {
    mentions: number;
    sentiment: number;
    engagement: number;
    influencerScore: number;
  };
}

export interface TrendingCoin {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  memeabilityScore: number;
  hypePrediction: string;
  sentiment: string;
  trendingRank: number;
  logo?: string;
}

export interface SocialSentiment {
  platform: 'farcaster' | 'twitter' | 'reddit' | 'telegram';
  mentions: number;
  sentiment: number; // -1 to 1
  engagement: number;
  topPosts: Array<{
    text: string;
    author: string;
    engagement: number;
    timestamp: number;
  }>;
}

export interface HypeCycle {
  phase: 'discovery' | 'hype' | 'peak' | 'decline' | 'recovery';
  confidence: number;
  timeToNext: number; // estimated hours
  historicalPattern: boolean;
}

export interface TrendAlert {
  id: string;
  symbol: string;
  type: 'new_trend' | 'hype_spike' | 'sentiment_shift' | 'volume_surge';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
  data: any;
}
