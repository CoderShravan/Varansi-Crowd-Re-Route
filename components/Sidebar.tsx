import React from 'react';
import { FilterState, LocationData, Scenario } from '../types';
import { SCENARIOS } from '../constants';
import { 
  MapIcon, 
  ChartBarIcon, 
  TableCellsIcon, 
  LanguageIcon, 
  ShieldCheckIcon,
  FunnelIcon
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

  const tabs = [
    { id: 'map', label: 'Live Risk Map', icon: MapIcon },
    { id: 'safe-routes', label: 'Safe Routes', icon: ShieldCheckIcon },
    { id: 'alerts', label: 'Hindi Alerts', icon: LanguageIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'data', label: 'Sensor Data', icon: TableCellsIcon },
  ];

  return (
    <div className="w-full md:w-64 bg-[#0b0c10] text-gray-300 flex-shrink-0 flex flex-col h-screen overflow-y-auto border-r border-gray-800 sticky top-0 z-50">
      {/* Brand Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <span className="text-lg font-bold">🕉️</span>
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide leading-none">Varanasi</h1>
            <span className="text-[10px] uppercase tracking-widest text-orange-500 font-semibold">Crowd AI</span>
          </div>
        </div>

        {/* Live Status Widget */}
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex justify-between items-end">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">High Risk Zones</p>
              <p className={`text-2xl font-bold ${highRiskCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {highRiskCount} <span className="text-sm font-normal text-gray-500">/ {data.length}</span>
              </p>
            </div>
            <div className={`w-2 h-2 rounded-full mb-2 ${highRiskCount > 0 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
              activeTab === tab.id 
                ? 'bg-orange-500/10 text-orange-400 border-l-2 border-orange-500 pl-[10px]' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border-l-2 border-transparent'
            }`}
          >
            <tab.icon className={`w-5 h-5 transition-colors ${activeTab === tab.id ? 'text-orange-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Controls Footer */}
      <div className="p-5 bg-[#0f1014] border-t border-gray-800">
        <div className="flex items-center gap-2 mb-4 text-gray-400">
          <FunnelIcon className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Configuration</span>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium">Simulation Scenario</label>
            <div className="relative">
              <select
                value={filters.scenario}
                onChange={(e) => setFilters(prev => ({ ...prev, scenario: e.target.value as Scenario | 'All' }))}
                className="w-full bg-gray-800/50 text-gray-200 border border-gray-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 appearance-none cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <option value="All">All Scenarios</option>
                {SCENARIOS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs text-gray-500 font-medium">Risk Threshold</label>
              <span className="text-xs font-mono text-orange-400 bg-orange-400/10 px-1.5 rounded">{filters.riskThreshold}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.riskThreshold}
              onChange={(e) => setFilters(prev => ({ ...prev, riskThreshold: parseInt(e.target.value) }))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400"
            />
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-800 text-[10px] text-gray-600 text-center">
           System Status: <span className="text-emerald-500">Online</span> • v1.2
        </div>
      </div>
    </div>
  );
};

export default Sidebar;