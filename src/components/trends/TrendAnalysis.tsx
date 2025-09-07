import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { generateMockTrends } from '../../lib/utils';
import { TrendingUp, Zap, Target } from 'lucide-react';

export const TrendAnalysis: React.FC = () => {
  const trends = generateMockTrends();

  const getMemeabilityColor = (score: number) => {
    if (score >= 80) return 'text-accent';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHypeIcon = (prediction: string) => {
    switch (prediction) {
      case 'Explosive': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'Rising': return <TrendingUp className="w-4 h-4 text-accent" />;
      default: return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trending Meme Coins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trends.map((trend) => (
              <div key={trend.symbol} className="p-4 rounded-md bg-background border border-muted-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{trend.symbol.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{trend.symbol}</p>
                      <p className="text-caption">{trend.name}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-white">${trend.price}</p>
                    <div className="flex items-center">
                      <span className={`text-sm ${trend.change24h >= 0 ? 'text-accent' : 'text-destructive'}`}>
                        {trend.change24h >= 0 ? '+' : ''}{trend.change24h}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-caption">Memeability Score</p>
                    <p className={`font-bold ${getMemeabilityColor(trend.memeabilityScore)}`}>
                      {trend.memeabilityScore}/100
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-caption">Hype Prediction</p>
                    <div className="flex items-center space-x-1">
                      {getHypeIcon(trend.hypePrediction)}
                      <span className="text-white">{trend.hypePrediction}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-caption">Sentiment</p>
                    <p className="text-white">{trend.sentiment}</p>
                  </div>
                  
                  <div>
                    <p className="text-caption">24h Volume</p>
                    <p className="text-white">${(trend.volume24h / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-accent/10 border border-accent/30">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className="font-medium text-accent">Hot Trend Alert</span>
              </div>
              <p className="text-body">
                TOSHI showing explosive growth with 456% increase and 92 memeability score. 
                Social sentiment extremely bullish across Farcaster and Twitter.
              </p>
            </div>
            
            <div className="p-4 rounded-md bg-yellow-400/10 border border-yellow-400/30">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <span className="font-medium text-yellow-400">Rising Interest</span>
              </div>
              <p className="text-body">
                WOJAK gaining momentum with strong community engagement. 
                Potential breakout candidate based on social metrics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};