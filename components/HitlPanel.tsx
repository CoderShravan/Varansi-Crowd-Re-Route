import React, { useState } from 'react';
import { LocationData } from '../types';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface HitlPanelProps {
  data: LocationData[];
  confidenceThreshold: number;
}

const HitlPanel: React.FC<HitlPanelProps> = ({ data, confidenceThreshold }) => {
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  const lowConfidenceData = data.filter(
    d => d.confidence < confidenceThreshold && !reviewedIds.has(d.id)
  );

  const handleAction = (id: string) => {
    setReviewedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  if (lowConfidenceData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-700">All Clear!</h3>
        <p>No predictions require manual review at this time.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {lowConfidenceData.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md border-l-4 border-yellow-400 p-5 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Confidence: {item.confidence}%
                </span>
              </div>
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
              <div className="bg-gray-50 p-2 rounded">
                <span className="block text-xs text-gray-400 uppercase">Predicted Crowd</span>
                <span className="font-semibold text-gray-900">{item.currentCrowd}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="block text-xs text-gray-400 uppercase">Risk Score</span>
                <span className="font-semibold text-gray-900">{item.riskScore}/100</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="block text-xs text-gray-400 uppercase">Scenario</span>
                <span className="font-semibold text-gray-900">{item.scenario}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="block text-xs text-gray-400 uppercase">Sensors</span>
                <span className="font-semibold text-gray-900">Cam-2, Cam-5</span>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => handleAction(item.id)}
                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-2 px-4 rounded border border-green-200 flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Validate
              </button>
              <button 
                onClick={() => handleAction(item.id)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-2 px-4 rounded border border-red-200 flex items-center justify-center gap-2 transition-colors"
              >
                <XCircleIcon className="w-5 h-5" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HitlPanel;
