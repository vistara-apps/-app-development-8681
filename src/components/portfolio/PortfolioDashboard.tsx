import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { PortfolioChart } from '../charts/PortfolioChart';
import { generateMockPortfolio } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const PortfolioDashboard: React.FC = () => {
  const portfolio = generateMockPortfolio();
  const totalValue = portfolio.reduce((sum, asset) => sum + asset.value, 0);
  const totalChange = 5.7; // Mock 24h change

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
              </div>
              <div className={`flex items-center ${totalChange >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {totalChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                <span className="text-sm font-medium">{totalChange}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-caption">24h P&L</p>
              <p className={`text-2xl font-bold ${totalChange >= 0 ? 'text-accent' : 'text-destructive'}`}>
                ${totalChange >= 0 ? '+' : ''}${(totalValue * totalChange / 100).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-caption">Assets</p>
              <p className="text-2xl font-bold text-white">{portfolio.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioChart />
        </CardContent>
      </Card>

      {/* Holdings List */}
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolio.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between p-4 rounded-md bg-background border border-muted-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{asset.symbol.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{asset.symbol}</p>
                    <p className="text-caption">{asset.name}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-white">${asset.value.toLocaleString()}</p>
                  <div className="flex items-center">
                    <span className={`text-sm ${asset.change24h >= 0 ? 'text-accent' : 'text-destructive'}`}>
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};