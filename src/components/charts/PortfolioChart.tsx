import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateChartData } from '../../lib/utils';

export const PortfolioChart: React.FC = () => {
  const data = generateChartData();

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}K`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(210, 30%, 15%)', 
              border: '1px solid hsl(210, 30%, 35%)',
              borderRadius: '8px',
              color: '#D1D5DB'
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="hsl(160, 80%, 40%)" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};