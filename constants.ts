import { LocationData } from './types';

export const VARANASI_LOCATIONS = [
  { name: "Dashashwamedh Ghat", lat: 25.3109, lon: 83.0107, baseCapacity: 5000 },
  { name: "Godowlia Chowk", lat: 25.3116, lon: 83.0103, baseCapacity: 3000 },
  { name: "Vishwanath Gali", lat: 25.3108, lon: 83.0097, baseCapacity: 2000 },
  { name: "Kashi Vishwanath Temple", lat: 25.3109, lon: 83.0106, baseCapacity: 4000 },
  { name: "Assi Ghat", lat: 25.2876, lon: 83.0053, baseCapacity: 3500 },
  { name: "Manikarnika Ghat", lat: 25.3142, lon: 83.0147, baseCapacity: 2500 },
  { name: "Varanasi Junction", lat: 25.3189, lon: 83.0260, baseCapacity: 8000 },
  { name: "BHU Main Gate", lat: 25.2677, lon: 82.9913, baseCapacity: 4000 },
  { name: "Sigra Chauraha", lat: 25.3252, lon: 82.9876, baseCapacity: 3000 },
  { name: "Lanka Chowk", lat: 25.2756, lon: 82.9923, baseCapacity: 2500 },
  { name: "Bhelupur", lat: 25.2989, lon: 82.9912, baseCapacity: 2000 },
  { name: "Lahartara Chowk", lat: 25.3401, lon: 83.0123, baseCapacity: 2500 },
  { name: "Nadesar", lat: 25.3312, lon: 82.9834, baseCapacity: 1500 },
  { name: "Sarnath", lat: 25.3814, lon: 83.0225, baseCapacity: 3000 },
  { name: "Ramnagar Fort", lat: 25.2876, lon: 83.0312, baseCapacity: 2000 },
  { name: "Tulsi Ghat", lat: 25.2923, lon: 83.0034, baseCapacity: 1500 },
  { name: "Harishchandra Ghat", lat: 25.3034, lon: 83.0089, baseCapacity: 1800 },
  { name: "Kedar Ghat", lat: 25.3056, lon: 83.0078, baseCapacity: 1600 },
  { name: "Meer Ghat", lat: 25.3078, lon: 83.0098, baseCapacity: 1400 },
  { name: "Pandey Ghat", lat: 25.3023, lon: 83.0067, baseCapacity: 1200 }
];

export const SCENARIOS = ["Normal", "Festival", "Weekend", "Emergency"] as const;

export const THEME_COLORS = {
  primary: "#FF6B35", // Saffron
  secondary: "#1a1a2e", // Deep Blue
  accent: "#764ba2", // Purple
  success: "#00C851",
  warning: "#ffbb33",
  danger: "#ff4444",
};
