
export type Scenario = 'Normal' | 'Festival' | 'Weekend' | 'Emergency';

export interface LocationData {
  id: string;
  name: string;
  lat: number;
  lon: number;
  baseCapacity: number;
  currentCrowd: number;
  riskScore: number;
  scenario: Scenario;
  confidence: number;
  inflowRate: number;
  outflowRate: number;
  temperature: number;
  humidity: number;
  aqi: number;
  lastUpdated: string;

  // --- Integrated Data Points (Data.gov.in & Smart City Hubs) ---
  // https://www.data.gov.in/catalog/electricity-varanasi-city
  electricityStatus: 'Stable' | 'Fluctuating' | 'Outage';
  
  // https://www.data.gov.in/catalog/street-lights-varanasi-city
  streetLightCoverage: number; // Percentage functional
  
  // https://www.data.gov.in/catalog/roads-varanasi-city
  roadCondition: 'Good' | 'Potholes' | 'Construction' | 'Blocked';
  
  // https://www.data.gov.in/catalog/solid-waste-management-varanasi-city
  wasteIndex: 'Clean' | 'Moderate' | 'High Accumulation';
  
  // https://www.data.gov.in/catalog/buses-varanasi-city
  busFrequency: number; // Buses per hour
  
  // https://www.data.gov.in/catalog/water-sanitationvaranasi-city
  sanitationScore: number; // 0-100 (Higher is better)

  // https://www.data.gov.in/catalog/diseases-varanasi-city
  diseaseRisk: 'Low' | 'Moderate' | 'High'; 
}

export interface Alert {
  id: string;
  locationName: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

export interface FilterState {
  scenario: Scenario | 'All';
  riskThreshold: number;
  confidenceThreshold: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
