import React, { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';

interface PropertySelectorProps {
  properties: any[];
  onSelectBase: (property: any) => void;
  selectedBase: any | null;
}

const PropertySelector: React.FC<PropertySelectorProps> = ({ 
  properties, 
  onSelectBase,
  selectedBase
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProperties(properties.slice(0, 10));
    } else {
      const filtered = properties
        .filter(property => 
          property.Name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 10);
      setFilteredProperties(filtered);
    }
  }, [searchTerm, properties]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-semibold mb-3">Select Base Property</h2>
      
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {selectedBase && (
        <div className="mb-4 p-3 border border-blue-200 rounded-md bg-blue-50 flex items-start">
          <MapPin className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-800">{selectedBase.Name}</p>
            <p className="text-xs text-gray-600">
              Lat: {selectedBase.Latitude}, Lng: {selectedBase.Longitude}
            </p>
          </div>
        </div>
      )}
      
      <div className="max-h-60 overflow-y-auto">
        {filteredProperties.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredProperties.map((property, index) => (
              <li 
                key={index}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm ${
                  selectedBase && selectedBase.Name === property.Name 
                    ? 'bg-blue-100' 
                    : ''
                }`}
                onClick={() => onSelectBase(property)}
              >
                <p className="font-medium">{property.Name}</p>
                <p className="text-xs text-gray-500">
                  Lat: {property.Latitude}, Lng: {property.Longitude}
                </p>
              </li>
            ))}
          </ul>
        ) : searchTerm ? (
          <p className="text-center text-gray-500 text-sm py-4">No properties found</p>
        ) : (
          <p className="text-center text-gray-500 text-sm py-4">Upload data to see properties</p>
        )}
      </div>
    </div>
  );
};

export default PropertySelector;
