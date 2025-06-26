import React from 'react';
import { CircleOff } from 'lucide-react';

interface RadiusSelectorProps {
  radius: number;
  onRadiusChange: (value: number) => void;
  unit: 'km' | 'miles';
  onUnitChange: (unit: 'km' | 'miles') => void;
  disabled: boolean;
}

const RadiusSelector: React.FC<RadiusSelectorProps> = ({ 
  radius, 
  onRadiusChange, 
  unit, 
  onUnitChange,
  disabled
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-semibold mb-3">Set Search Radius</h2>
      
      {disabled ? (
        <div className="flex items-center justify-center py-6 text-gray-400">
          <CircleOff className="h-5 w-5 mr-2" />
          <span className="text-sm">Select a base property first</span>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-4">
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={radius}
              onChange={(e) => onRadiusChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-blue-700">
              {radius} <span className="text-sm font-medium">{unit}</span>
            </div>
            
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                className={`px-3 py-1 text-sm font-medium ${
                  unit === 'km' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => onUnitChange('km')}
              >
                km
              </button>
              <button
                className={`px-3 py-1 text-sm font-medium ${
                  unit === 'miles' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => onUnitChange('miles')}
              >
                miles
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RadiusSelector;
