// User Types
export interface User {
  userId: string;
  walletAddress: string;
  isOnchainSubscription: boolean;
  watchlist: string[];
  notificationPreferences: NotificationPreferences;
  createdAt: number;
  lastActive: number;
  subscription?: Subscription;
}

export interface Subscription {
  type: 'free' | 'premium';
  startDate: number;
  endDate?: number;
  isActive: boolean;
  paymentMethod?: 'crypto' | 'fiat';
  transactionHash?: string;
}

export interface NotificationPreferences {
  push: boolean;
  email: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'hourly' | 'daily';
  types: {
    priceAlerts: boolean;
    trendAlerts: boolean;
    whaleMovements: boolean;
    sentimentShifts: boolean;
    portfolioUpdates: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;   // HH:mm format
    timezone: string;
  };
}

export interface WatchedCoin {
  symbol: string;
  name: string;
  addedAt: number;
  alertConditions: AlertCondition[];
  isActive: boolean;
}

export interface AlertCondition {
  field: 'price' | 'change24h' | 'volume' | 'memeability_score' | 'sentiment';
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
  timeframe?: '1h' | '4h' | '24h' | '7d';
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  currency: 'USD' | 'ETH' | 'BTC';
  language: string;
  timezone: string;
  defaultTab: 'portfolio' | 'trends' | 'signals';
  chartSettings: {
    defaultTimeframe: '1h' | '4h' | '24h' | '7d' | '30d';
    showVolume: boolean;
    showMA: boolean;
  };
}
