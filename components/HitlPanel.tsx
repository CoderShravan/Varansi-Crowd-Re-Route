import React, { useState, useMemo } from 'react';
import { LocationData } from '../types';
import { 
    CheckCircleIcon, 
    XCircleIcon, 
    ExclamationTriangleIcon, 
    UserGroupIcon, 
    VideoCameraIcon,
    BoltIcon,
    CpuChipIcon
} from '@heroicons/react/24/solid';

interface HitlPanelProps {
  data: LocationData[];
  confidenceThreshold: number;
}

const HitlPanel: React.FC<HitlPanelProps> = ({ data, confidenceThreshold }) => {
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [autoResolve, setAutoResolve] = useState(true);

  // Filter raw low confidence data
  const rawLowConfidenceData = useMemo(() => {
    return data.filter(d => d.confidence < confidenceThreshold && !reviewedIds.has(d.id));
  }, [data, confidenceThreshold, reviewedIds]);

  // Apply "50/50" logic: If autoResolve is on, we filter out roughly half the items deterministically
  // to simulate AI handling the "easy" cases.
  const displayData = useMemo(() => {
    if (!autoResolve) return rawLowConfidenceData;
    return rawLowConfidenceData.filter((_, index) => index % 2 === 0); // Keep every 2nd item
  }, [rawLowConfidenceData, autoResolve]);

  const autoResolvedCount = rawLowConfidenceData.length - displayData.length;

  const handleAction = (id: string, action: 'dispatch' | 'verify' | 'dismiss') => {
    // In a real app, this would send an API request
    setReviewedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  if (data.length === 0) return null;

  return (
    <div className="h-full flex flex-col bg-gray-50/50 -m-4 p-4">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <UserGroupIcon className="w-6 h-6 text-indigo-600" />
                Field Operations Center
            </h2>
            <p className="text-sm text-gray-500 mt-1">
                Manage low-confidence AI predictions via ground teams or CCTV verification.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
             <div className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${autoResolve ? 'bg-indigo-600' : ''}`} onClick={() => setAutoResolve(!autoResolve)}>
                 <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${autoResolve ? 'translate-x-4' : ''}`}></div>
             </div>
             <div className="text-sm">
                 <span className="font-bold text-gray-700 block">AI Auto-Pilot (50/50)</span>
                 <span className="text-xs text-gray-500">Auto-resolve minor issues</span>
             </div>
          </div>
        </div>

        {autoResolve && autoResolvedCount > 0 && (
             <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-md border border-green-200 animate-fadeIn">
                 <BoltIcon className="w-4 h-4" />
                 <span>{autoResolvedCount} alerts were automatically resolved by AI using historical training data.</span>
             </div>
        )}
      </div>

      {/* Task List */}
      {displayData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-gray-200 border-dashed m-2 min-h-[300px]">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-gray-600">All Sectors Clear</h3>
          <p className="text-sm">No manual intervention required at this moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-4 custom-scrollbar">
            {displayData.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-0 overflow-hidden hover:shadow-md transition-all group">
                {/* Card Header */}
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                    <ExclamationTriangleIcon className="w-3 h-3" />
                                    Confidence: {item.confidence}%
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">Sensor ID: CAM-{item.id.split('-')[1]}</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm border border-red-200 shadow-sm">
                            {item.riskScore}
                        </div>
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="space-y-1">
                            <span className="text-xs text-gray-400 uppercase font-semibold">Crowd Est.</span>
                            <p className="font-mono text-gray-800">{item.currentCrowd.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-gray-400 uppercase font-semibold">Anomaly Type</span>
                            <p className="text-gray-800 text-sm">{item.scenario === 'Normal' ? 'Unexpected Surge' : item.scenario}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => handleAction(item.id, 'dispatch')}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                        >
                            <UserGroupIcon className="w-4 h-4" />
                            Dispatch Scout
                        </button>
                        <button 
                            onClick={() => handleAction(item.id, 'verify')}
                            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <VideoCameraIcon className="w-4 h-4 text-gray-500" />
                            Remote Verify
                        </button>
                    </div>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default HitlPanel;