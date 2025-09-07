// Portfolio Types
export interface PortfolioAsset {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  change24h: number;
  value: number;
  address?: string;
  decimals?: number;
  logo?: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalChange24h: number;
  totalChangePercent: number;
  assets: PortfolioAsset[];
  lastUpdated: number;
}

export interface PortfolioEntry {
  entryId: string;
  userId: string;
  tokenSymbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: number;
  lastUpdated: number;
}

export interface PortfolioChartData {
  date: string;
  value: number;
  change?: number;
}

export interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
  balance?: string;
}
