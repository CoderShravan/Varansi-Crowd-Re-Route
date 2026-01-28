
import { LocationData, Scenario } from '../types';
import { VARANASI_LOCATIONS } from '../constants';

/**
 * GENERATOR ENGINE
 * Integrates logic based on datasets from:
 * - Electricity: https://www.data.gov.in/catalog/electricity-varanasi-city
 * - Governance: https://www.data.gov.in/catalog/governance-varanasi-city
 * - Diseases: https://www.data.gov.in/catalog/diseases-varanasi-city
 * - Housing/Slums: https://www.data.gov.in/catalog/housing-slums-varanasi-city
 * - Street Lights: https://www.data.gov.in/catalog/street-lights-varanasi-city
 * - Roads: https://www.data.gov.in/catalog/roads-varanasi-city
 * - Solid Waste: https://www.data.gov.in/catalog/solid-waste-management-varanasi-city
 * - Buses/Transport: https://www.data.gov.in/catalog/buses-varanasi-city
 */
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
    let riskScore = Math.min(100, realTimeDensity * surgeRatio * 5); 
    if (scenario === 'Festival') riskScore = Math.min(100, 50 + Math.random() * 50);

    const currentCrowd = Math.floor(loc.baseCapacity * surgeRatio * (0.8 + Math.random() * 0.4));
    const confidence = confidenceBase + (Math.random() * 0.1) - 0.05;

    const inflowRate = Math.floor((50 + Math.random() * 450) * surgeRatio);
    const outflowRate = Math.floor(inflowRate * (0.6 + Math.random() * 0.5));

    // --- Integrated Data Logic (Correlations) ---

    // 1. Road Condition (Catalog: roads-varanasi-city)
    // High risk often correlates with perceived road blocks or construction delays
    const roadStates: LocationData['roadCondition'][] = ['Good', 'Good', 'Potholes', 'Construction', 'Blocked'];
    let roadCondition = roadStates[Math.floor(Math.random() * roadStates.length)];
    if (riskScore > 80) roadCondition = Math.random() > 0.3 ? 'Blocked' : 'Construction';
    if (riskScore < 30) roadCondition = 'Good';

    // 2. Solid Waste (Catalog: solid-waste-management-varanasi-city)
    // Crowded areas tend to have higher waste accumulation
    let wasteIndex: LocationData['wasteIndex'] = 'Clean';
    if (currentCrowd > loc.baseCapacity * 1.5) wasteIndex = 'High Accumulation';
    else if (currentCrowd > loc.baseCapacity) wasteIndex = 'Moderate';

    // 3. Electricity (Catalog: electricity-varanasi-city)
    // Random outages, but slightly more likely in high load/crowd scenarios
    let electricityStatus: LocationData['electricityStatus'] = 'Stable';
    if (Math.random() > 0.9) electricityStatus = 'Fluctuating';
    if (Math.random() > 0.98) electricityStatus = 'Outage';

    // 4. Street Lights (Catalog: street-lights-varanasi-city)
    // Percentage functional. Usually high, but varies by location index for variety
    const streetLightCoverage = Math.floor(85 + Math.random() * 15);

    // 5. Buses (Catalog: buses-varanasi-city)
    // Frequency drops if roads are blocked
    let busFrequency = Math.floor(2 + Math.random() * 8); // 2-10 per hour
    if (roadCondition === 'Blocked' || roadCondition === 'Construction') {
        busFrequency = Math.max(0, busFrequency - 4);
    }

    // 6. Sanitation & Diseases (Catalog: diseases-varanasi-city)
    // High waste + high crowd = higher disease risk marker
    let sanitationScore = Math.floor(60 + Math.random() * 40);
    if (wasteIndex === 'High Accumulation') sanitationScore -= 30;
    
    let diseaseRisk: LocationData['diseaseRisk'] = 'Low';
    if (sanitationScore < 40 || riskScore > 90) diseaseRisk = 'High';
    else if (sanitationScore < 70) diseaseRisk = 'Moderate';

    // AQI Generation
    let aqi = 100 + Math.random() * 100;
    if (roadCondition === 'Construction') aqi += 50; // Dust
    if (busFrequency > 5) aqi += 20; // Emissions

    return {
      id: `LOC-${index + 100}`,
      name: loc.name,
      lat: loc.lat,
      lon: loc.lon,
      baseCapacity: loc.baseCapacity,
      currentCrowd,
      riskScore: Math.floor(riskScore),
      scenario,
      confidence: parseFloat(confidence.toFixed(2)),
      inflowRate,
      outflowRate,
      temperature: Math.floor(28 + Math.random() * 5),
      humidity: Math.floor(60 + Math.random() * 20),
      aqi: Math.floor(aqi),
      lastUpdated: new Date().toLocaleTimeString(),
      
      // New Data Fields
      electricityStatus,
      streetLightCoverage,
      roadCondition,
      wasteIndex,
      busFrequency,
      sanitationScore,
      diseaseRisk
    };
  });
};
