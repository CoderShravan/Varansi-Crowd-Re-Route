import { LocationData, Scenario } from '../types';
import { VARANASI_LOCATIONS, SCENARIOS } from '../constants';

export const generateSyntheticData = (): LocationData[] => {
  return VARANASI_LOCATIONS.map((loc, index) => {
    // Random scenario selection logic
    const scenarioRand = Math.random();
    let scenario: Scenario = 'Normal';
    
    if (scenarioRand > 0.95) scenario = 'Emergency';
    else if (scenarioRand > 0.8) scenario = 'Weekend';
    else if (scenarioRand > 0.6) scenario = 'Festival';
    
    // Factors based on scenario
    let surgeRatio = 1.0;
    let confidenceBase = 0.95;

    switch (scenario) {
      case 'Festival':
        surgeRatio = 15.0 + Math.random() * 20.0; // 15x to 35x
        confidenceBase = 0.75;
        break;
      case 'Weekend':
        surgeRatio = 2.0 + Math.random() * 3.0;
        confidenceBase = 0.90;
        break;
      case 'Emergency':
        surgeRatio = 0.3 + Math.random() * 0.5;
        confidenceBase = 0.65;
        break;
      default:
        surgeRatio = 1.0 + Math.random();
        confidenceBase = 0.95;
    }

    const baseDensity = 0.5 + Math.random() * 1.5;
    const realTimeDensity = baseDensity * surgeRatio;
    
    // Risk score calculation (0-100)
    let riskScore = Math.min(100, realTimeDensity * surgeRatio * 5); // Multiplier adjusted for 0-100 scale visualization
    if (scenario === 'Festival') riskScore = Math.min(100, 50 + Math.random() * 50);

    const currentCrowd = Math.floor(loc.baseCapacity * surgeRatio * (0.8 + Math.random() * 0.4));
    const confidence = confidenceBase + (Math.random() * 0.1) - 0.05;

    const inflowRate = Math.floor((50 + Math.random() * 450) * surgeRatio);
    const outflowRate = Math.floor(inflowRate * (0.6 + Math.random() * 0.5));

    return {
      id: `loc-${index}`,
      name: loc.name,
      lat: loc.lat,
      lon: loc.lon,
      baseCapacity: loc.baseCapacity,
      currentCrowd,
      riskScore: Math.round(riskScore),
      scenario,
      confidence: Math.round(confidence * 100),
      inflowRate,
      outflowRate,
      temperature: Math.round(25 + Math.random() * 17),
      humidity: Math.round(40 + Math.random() * 45),
      aqi: Math.round(50 + Math.random() * 250),
      lastUpdated: new Date().toLocaleTimeString(),
    };
  });
};
