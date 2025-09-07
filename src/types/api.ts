// API Types and Interfaces
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

// Sentiment API Types
export interface SentimentData {
  symbol: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  volume: number;
  mentions: number;
  timestamp: number;
}

// Farcaster API Types
export interface FarcasterCast {
  hash: string;
  author: {
    fid: number;
    username: string;
    displayName: string;
  };
  text: string;
  timestamp: number;
  reactions: {
    likes: number;
    recasts: number;
    replies: number;
  };
}

export interface FarcasterTrendData {
  keyword: string;
  mentions: number;
  sentiment: number;
  casts: FarcasterCast[];
  trendingScore: number;
}

// AI Analysis Types
export interface AIAnalysisRequest {
  text: string;
  context: 'sentiment' | 'memeability' | 'hype_prediction';
  symbol?: string;
}

export interface AIAnalysisResponse {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  memeabilityScore?: number;
  hypePrediction?: 'explosive' | 'rising' | 'stable' | 'declining';
  reasoning: string;
}

// Blockchain API Types
export interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  price?: number;
  value?: number;
}

export interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
  lastUpdated: number;
}

// Rate Limiting Types
export interface RateLimitConfig {
  requests: number;
  window: number; // in milliseconds
  retryAfter?: number;
}

export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  rateLimit?: RateLimitConfig;
  timeout?: number;
}
