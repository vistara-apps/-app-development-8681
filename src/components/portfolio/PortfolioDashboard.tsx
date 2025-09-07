import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { PortfolioChart } from '../charts/PortfolioChart';
import { usePortfolio } from '../../hooks/usePortfolio';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export const PortfolioDashboard: React.FC = () => {
  const { portfolio, loading, error, refreshPortfolio, isStale } = usePortfolio();

  if (loading && !portfolio) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted-300 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted-300 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span>Error loading portfolio: {error}</span>
            </div>
            <Button 
              onClick={refreshPortfolio} 
              className="mt-4"
              variant="secondary"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-caption mb-4">Connect your wallet to view your portfolio</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { totalValue, totalChangePercent, assets } = portfolio;

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
                {isStale && (
                  <p className="text-xs text-yellow-400 mt-1">Data may be outdated</p>
                )}
              </div>
              <div className="flex flex-col items-end">
                <div className={`flex items-center ${totalChangePercent >= 0 ? 'text-accent' : 'text-destructive'}`}>
                  {totalChangePercent >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  <span className="text-sm font-medium">{totalChangePercent.toFixed(2)}%</span>
                </div>
                <Button
                  onClick={refreshPortfolio}
                  variant="secondary"
                  className="mt-2 h-6 px-2 text-xs"
                  disabled={loading}
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-caption">24h P&L</p>
              <p className={`text-2xl font-bold ${totalChangePercent >= 0 ? 'text-accent' : 'text-destructive'}`}>
                ${totalChangePercent >= 0 ? '+' : ''}${portfolio.totalChange24h.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-caption">Assets</p>
              <p className="text-2xl font-bold text-white">{assets.length}</p>
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
            {assets.map((asset) => (
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
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-caption">{asset.balance.toFixed(4)} {asset.symbol}</span>
                    <span className={`text-sm ${asset.change24h >= 0 ? 'text-accent' : 'text-destructive'}`}>
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {assets.length === 0 && (
              <div className="text-center py-8">
                <p className="text-caption">No assets found in your wallet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
