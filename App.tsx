
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RiskMap from './components/RiskMap';
import HindiAlerts from './components/HindiAlerts';
import Analytics from './components/Analytics';
import DataTable from './components/DataTable';
import SafeRoutes from './components/SafeRoutes';
import VisionPanel from './components/SimulationPanel'; // Importing Vision from the same file path as instructed
import { generateSyntheticData } from './utils/dataGenerator';
import { LocationData, FilterState } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<LocationData[]>([]);
  const [filteredData, setFilteredData] = useState<LocationData[]>([]);
  const [activeTab, setActiveTab] = useState('map');
  const [filters, setFilters] = useState<FilterState>({
    scenario: 'All',
    riskThreshold: 60,
    confidenceThreshold: 90,
  });

  useEffect(() => {
    const initData = generateSyntheticData();
    setData(initData);
    const interval = setInterval(() => {
      setData(generateSyntheticData());
    }, 10000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let result = data;
    if (filters.scenario !== 'All') {
      result = result.filter(d => d.scenario === filters.scenario);
    }
    setFilteredData(result);
  }, [data, filters.scenario]);

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return <RiskMap data={filteredData} />;
      case 'safe-routes':
        return <SafeRoutes data={filteredData} />;
      case 'vision':
        return <VisionPanel onStartDemo={() => setActiveTab('map')} />;
      case 'alerts':
        return <HindiAlerts data={filteredData} />;
      case 'analytics':
        return <Analytics data={filteredData} />;
      case 'data':
        return <DataTable data={filteredData} />;
      default:
        return <RiskMap data={filteredData} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#f8f9fa]">
      <Sidebar 
        filters={filters} 
        setFilters={setFilters} 
        data={data} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <header className="px-5 py-4 md:px-8 md:py-6 flex-shrink-0 bg-white md:bg-transparent border-b md:border-none border-gray-100 flex items-center justify-between">
            <div>
                <h2 className="text-xl md:text-3xl font-bold text-gray-800 tracking-tight">
                    {activeTab === 'map' && 'Live Risk Heatmap'}
                    {activeTab === 'safe-routes' && 'Safe Routes & AI Guide'}
                    {activeTab === 'vision' && 'Our Vision & Solution'}
                    {activeTab === 'alerts' && 'Hindi Public Alerts'}
                    {activeTab === 'analytics' && 'Operational Analytics'}
                    {activeTab === 'data' && 'Sensor Network Data'}
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium">
                    Monitoring {filteredData.length} active zones • Last Sync: {new Date().toLocaleTimeString()}
                </p>
            </div>
            
            <div className="hidden md:flex items-center gap-3">
               {/* API Key warning removed to avoid false positives */}
            </div>
        </header>

        <div className="flex-1 min-h-0 bg-white md:rounded-3xl md:shadow-[0_0_40px_-10px_rgba(0,0,0,0.05)] md:border md:border-gray-200 md:mx-6 md:mb-6 overflow-hidden relative">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
