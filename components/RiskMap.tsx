import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LocationData } from '../types';

interface RiskMapProps {
  data: LocationData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as LocationData;
    return (
      <div className="bg-white p-4 rounded shadow-xl border border-gray-100 z-50 min-w-[200px]">
        <h4 className="font-bold text-gray-800 mb-1">{data.name}</h4>
        <div className="space-y-1 text-sm">
          <p className="flex justify-between"><span>Risk Score:</span> <span className={`font-bold ${data.riskScore > 75 ? 'text-red-500' : 'text-green-600'}`}>{data.riskScore}</span></p>
          <p className="flex justify-between"><span>Crowd:</span> <span>{data.currentCrowd}</span></p>
          <p className="flex justify-between"><span>Scenario:</span> <span>{data.scenario}</span></p>
          <p className="flex justify-between"><span>AQI:</span> <span>{data.aqi}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

const RiskMap: React.FC<RiskMapProps> = ({ data }) => {
  // We use lat/lon but mapped to a scatter plot
  // Varanasi approx range: Lat 25.26 - 25.38, Lon 82.98 - 83.04
  
  return (
    <div className="h-full w-full bg-blue-50 relative rounded-xl overflow-hidden border border-blue-100 shadow-inner">
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-sm z-10 text-xs">
         <h5 className="font-bold mb-2">Map Legend</h5>
         <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Critical (>75)</div>
         <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-orange-400"></div> High (>50)</div>
         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Normal</div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          {/* Hide Axis to make it look like a map */}
          <XAxis type="number" dataKey="lon" domain={['auto', 'auto']} hide />
          <YAxis type="number" dataKey="lat" domain={['auto', 'auto']} hide />
          <ZAxis type="number" dataKey="riskScore" range={[100, 1000]} /> {/* Bubble size based on risk */}
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Locations" data={data}>
            {data.map((entry, index) => {
              let color = '#22c55e'; // Green
              if (entry.riskScore > 75) color = '#ef4444'; // Red
              else if (entry.riskScore > 50) color = '#f97316'; // Orange
              
              return <Cell key={`cell-${index}`} fill={color} stroke="#fff" strokeWidth={2} />;
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Decorative River Element to simulate Ganges */}
      <div className="absolute top-0 right-10 h-full w-32 bg-blue-200/30 blur-3xl rounded-full pointer-events-none transform -skew-x-12"></div>
      
      <div className="absolute bottom-4 left-4 text-gray-400 text-xs font-mono">
        Geospatial Visualization: Varanasi District
      </div>
    </div>
  );
};

export default RiskMap;
