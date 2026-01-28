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
