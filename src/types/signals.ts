// Signal Types
export interface Signal {
  id: string;
  type: 'price_alert' | 'new_trend' | 'whale_movement' | 'sentiment_shift' | 'volume_surge';
  symbol: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  data: SignalData;
  isPremium: boolean;
  isRead: boolean;
}

export interface SignalData {
  price?: number;
  change?: number;
  volume?: number;
  threshold?: number;
  previousValue?: number;
  currentValue?: number;
  metadata?: Record<string, any>;
}

export interface SignalAlert {
  id: string;
  userId: string;
  symbol: string;
  type: Signal['type'];
  conditions: AlertCondition[];
  isActive: boolean;
  createdAt: number;
  triggeredAt?: number;
  notificationPreferences: {
    push: boolean;
    email: boolean;
    inApp: boolean;
  };
}

export interface AlertCondition {
  field: 'price' | 'change24h' | 'volume' | 'memeability_score' | 'sentiment';
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
  timeframe?: '1h' | '4h' | '24h' | '7d';
}

export interface WhaleMovement {
  transactionHash: string;
  from: string;
  to: string;
  amount: string;
  symbol: string;
  value: number;
  timestamp: number;
  type: 'buy' | 'sell' | 'transfer';
}

export interface SignalHistory {
  signals: Signal[];
  totalCount: number;
  unreadCount: number;
  lastUpdated: number;
}

export interface NotificationPreferences {
  push: boolean;
  email: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'hourly' | 'daily';
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;   // HH:mm format
  };
}
