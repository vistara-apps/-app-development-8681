import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { usePaymentContext } from '../../hooks/usePaymentContext';
import { Bell, TrendingUp, AlertTriangle, Star } from 'lucide-react';

export const SignalAlerts: React.FC = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createSession } = usePaymentContext();

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      await createSession();
      setIsPremium(true);
      alert('Successfully upgraded to Premium! You now have access to advanced signals.');
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const freeSignals = [
    {
      type: 'priceAlert',
      icon: <TrendingUp className="w-4 h-4" />,
      title: 'PEPE Price Movement',
      description: 'PEPE increased by 15% in the last hour',
      time: '2 minutes ago',
      severity: 'medium'
    },
    {
      type: 'newTrend',
      icon: <Star className="w-4 h-4" />,
      title: 'New Trending Coin',
      description: 'BRETT entering trending status',
      time: '15 minutes ago',
      severity: 'low'
    }
  ];

  const premiumSignals = [
    {
      type: 'priceAlert',
      icon: <AlertTriangle className="w-4 h-4" />,
      title: 'Whale Movement Alert',
      description: 'Large wallet moved 5M TOSHI tokens',
      time: '1 minute ago',
      severity: 'high'
    },
    {
      type: 'newTrend',
      icon: <TrendingUp className="w-4 h-4" />,
      title: 'Sentiment Surge',
      description: 'WOJAK social sentiment spiked 200%',
      time: '5 minutes ago',
      severity: 'high'
    },
    {
      type: 'priceAlert',
      icon: <Star className="w-4 h-4" />,
      title: 'Breakout Pattern',
      description: 'DOGE technical breakout detected',
      time: '10 minutes ago',
      severity: 'medium'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      default: return 'border-blue-500 bg-blue-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {!isPremium && (
        <Card>
          <CardHeader>
            <CardTitle>Upgrade to Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="p-6 rounded-lg bg-primary/10 border border-primary/30">
                <h3 className="text-lg font-semibold text-white mb-2">Get Advanced Signals</h3>
                <p className="text-body mb-4">
                  Unlock real-time whale alerts, sentiment analysis, and advanced pattern detection for just $5/month.
                </p>
                <ul className="text-sm text-gray-300 space-y-2 mb-6">
                  <li>• Real-time whale movement alerts</li>
                  <li>• Advanced sentiment analysis</li>
                  <li>• Technical pattern detection</li>
                  <li>• Priority notifications</li>
                </ul>
                <Button 
                  onClick={handleUpgrade} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Processing...' : 'Upgrade to Premium - $5/month'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Recent Signals</span>
            {isPremium && <span className="text-xs bg-primary px-2 py-1 rounded-full">PREMIUM</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {freeSignals.map((signal, index) => (
              <div key={index} className={`p-3 rounded-md border ${getSeverityColor(signal.severity)}`}>
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{signal.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{signal.title}</p>
                    <p className="text-sm text-gray-300">{signal.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{signal.time}</p>
                  </div>
                </div>
              </div>
            ))}

            {isPremium && premiumSignals.map((signal, index) => (
              <div key={`premium-${index}`} className={`p-3 rounded-md border ${getSeverityColor(signal.severity)}`}>
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{signal.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-white">{signal.title}</p>
                      <span className="text-xs bg-accent px-2 py-0.5 rounded-full">PREMIUM</span>
                    </div>
                    <p className="text-sm text-gray-300">{signal.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{signal.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Set Custom Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input label="Token Symbol" placeholder="e.g., PEPE, DOGE" />
            <Input label="Price Alert ($)" placeholder="e.g., 0.001" />
            <Input label="Percentage Change (%)" placeholder="e.g., 10" />
            <Button className="w-full" disabled={!isPremium}>
              {isPremium ? 'Create Alert' : 'Premium Required'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};