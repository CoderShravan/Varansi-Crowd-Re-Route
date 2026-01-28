import React from 'react';
import { LocationData } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

interface AnalyticsProps {
  data: LocationData[];
}

const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  // Sort by crowd count for the bar chart
  const sortedByCrowd = [...data].sort((a, b) => b.currentCrowd - a.currentCrowd).slice(0, 10);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-y-auto pb-4">
      {/* Top Congested Areas */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
        <h3 className="font-bold text-gray-700 mb-4">Top 10 Congested Locations</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sortedByCrowd} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 10}} />
            <Tooltip />
            <Legend />
            <Bar dataKey="currentCrowd" fill="#FF6B35" radius={[0, 4, 4, 0]} name="Current Crowd" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Inflow vs Outflow */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
        <h3 className="font-bold text-gray-700 mb-4">Flow Analysis (Inflow vs Outflow)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data.slice(0, 7)}>
            <defs>
              <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} angle={-45} textAnchor="end" height={60} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="inflowRate" stroke="#8884d8" fillOpacity={1} fill="url(#colorIn)" name="Inflow (p/m)" />
            <Area type="monotone" dataKey="outflowRate" stroke="#82ca9d" fillOpacity={1} fill="url(#colorOut)" name="Outflow (p/m)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

       {/* Environmental Impact */}
       <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 min-h-[300px] md:col-span-2">
        <h3 className="font-bold text-gray-700 mb-4">Risk vs AQI Correlation</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis yAxisId="left" orientation="left" stroke="#ff7300" label={{ value: 'Risk', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'AQI', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="riskScore" stroke="#ff7300" activeDot={{ r: 8 }} name="Risk Score" />
            <Line yAxisId="right" type="monotone" dataKey="aqi" stroke="#82ca9d" name="AQI Level" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
