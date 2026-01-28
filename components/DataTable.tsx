import React from 'react';
import { LocationData } from '../types';

interface DataTableProps {
  data: LocationData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="overflow-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scenario</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crowd</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row) => {
                const capacityUtil = Math.round((row.currentCrowd / row.baseCapacity) * 100);
                return (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                ${row.scenario === 'Emergency' ? 'bg-red-100 text-red-800' : 
                                row.scenario === 'Festival' ? 'bg-purple-100 text-purple-800' : 
                                'bg-gray-100 text-gray-800'}`}>
                                {row.scenario}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.currentCrowd.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                             <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px]">
                                <div 
                                    className={`h-2.5 rounded-full ${capacityUtil > 90 ? 'bg-red-600' : capacityUtil > 70 ? 'bg-yellow-400' : 'bg-green-500'}`} 
                                    style={{ width: `${Math.min(capacityUtil, 100)}%` }}
                                ></div>
                            </div>
                            <span className="text-xs mt-1 block">{capacityUtil}%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`${row.riskScore > 75 ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                                {row.riskScore}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.confidence}%</td>
                    </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
