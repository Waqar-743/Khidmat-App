// KHIDMAT — Market Rates Data

export const marketRates: Record<string, { min: number; max: number }> = {
  'AC Technician': { min: 1500, max: 2500 },
  'AC Repair': { min: 1500, max: 2500 },
  'AC Repair & Maintenance': { min: 1500, max: 2500 },
  'Plumber': { min: 800, max: 1500 },
  'Electrician': { min: 1000, max: 2000 },
  'General Electrician': { min: 1000, max: 2000 },
  'Tutor': { min: 500, max: 1500 },
  'Beautician': { min: 1200, max: 3000 },
  'Carpenter': { min: 1000, max: 2500 },
  'Painter': { min: 2000, max: 5000 },
  'Deep Cleaning': { min: 3000, max: 8500 },
};

export function getMarketRate(category: string): { min: number; max: number } {
  return marketRates[category] || { min: 1000, max: 3000 };
}
