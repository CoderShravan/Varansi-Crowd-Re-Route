
import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { LocationData } from '../types';

interface RiskMapProps {
  data: LocationData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as LocationData;
    return (
      <div className="bg-white p-4 rounded shadow-xl border border-gray-100 z-50 min-w-[240px]">
        <h4 className="font-bold text-gray-800 mb-2 border-b border-gray-100 pb-1">{data.name}</h4>
        
        {/* Key Metrics */}
        <div className="space-y-1 text-xs mb-3">
          <p className="flex justify-between">
              <span className="text-gray-500">Risk Score:</span> 
              <span className={`font-bold ${data.riskScore > 75 ? 'text-red-500' : 'text-green-600'}`}>{data.riskScore}</span>
          </p>
          <p className="flex justify-between">
              <span className="text-gray-500">Crowd Density:</span> 
              <span className="font-medium">{data.currentCrowd}</span>
          </p>
           <p className="flex justify-between">
              <span className="text-gray-500">AQI Level:</span> 
              <span className="font-medium text-orange-500">{data.aqi}</span>
          </p>
        </div>

        {/* Infrastructure Status */}
        <div className="bg-gray-50 p-2 rounded text-xs space-y-1">
            <p className="font-bold text-gray-600 text-[10px] uppercase">Infrastructure</p>
            <div className="flex justify-between items-center">
                <span>🛣️ Road:</span>
                <span className={`${data.roadCondition === 'Blocked' ? 'text-red-600 font-bold' : 'text-gray-700'}`}>{data.roadCondition}</span>
            </div>
            <div className="flex justify-between items-center">
                <span>⚡ Power:</span>
                <span className={`${data.electricityStatus === 'Outage' ? 'text-red-600 font-bold' : 'text-gray-700'}`}>{data.electricityStatus}</span>
            </div>
             <div className="flex justify-between items-center">
                <span>🗑️ Waste:</span>
                <span className={`${data.wasteIndex === 'High Accumulation' ? 'text-orange-600' : 'text-gray-700'}`}>{data.wasteIndex}</span>
            </div>
        </div>
      </div>
    );
  }
  return null;
};

const RiskMap: React.FC<RiskMapProps> = ({ data }) => {
  const [showTraffic, setShowTraffic] = useState(false);

  // We use lat/lon but mapped to a scatter plot
  // Varanasi approx range: Lat 25.26 - 25.38, Lon 82.98 - 83.04
  
  return (
    <div className="h-full w-full bg-blue-50 relative rounded-xl overflow-hidden border border-blue-100 shadow-inner">
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-sm z-10 text-xs flex flex-col items-end gap-2">
         <div className="flex items-center gap-2">
             <span className="font-bold text-gray-700">Overlay:</span>
             <button 
                onClick={() => setShowTraffic(!showTraffic)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${showTraffic ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
             >
                 {showTraffic ? 'Traffic Flow' : 'Crowd Risk'}
             </button>
         </div>
         
         <div className="bg-gray-50 p-2 rounded border border-gray-100 w-full">
             <h5 className="font-bold mb-2 text-gray-600">{showTraffic ? 'Traffic Congestion' : 'Crowd Risk Level'}</h5>
             <div className="flex items-center gap-2 mb-1">
                 <div className={`w-3 h-3 rounded-full ${showTraffic ? 'bg-red-600' : 'bg-red-500'}`}></div> 
                 {showTraffic ? 'Heavy Congestion' : 'Critical (>75)'}
             </div>
             <div className="flex items-center gap-2 mb-1">
                 <div className={`w-3 h-3 rounded-full ${showTraffic ? 'bg-yellow-500' : 'bg-orange-400'}`}></div> 
                 {showTraffic ? 'Moderate Flow' : 'High (>50)'}
             </div>
             <div className="flex items-center gap-2">
                 <div className={`w-3 h-3 rounded-full ${showTraffic ? 'bg-emerald-500' : 'bg-green-500'}`}></div> 
                 {showTraffic ? 'Free Flow' : 'Normal'}
             </div>
         </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          {/* Hide Axis to make it look like a map */}
          <XAxis type="number" dataKey="lon" domain={['auto', 'auto']} hide />
          <YAxis type="number" dataKey="lat" domain={['auto', 'auto']} hide />
          <ZAxis type="number" dataKey={showTraffic ? "inflowRate" : "riskScore"} range={[100, 1000]} /> {/* Bubble size */}
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Locations" data={data}>
            {data.map((entry, index) => {
              let color = '#22c55e'; // Green default
              
              if (showTraffic) {
                  // Traffic coloring based on inflow/outflow balance or raw inflow
                  if (entry.inflowRate > 300) color = '#dc2626'; // Heavy Red
                  else if (entry.inflowRate > 150) color = '#eab308'; // Moderate Yellow
                  else color = '#10b981'; // Free Emerald
              } else {
                  // Risk coloring
                  if (entry.riskScore > 75) color = '#ef4444'; // Red
                  else if (entry.riskScore > 50) color = '#f97316'; // Orange
              }
              
              return <Cell key={`cell-${index}`} fill={color} stroke="#fff" strokeWidth={2} />;
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Decorative River Element to simulate Ganges */}
      <div className="absolute top-0 right-10 h-full w-32 bg-blue-200/30 blur-3xl rounded-full pointer-events-none transform -skew-x-12"></div>
      
      <div className="absolute bottom-4 left-4 text-gray-400 text-xs font-mono">
        Geospatial Visualization: Varanasi District • {showTraffic ? 'Real-time Traffic Mode' : 'Risk Analysis Mode'}
      </div>
    </div>
  );
};

export default RiskMap;
