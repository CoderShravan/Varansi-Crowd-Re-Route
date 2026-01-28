
import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { LocationData } from '../types';

interface RiskMapProps {
  data: LocationData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as LocationData;
    return (
      <div className="bg-white p-4 rounded shadow-xl border border-gray-100 z-50 min-w-[240px]">
        <h4 className="font-bold text-gray-900 mb-2 border-b border-gray-100 pb-1">{data.name}</h4>
        
        {/* Key Metrics */}
        <div className="space-y-1 text-xs mb-3">
          <p className="flex justify-between">
              <span className="text-gray-500">Risk Score:</span> 
              <span className={`font-bold ${data.riskScore > 75 ? 'text-red-600' : 'text-green-600'}`}>{data.riskScore}</span>
          </p>
          <p className="flex justify-between">
              <span className="text-gray-500">Crowd Density:</span> 
              <span className="font-medium text-gray-900">{data.currentCrowd}</span>
          </p>
           <p className="flex justify-between">
              <span className="text-gray-500">AQI Level:</span> 
              <span className="font-medium text-orange-600">{data.aqi}</span>
          </p>
        </div>

        {/* Infrastructure Status */}
        <div className="bg-gray-50 p-2 rounded text-xs space-y-1 border border-gray-100">
            <p className="font-bold text-gray-700 text-[10px] uppercase">Infrastructure</p>
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

// Render custom labels on the map for significant points
const CustomLabel = (props: any) => {
    const { x, y, value, index, payload } = props;
    
    // Safety check: payload might be undefined in some render cycles
    if (!payload) return null;

    // Only show label if risk is high or it's a major hub to reduce clutter
    const isImportant = payload.riskScore > 50 || payload.currentCrowd > 4000;
    
    if (!isImportant) return null;

    return (
        <text 
            x={x} 
            y={y - 15} 
            dy={0} 
            fill="#111827" 
            fontSize={10} 
            fontWeight="bold" 
            textAnchor="middle"
            className="pointer-events-none drop-shadow-md bg-white/90"
        >
            {value}
        </text>
    );
};

const RiskMap: React.FC<RiskMapProps> = ({ data }) => {
  const [showTraffic, setShowTraffic] = useState(false);

  return (
    <div className="h-full w-full bg-[#f0f9ff] relative rounded-2xl overflow-hidden border border-blue-100 shadow-inner">
      
      {/* Map Controls & Legend - COMPACT VERSION */}
      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100 z-10 w-48 scale-90 origin-top-right">
         <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-1">
             <span className="font-bold text-gray-800 text-xs">Visualization Mode</span>
         </div>
         
         <div className="flex bg-gray-100 p-0.5 rounded-md mb-3">
             <button 
                onClick={() => setShowTraffic(false)}
                className={`flex-1 py-1 text-[10px] font-bold rounded transition-all ${!showTraffic ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                 Risk
             </button>
             <button 
                onClick={() => setShowTraffic(true)}
                className={`flex-1 py-1 text-[10px] font-bold rounded transition-all ${showTraffic ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                 Flow
             </button>
         </div>
         
         <div>
             <h5 className="font-bold mb-1.5 text-[10px] text-gray-500 uppercase tracking-wider">Legend</h5>
             <div className="space-y-1.5">
                 <div className="flex items-center gap-2">
                     <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm ring-1 ring-red-200"></span>
                     <span className="text-[10px] text-gray-700 font-medium">{showTraffic ? 'High Jam' : 'Critical (>75)'}</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-sm ring-1 ring-orange-200"></span>
                     <span className="text-[10px] text-gray-700 font-medium">{showTraffic ? 'Moderate' : 'High Risk (>50)'}</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm ring-1 ring-emerald-200"></span>
                     <span className="text-[10px] text-gray-700 font-medium">{showTraffic ? 'Free Flow' : 'Safe / Normal'}</span>
                 </div>
             </div>
         </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
        >
          {/* Hide Axis to make it look like a map */}
          <XAxis type="number" dataKey="lon" domain={['auto', 'auto']} hide />
          <YAxis type="number" dataKey="lat" domain={['auto', 'auto']} hide />
          <ZAxis type="number" dataKey={showTraffic ? "inflowRate" : "riskScore"} range={[60, 600]} /> {/* Increased bubble size range */}
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Locations" data={data}>
            {data.map((entry, index) => {
              let color = '#22c55e'; // Green default
              
              if (showTraffic) {
                  if (entry.inflowRate > 300) color = '#dc2626'; // Heavy Red
                  else if (entry.inflowRate > 150) color = '#facc15'; // Moderate Yellow
                  else color = '#10b981'; // Free Emerald
              } else {
                  if (entry.riskScore > 75) color = '#ef4444'; // Red
                  else if (entry.riskScore > 50) color = '#f97316'; // Orange
              }
              
              return <Cell key={`cell-${index}`} fill={color} stroke="white" strokeWidth={2} />;
            })}
            {/* THIS ADDS THE LABELS TO THE DOTS */}
            <LabelList dataKey="name" content={<CustomLabel />} />
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Decorative River Element (Ganges) - Improved Shape */}
      <div className="absolute top-0 right-[10%] h-full w-[15%] bg-blue-300/20 blur-2xl rounded-full pointer-events-none transform -skew-x-12 rotate-3"></div>
      
      <div className="absolute bottom-4 left-6 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
        <p className="text-gray-500 text-[10px] font-mono tracking-wide">
            GEOSPATIAL LIVE VIEW • VARANASI DISTRICT
        </p>
      </div>
    </div>
  );
};

export default RiskMap;
