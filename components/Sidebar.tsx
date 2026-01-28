
import React, { useState } from 'react';
import { FilterState, LocationData, Scenario } from '../types';
import { SCENARIOS } from '../constants';
import { 
  MapIcon, 
  ChartBarIcon, 
  TableCellsIcon, 
  LanguageIcon, 
  ShieldCheckIcon,
  FunnelIcon,
  Bars3Icon,
  XMarkIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  data: LocationData[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, data, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const highRiskCount = data.filter(d => d.riskScore >= filters.riskThreshold).length;

  const tabs = [
    { id: 'map', label: 'Live Risk Map', icon: MapIcon },
    { id: 'safe-routes', label: 'Safe Routes & Chat', icon: ShieldCheckIcon },
    { id: 'vision', label: 'Project Vision', icon: LightBulbIcon },
    { id: 'alerts', label: 'Hindi Alerts', icon: LanguageIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'data', label: 'Sensor Data', icon: TableCellsIcon },
  ];

  const BrandLogo = () => (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
        <span className="text-xl">🕉️</span>
      </div>
      <div>
        <h1 className="font-bold text-white tracking-wide leading-none text-lg">Varanasi</h1>
        <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold">Crowd AI</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0b0c10] p-4 flex items-center justify-between border-b border-gray-800 z-40 sticky top-0 flex-shrink-0">
        <BrandLogo />
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0b0c10] text-gray-300 flex flex-col h-full border-r border-gray-800 shadow-2xl transform transition-transform duration-300 ease-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:w-64 md:h-screen md:shadow-none
      `}>
        
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between mb-8">
            <div className="hidden md:block">
              <BrandLogo />
            </div>
            <div className="md:hidden w-full flex justify-between items-center">
               <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Menu</span>
               <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-gray-400 hover:text-white bg-gray-900 rounded-md"
               >
                 <XMarkIcon className="w-6 h-6" />
               </button>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 relative overflow-hidden group mb-2">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">High Risk Zones</p>
                <p className={`text-3xl font-bold ${highRiskCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {highRiskCount} <span className="text-sm font-medium text-gray-600">/ {data.length}</span>
                </p>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full mb-1.5 ${highRiskCount > 0 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-orange-500/10 to-transparent text-orange-400 border border-orange-500/20' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'
              }`}
            >
              <tab.icon className={`w-5 h-5 transition-colors ${activeTab === tab.id ? 'text-orange-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
              <span>{tab.label}</span>
              {activeTab === tab.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>}
            </button>
          ))}
        </nav>

        <div className="p-5 bg-[#0e0f13] border-t border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2 mb-4 text-gray-400">
            <FunnelIcon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Configuration</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-600 mb-1.5 block">Scenario Mode</label>
              <select
                value={filters.scenario}
                onChange={(e) => setFilters(prev => ({ ...prev, scenario: e.target.value as Scenario | 'All' }))}
                className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg px-3 py-2 text-xs focus:border-orange-500 outline-none"
              >
                <option value="All">Global View</option>
                {SCENARIOS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-600">Risk Threshold</label>
                <span className="text-xs font-mono text-orange-400">{filters.riskThreshold}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.riskThreshold}
                onChange={(e) => setFilters(prev => ({ ...prev, riskThreshold: parseInt(e.target.value) }))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-600">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> System Online
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
