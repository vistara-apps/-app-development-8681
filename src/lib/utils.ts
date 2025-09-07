import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Mock data generators
export const generateMockPortfolio = () => [
  { symbol: 'ETH', name: 'Ethereum', balance: 2.5, price: 2340.50, change24h: 3.2, value: 5851.25 },
  { symbol: 'PEPE', name: 'Pepe', balance: 1000000, price: 0.00000123, change24h: 15.7, value: 1230.00 },
  { symbol: 'DOGE', name: 'Dogecoin', balance: 5000, price: 0.087, change24h: -2.1, value: 435.00 },
  { symbol: 'SHIB', name: 'Shiba Inu', balance: 50000000, price: 0.0000089, change24h: 8.4, value: 445.00 }
];

export const generateMockTrends = () => [
  { 
    symbol: 'WOJAK', 
    name: 'Wojak Finance',
    memeabilityScore: 87, 
    hypePrediction: 'Rising',
    sentiment: 'Bullish',
    price: 0.0045,
    change24h: 234.5,
    volume24h: 1250000
  },
  { 
    symbol: 'BRETT', 
    name: 'Base Brett',
    memeabilityScore: 75, 
    hypePrediction: 'Stable',
    sentiment: 'Neutral',
    price: 0.12,
    change24h: 12.3,
    volume24h: 890000
  },
  { 
    symbol: 'TOSHI', 
    name: 'Toshi',
    memeabilityScore: 92, 
    hypePrediction: 'Explosive',
    sentiment: 'Very Bullish',
    price: 0.0012,
    change24h: 456.7,
    volume24h: 2100000
  }
];

export const generateChartData = () => {
  const data = [];
  const now = Date.now();
  for (let i = 30; i >= 0; i--) {
    data.push({
      date: new Date(now - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.random() * 1000 + 5000 + Math.sin(i / 5) * 500
    });
  }
  return data;
};