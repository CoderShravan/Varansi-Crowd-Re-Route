import React, { useState } from 'react';
import { LocationData, Alert } from '../types';
import { generateHindiAlert } from '../services/geminiService';
import { SparklesIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';

interface HindiAlertsProps {
  data: LocationData[];
}

const HindiAlerts: React.FC<HindiAlertsProps> = ({ data }) => {
  const [generatedAlerts, setGeneratedAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  // Filter for high risk locations
  const highRiskLocations = data.filter(d => d.riskScore > 60).sort((a, b) => b.riskScore - a.riskScore);

  const handleGenerateAlert = async (location: LocationData) => {
    setLoading(location.id);
    const hindiText = await generateHindiAlert(location);
    
    const newAlert: Alert = {
      id: Date.now().toString(),
      locationName: location.name,
      message: hindiText,
      severity: location.riskScore > 80 ? 'critical' : 'high',
      timestamp: new Date().toLocaleTimeString()
    };

    setGeneratedAlerts(prev => [newAlert, ...prev]);
    setLoading(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* List of Locations needing alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col h-full overflow-hidden">
        <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-orange-500">⚠️</span> Active Alerts Needed
        </h3>
        
        <div className="overflow-y-auto flex-1 space-y-3">
          {highRiskLocations.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No high-risk locations currently detected.</p>
          ) : (
            highRiskLocations.map(loc => (
              <div key={loc.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">{loc.name}</h4>
                  <p className="text-sm text-gray-500">Risk: <span className="text-red-500 font-bold">{loc.riskScore}</span> • Crowd: {loc.currentCrowd}</p>
                </div>
                <button
                  onClick={() => handleGenerateAlert(loc)}
                  disabled={loading === loc.id}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading === loc.id ? (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    <SparklesIcon className="w-4 h-4" />
                  )}
                  Generate AI Alert
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Generated Alerts Feed */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-xl shadow-lg p-5 flex flex-col h-full overflow-hidden relative">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span className="text-yellow-400">🗣️</span> Live Broadcast Feed (Hindi)
        </h3>

        <div className="overflow-y-auto flex-1 space-y-4 pr-2">
            {generatedAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-indigo-200 opacity-60">
                    <SparklesIcon className="w-16 h-16 mb-4" />
                    <p>Generated alerts will appear here</p>
                </div>
            ) : (
                generatedAlerts.map(alert => (
                    <div key={alert.id} className={`p-4 rounded-lg backdrop-blur-md bg-white/10 border ${alert.severity === 'critical' ? 'border-red-500/50' : 'border-indigo-400/30'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-mono opacity-70">{alert.timestamp}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${alert.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'}`}>
                                {alert.severity.toUpperCase()}
                            </span>
                        </div>
                        <h4 className="font-bold text-yellow-300 text-lg mb-2">{alert.locationName}</h4>
                        <p className="font-hindi text-xl leading-relaxed mb-3">
                            {alert.message}
                        </p>
                        <div className="flex justify-end">
                            <button className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors">
                                <SpeakerWaveIcon className="w-3 h-3" /> Play Audio (TTS)
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default HindiAlerts;
