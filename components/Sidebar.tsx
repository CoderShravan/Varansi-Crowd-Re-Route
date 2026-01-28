
import React, { useState } from 'react';
import { FilterState, LocationData, Scenario } from '../types';
import { SCENARIOS } from '../constants';
import { 
  MapIcon, 
  ChartBarIcon, 
  TableCellsIcon, 
  LanguageIcon, 
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon,
  Bars3Icon,
  XMarkIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon
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

  const navItems = [
    { id: 'map', label: 'Live Risk Map', icon: MapIcon, desc: 'Real-time heatmap' },
    { id: 'safe-routes', label: 'Safe Routes & Chat', icon: ShieldCheckIcon, desc: 'AI Pilgrim Guide' },
    { id: 'alerts', label: 'Hindi Alerts', icon: LanguageIcon, desc: 'Public Announcements' },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon, desc: 'Trends & Stats' },
    { id: 'data', label: 'Sensor Data', icon: TableCellsIcon, desc: 'Raw feed' },
    { id: 'vision', label: 'Project Vision', icon: LightBulbIcon, desc: 'About the tech' },
  ];

  const BrandLogo = () => (
    <div className="flex items-center gap-3 px-2">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 ring-1 ring-white/10">
        <span className="text-xl">🕉️</span>
      </div>
      <div className="flex flex-col">
        <h1 className="font-bold text-white tracking-tight leading-none text-lg">Varanasi</h1>
        <span className="text-[10px] uppercase tracking-[0.2em] text-orange-400 font-bold mt-0.5">Crowd Command</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0f172a] p-4 flex items-center justify-between border-b border-gray-800 z-40 sticky top-0 flex-shrink-0">
        <BrandLogo />
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
        fixed inset-y-0 left-0 z-50 w-[280px] bg-[#0f172a] text-gray-300 flex flex-col h-full border-r border-gray-800 shadow-2xl transform transition-transform duration-300 ease-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-screen md:shadow-none
      `}>
        
        {/* Header Section */}
        <div className="p-6 pb-4">
          <div className="hidden md:block mb-8">
            <BrandLogo />
          </div>
          <div className="md:hidden flex justify-between items-center mb-6">
               <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Navigation</span>
               <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-gray-400 hover:text-white bg-white/5 rounded-md"
               >
                 <XMarkIcon className="w-6 h-6" />
               </button>
          </div>

          {/* Dynamic Status Card */}
          <div className={`rounded-xl p-4 border transition-all duration-300 relative overflow-hidden ${
             highRiskCount > 0 
                ? 'bg-red-500/10 border-red-500/20' 
                : 'bg-emerald-500/10 border-emerald-500/20'
          }`}>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                    highRiskCount > 0 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                    {highRiskCount > 0 ? 'Critical Alerts' : 'System Status'}
                </p>
                <div className="flex items-baseline gap-1.5">
                    <span className={`text-2xl font-bold ${
                        highRiskCount > 0 ? 'text-white' : 'text-emerald-100'
                    }`}>
                        {highRiskCount > 0 ? highRiskCount : 'Normal'}
                    </span>
                    {highRiskCount > 0 && <span className="text-xs text-red-300">zones at risk</span>}
                </div>
              </div>
              <div className={`p-2 rounded-lg ${
                  highRiskCount > 0 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                  {highRiskCount > 0 ? <ExclamationTriangleIcon className="w-5 h-5" /> : <ShieldCheckIcon className="w-5 h-5" />}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 mb-2">Modules</div>
            {navItems.map(tab => (
                <button
                key={tab.id}
                onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                    activeTab === tab.id 
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
                >
                <tab.icon className={`w-5 h-5 flex-shrink-0 ${
                    activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                }`} />
                <div className="flex-1 text-left">
                    <span className={`block text-sm font-medium ${activeTab === tab.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                        {tab.label}
                    </span>
                </div>
                {activeTab === tab.id && <ChevronRightIcon className="w-4 h-4 text-white/50" />}
                </button>
            ))}
        </nav>

        {/* Control Panel Section */}
        <div className="p-5 bg-black/20 border-t border-gray-800 flex-shrink-0 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4 text-orange-400">
            <AdjustmentsHorizontalIcon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Simulation Control</span>
          </div>
          
          <div className="space-y-5">
            {/* Scenario Selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500">Active Scenario</label>
              <div className="relative">
                <select
                    value={filters.scenario}
                    onChange={(e) => setFilters(prev => ({ ...prev, scenario: e.target.value as Scenario | 'All' }))}
                    className="w-full appearance-none bg-[#1e293b] hover:bg-[#253045] text-white border border-gray-700 hover:border-gray-600 rounded-lg pl-3 pr-8 py-2.5 text-xs font-medium focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors cursor-pointer"
                >
                    <option value="All">🌐 Global View</option>
                    {SCENARIOS.map(s => <option key={s} value={s}>{s === 'Normal' ? '🟢' : s === 'Emergency' ? '🔴' : '🟡'} {s}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
              </div>
            </div>

            {/* Risk Threshold Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[10px] uppercase font-bold text-gray-500">Risk Threshold</label>
                <span className="text-xs font-mono font-bold text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded">
                    {filters.riskThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.riskThreshold}
                onChange={(e) => setFilters(prev => ({ ...prev, riskThreshold: parseInt(e.target.value) }))}
                className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400"
              />
              <div className="flex justify-between text-[9px] text-gray-600 font-medium uppercase">
                  <span>Sensitive</span>
                  <span>Strict</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
