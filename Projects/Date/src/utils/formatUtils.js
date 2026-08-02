export const formatLocationText = (location, distanceKm) => {
  if (!location) return distanceKm ? `${distanceKm} mi away` : '';
  // Clean up any embedded "X miles away" to prevent double-printing
  const cleanLoc = location.replace(/,?\s*\d+(\.\d+)?\s*miles?\s*away/i, '').trim();
  if (distanceKm) {
    return `${cleanLoc} (${distanceKm} mi away)`;
  }
  return cleanLoc;
};
