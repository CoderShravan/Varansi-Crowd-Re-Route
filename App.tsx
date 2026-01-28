import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RiskMap from './components/RiskMap';
import HindiAlerts from './components/HindiAlerts';
import Analytics from './components/Analytics';
import DataTable from './components/DataTable';
import SafeRoutes from './components/SafeRoutes';
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

  // Simulate real-time data updates
  useEffect(() => {
    const initData = generateSyntheticData();
    setData(initData);

    const interval = setInterval(() => {
      // Refresh data slightly to simulate real-time sensors
      setData(generateSyntheticData());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Apply Filters
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
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
      <Sidebar 
        filters={filters} 
        setFilters={setFilters} 
        data={data} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <main className="flex-1 p-6 h-full overflow-hidden flex flex-col">
        <header className="mb-4 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">
                    {activeTab === 'map' && 'Real-time Risk Heatmap'}
                    {activeTab === 'safe-routes' && 'Safe Routes & Smart Guide'}
                    {activeTab === 'alerts' && 'AI-Generated Hindi Alerts'}
                    {activeTab === 'analytics' && 'Crowd Analytics Dashboard'}
                    {activeTab === 'data' && 'Live Sensor Data'}
                </h2>
                <p className="text-sm text-gray-500">
                    Monitoring {filteredData.length} active locations
                    {filters.scenario !== 'All' && ` during ${filters.scenario} scenario`}
                </p>
            </div>
            
            {!process.env.API_KEY && (activeTab === 'alerts' || activeTab === 'safe-routes') && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm border border-red-200">
                    Warning: API_KEY not set for Gemini
                </div>
            )}
        </header>

        <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 overflow-hidden">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;