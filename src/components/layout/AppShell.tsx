import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { PortfolioDashboard } from '../portfolio/PortfolioDashboard';
import { TrendAnalysis } from '../trends/TrendAnalysis';
import { SignalAlerts } from '../signals/SignalAlerts';
import { PieChart, TrendingUp, Bell } from 'lucide-react';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-muted-300 bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MT</span>
              </div>
              <div>
                <h1 className="text-heading">MemeTrend Alpha</h1>
                <p className="text-xs text-gray-400">Surf the crypto meme wave</p>
              </div>
            </div>
            
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="portfolio" className="flex items-center space-x-2">
              <PieChart className="w-4 h-4" />
              <span className="hidden sm:inline">Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="signals" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Signals</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <PortfolioDashboard />
          </TabsContent>

          <TabsContent value="trends">
            <TrendAnalysis />
          </TabsContent>

          <TabsContent value="signals">
            <SignalAlerts />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-muted-300 bg-surface/30 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-caption">
              Built on Base • Powered by AI • Made for Meme Enthusiasts
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};