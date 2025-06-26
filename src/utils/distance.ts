import { getDistance } from 'geolib';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export const calculateDistance = (
  point1: Coordinates,
  point2: Coordinates,
  unit: 'km' | 'miles' = 'km'
): number => {
  const distanceInMeters = getDistance(point1, point2);
  
  // Convert to kilometers
  let distance = distanceInMeters / 1000;
  
  // Convert to miles if needed
  if (unit === 'miles') {
    distance = distance * 0.621371;
  }
  
  return distance;
};

export const filterPropertiesByDistance = (
  properties: any[],
  baseProperty: any,
  radius: number,
  unit: 'km' | 'miles' = 'km'
): any[] => {
  if (!baseProperty || !properties.length) return [];
  
  const baseCoordinates: Coordinates = {
    latitude: parseFloat(baseProperty.Latitude),
    longitude: parseFloat(baseProperty.Longitude)
  };
  
  return properties.filter(property => {
    // Skip properties with invalid coordinates
    if (!property.Latitude || !property.Longitude) return false;
    
    const propertyCoordinates: Coordinates = {
      latitude: parseFloat(property.Latitude),
      longitude: parseFloat(property.Longitude)
    };
    
    const distance = calculateDistance(
      baseCoordinates,
      propertyCoordinates,
      unit
    );
    
    return distance <= radius;
  });
};
