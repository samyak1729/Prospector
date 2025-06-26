import React from 'react';
import { Download, ListFilter, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface SelectedPropertiesProps {
  properties: any[];
  onRemoveProperty: (property: any) => void;
  onClearAll: () => void;
}

const SelectedProperties: React.FC<SelectedPropertiesProps> = ({
  properties,
  onRemoveProperty,
  onClearAll
}) => {
  const exportToExcel = () => {
    if (properties.length === 0) return;
    
    const worksheet = XLSX.utils.json_to_sheet(properties);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Properties');
    
    // Get current date for filename
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    XLSX.writeFile(workbook, `PropertyPulse_Export_${dateStr}.xlsx`);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <ListFilter className="w-5 h-5 mr-2 text-blue-600" />
          Selected Properties
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {properties.length}
          </span>
        </h2>
        {properties.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
            <ListFilter className="w-10 h-10" />
            <p className="text-sm">No properties selected</p>
            <p className="text-xs text-center">Select properties from the map to add them here</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {properties.map((property, index) => (
              <li 
                key={index}
                className="p-3 bg-gray-50 rounded-md border border-gray-200 text-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{property.Name}</p>
                    {property.Price && (
                      <p className="text-gray-600 text-xs">Price: {property.Price}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      Lat: {property.Latitude}, Lng: {property.Longitude}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveProperty(property)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mt-4">
        <button
          onClick={exportToExcel}
          disabled={properties.length === 0}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-md ${
            properties.length === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } transition-colors`}
        >
          <Download className="w-4 h-4 mr-2" />
          Export to Excel
        </button>
      </div>
    </div>
  );
};

export default SelectedProperties;
