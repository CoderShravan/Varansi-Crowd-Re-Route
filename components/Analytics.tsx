
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
  const sortedByCrowd = [...data].sort((a, b) => b.currentCrowd - a.currentCrowd).slice(0, 10);
  
  // High contrast text style for axes - PURE BLACK and LARGER
  const axisStyle = { fill: '#000000', fontSize: 12, fontWeight: 700 };
  const labelStyle = { fill: '#000000', fontSize: 13, fontWeight: 700 };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full overflow-y-auto pb-24 lg:pb-8 custom-scrollbar p-2">
      
      {/* Crowd Density Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 min-h-[420px]">
        <div className="mb-6">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <span className="w-1.5 h-6 bg-orange-600 rounded-full"></span>
                Top Congested Locations
            </h3>
            <p className="text-sm text-gray-500 ml-3.5">Real-time headcount per zone</p>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={sortedByCrowd} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
            <XAxis type="number" tick={axisStyle} stroke="#000" strokeWidth={1} />
            <YAxis 
                dataKey="name" 
                type="category" 
                width={140} 
                tick={axisStyle} 
                stroke="#000" 
                strokeWidth={1}
                interval={0} 
            />
            <Tooltip 
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#000', fontWeight: 'bold' }}
              itemStyle={{ color: '#000' }}
            />
            <Bar dataKey="currentCrowd" fill="#FF6B35" radius={[0, 6, 6, 0]} barSize={22} name="People Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Inflow/Outflow Area Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 min-h-[420px]">
        <div className="mb-6">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                Traffic Flow Dynamics
            </h3>
            <p className="text-sm text-gray-500 ml-3.5">Inflow vs Outflow rate (people/min)</p>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data.slice(0, 8)} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
                dataKey="name" 
                tick={axisStyle} 
                interval={0} 
                angle={-20} 
                textAnchor="end" 
                height={70} 
                stroke="#000" 
            />
            <YAxis tick={axisStyle} stroke="#000" width={40} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontWeight: 'bold' }} />
            <Area type="monotone" dataKey="inflowRate" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" name="Inflow" />
            <Area type="monotone" dataKey="outflowRate" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorOut)" name="Outflow" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

       {/* Correlation Line Chart */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 min-h-[420px] lg:col-span-2">
        <div className="mb-6">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <span className="w-1.5 h-6 bg-rose-600 rounded-full"></span>
                Risk vs. Environmental Factors
            </h3>
            <p className="text-sm text-gray-500 ml-3.5">Correlation between Crowd Risk Score and Air Quality Index (AQI)</p>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" hide />
            <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke="#e11d48" 
                tick={axisStyle} 
                label={{ value: 'Risk Score', angle: -90, position: 'insideLeft', ...labelStyle, fill: '#e11d48' }} 
            />
            <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#059669" 
                tick={axisStyle} 
                label={{ value: 'AQI Level', angle: 90, position: 'insideRight', ...labelStyle, fill: '#059669' }} 
            />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontWeight: 'bold' }} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
            <Line yAxisId="left" type="monotone" dataKey="riskScore" stroke="#e11d48" strokeWidth={3} dot={false} activeDot={{ r: 8 }} name="Risk Score (0-100)" />
            <Line yAxisId="right" type="monotone" dataKey="aqi" stroke="#059669" strokeWidth={3} dot={false} name="Air Quality (AQI)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
