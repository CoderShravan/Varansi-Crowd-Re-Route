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
  
  // High contrast color for text labels
  const axisStyle = { fill: '#1f2937', fontSize: 11, fontWeight: 600 };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-y-auto pb-4">
      {/* Top Congested Areas */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
        <h3 className="font-bold text-gray-700 mb-4">Top 10 Congested Locations</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sortedByCrowd} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
            <XAxis type="number" tick={axisStyle} stroke="#9ca3af" />
            <YAxis dataKey="name" type="category" width={120} tick={axisStyle} stroke="#9ca3af" interval={0} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#374151' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="currentCrowd" fill="#FF6B35" radius={[0, 4, 4, 0]} name="Current Crowd" barSize={20} />
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
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-25} textAnchor="end" height={60} stroke="#9ca3af" />
            <YAxis tick={axisStyle} stroke="#9ca3af" />
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Area type="monotone" dataKey="inflowRate" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorIn)" name="Inflow (p/m)" />
            <Area type="monotone" dataKey="outflowRate" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOut)" name="Outflow (p/m)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

       {/* Environmental Impact */}
       <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 min-h-[300px] md:col-span-2">
        <h3 className="font-bold text-gray-700 mb-4">Risk vs AQI Correlation</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" hide />
            <YAxis yAxisId="left" orientation="left" stroke="#f97316" tick={axisStyle} label={{ value: 'Risk Score', angle: -90, position: 'insideLeft', fill: '#f97316', fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={axisStyle} label={{ value: 'AQI', angle: 90, position: 'insideRight', fill: '#10b981', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line yAxisId="left" type="monotone" dataKey="riskScore" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Risk Score" />
            <Line yAxisId="right" type="monotone" dataKey="aqi" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="AQI Level" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;