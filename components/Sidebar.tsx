import React from 'react';
import { FilterState, LocationData, Scenario } from '../types';
import { SCENARIOS } from '../constants';
import { 
  AdjustmentsHorizontalIcon, 
  MapIcon, 
  ChartBarIcon, 
  TableCellsIcon, 
  LanguageIcon, 
  EyeIcon 
} from '@heroicons/react/24/outline';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  data: LocationData[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, data, activeTab, setActiveTab }) => {
  const highRiskCount = data.filter(d => d.riskScore >= filters.riskThreshold).length;
  const needsReviewCount = data.filter(d => d.confidence < filters.confidenceThreshold).length;

  const tabs = [
    { id: 'map', label: 'Risk Heatmap', icon: MapIcon },
    { id: 'hitl', label: 'Human-in-the-Loop', icon: EyeIcon },
    { id: 'alerts', label: 'Hindi Alerts', icon: LanguageIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'data', label: 'Data Table', icon: TableCellsIcon },
  ];

  return (
    <div className="w-full md:w-72 bg-gray-900 text-white flex-shrink-0 flex flex-col h-screen overflow-y-auto sticky top-0">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-3xl">🕉️</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-200 bg-clip-text text-transparent">
            Varanasi CMS
          </h1>
        </div>
        <p className="text-xs text-gray-400">AI-Powered Crowd Flow Prediction</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-3 rounded-lg text-center shadow-lg">
            <p className="text-2xl font-bold">{highRiskCount}</p>
            <p className="text-xs text-red-100">High Risk Zones</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-3 rounded-lg text-center shadow-lg">
            <p className="text-2xl font-bold">{needsReviewCount}</p>
            <p className="text-xs text-yellow-100">Needs Review</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
            <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Navigation</p>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-orange-600 text-white shadow-md' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
        </nav>

        {/* Controls */}
        <div className="space-y-4 pt-4 border-t border-gray-700">
          <p className="text-xs uppercase text-gray-500 font-semibold">Filters & Thresholds</p>
          
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Scenario Filter</label>
            <select
              value={filters.scenario}
              onChange={(e) => setFilters(prev => ({ ...prev, scenario: e.target.value as Scenario | 'All' }))}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="All">All Scenarios</option>
              {SCENARIOS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block flex justify-between">
              <span>Risk Threshold</span>
              <span className="text-orange-400">{filters.riskThreshold}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.riskThreshold}
              onChange={(e) => setFilters(prev => ({ ...prev, riskThreshold: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block flex justify-between">
              <span>Confidence (HITL)</span>
              <span className="text-yellow-400">{filters.confidenceThreshold}%</span>
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={filters.confidenceThreshold}
              onChange={(e) => setFilters(prev => ({ ...prev, confidenceThreshold: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
