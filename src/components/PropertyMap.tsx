import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { getDistance } from 'geolib';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = Icon.extend({
  options: {
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }
});

// Component to update map view when baseProperty changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

interface PropertyMapProps {
  properties: any[];
  baseProperty: any | null;
  radius: number;
  unit: 'km' | 'miles';
  proximityProperties: any[];
  onSelectProperty: (property: any) => void;
  selectedProperties: any[];
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  baseProperty,
  radius,
  unit,
  proximityProperties,
  onSelectProperty,
  selectedProperties
}) => {
  useEffect(() => {
    // Fix the leaflet icon issue without using require
    import('leaflet').then(L => {
      delete L.Icon.Default.prototype._getIconUrl;
      
      L.Icon.Default.mergeOptions({
        iconUrl: icon,
        shadowUrl: iconShadow
      });
    });
  }, []);

  // Convert radius to meters for the Circle component
  const radiusInMeters = useMemo(() => {
    return unit === 'km' ? radius * 1000 : radius * 1609.34;
  }, [radius, unit]);

  // Default center if no base property is selected
  const defaultCenter: [number, number] = [40.7128, -74.0060]; // NYC
  
  // Get center coordinates from baseProperty
  const center = useMemo(() => {
    if (baseProperty && baseProperty.Latitude && baseProperty.Longitude) {
      return [parseFloat(baseProperty.Latitude), parseFloat(baseProperty.Longitude)] as [number, number];
    }
    return defaultCenter;
  }, [baseProperty]);

  // Check if a property is selected
  const isPropertySelected = (property: any) => {
    return selectedProperties.some(p => 
      p.Latitude === property.Latitude && p.Longitude === property.Longitude
    );
  };

  if (!properties.length) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg p-8">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-600">No Properties Loaded</p>
          <p className="text-sm text-gray-500 mt-2">Upload a CSV file to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <MapContainer 
        center={center} 
        zoom={baseProperty ? 13 : 10} 
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {baseProperty && (
          <>
            <ChangeView center={center} zoom={13} />
            <Marker position={center}>
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{baseProperty.Name}</p>
                  <p>Base Property</p>
                </div>
              </Popup>
            </Marker>
            
            <Circle 
              center={center}
              radius={radiusInMeters}
              pathOptions={{ 
                fillColor: 'blue', 
                fillOpacity: 0.1, 
                color: 'blue',
                weight: 1
              }}
            />
          </>
        )}
        
        {proximityProperties.map((property, index) => {
          const lat = parseFloat(property.Latitude);
          const lng = parseFloat(property.Longitude);
          
          // Skip if it's the base property or if coordinates are invalid
          if (
            (baseProperty && lat === parseFloat(baseProperty.Latitude) && lng === parseFloat(baseProperty.Longitude)) ||
            isNaN(lat) || isNaN(lng)
          ) {
            return null;
          }
          
          // Calculate distance if base property exists
          let distance = null;
          if (baseProperty) {
            distance = getDistance(
              { latitude: parseFloat(baseProperty.Latitude), longitude: parseFloat(baseProperty.Longitude) },
              { latitude: lat, longitude: lng }
            ) / 1000; // Convert to km
            
            if (unit === 'miles') {
              distance = distance * 0.621371; // Convert km to miles
            }
          }
          
          // Create custom icon based on selection status
          const customIcon = new DefaultIcon({
            className: isPropertySelected(property) ? 'selected-marker' : ''
          });
          
          return (
            <Marker 
              key={index} 
              position={[lat, lng]} 
              icon={customIcon}
            >
              <Popup>
                <div className="text-sm max-w-[200px]">
                  <p className="font-bold">{property.Name}</p>
                  {distance !== null && (
                    <p className="text-gray-600">
                      Distance: {distance.toFixed(2)} {unit}
                    </p>
                  )}
                  {property.Price && (
                    <p className="text-gray-600">Price: {property.Price}</p>
                  )}
                  <button
                    onClick={() => onSelectProperty(property)}
                    className={`mt-2 px-3 py-1 text-xs font-medium rounded-md w-full ${
                      isPropertySelected(property)
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {isPropertySelected(property) ? 'Remove' : 'Select'}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
