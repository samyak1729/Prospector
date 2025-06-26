import React, { useState, useEffect, useMemo } from 'react';
import './index.css';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import DataPreview from './components/DataPreview';
import PropertySelector from './components/PropertySelector';
import RadiusSelector from './components/RadiusSelector';
import PropertyMap from './components/PropertyMap';
import SelectedProperties from './components/SelectedProperties';
import Notification from './components/Notification';
import { filterPropertiesByDistance } from './utils/distance';

export function App() {
  // Data state
  const [properties, setProperties] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [baseProperty, setBaseProperty] = useState<any | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<any[]>([]);

  // UI state
  const [radius, setRadius] = useState<number>(1);
  const [unit, setUnit] = useState<'km' | 'miles'>('km');
  const [notification, setNotification] = useState<{ 
    type: 'success' | 'error' | 'info',
    message: string,
    isVisible: boolean
  }>({
    type: 'info',
    message: '',
    isVisible: false
  });

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Handle CSV data loading
  const handleDataLoaded = (data: any[], headers: string[]) => {
    setProperties(data);
    setHeaders(headers);
    setBaseProperty(null);
    setSelectedProperties([]);
    showNotification('success', `Successfully loaded ${data.length} properties`);
  };

  // Handle errors
  const handleError = (error: string) => {
    showNotification('error', error);
  };

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({
      type,
      message,
      isVisible: true
    });
  };

  // Hide notification
  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  // Handle base property selection
  const handleSelectBase = (property: any) => {
    setBaseProperty(property);
    showNotification('info', `Base property set to ${property.Name}`);
  };

  // Handle property selection
  const handleSelectProperty = (property: any) => {
    setSelectedProperties(prev => {
      // Check if property is already selected
      const isAlreadySelected = prev.some(p => 
        p.Latitude === property.Latitude && p.Longitude === property.Longitude
      );
      
      // If already selected, remove it
      if (isAlreadySelected) {
        return prev.filter(p => 
          p.Latitude !== property.Latitude || p.Longitude !== property.Longitude
        );
      }
      
      // Otherwise, add it
      return [...prev, property];
    });
  };

  // Handle removing a property from selection
  const handleRemoveProperty = (property: any) => {
    setSelectedProperties(prev => 
      prev.filter(p => 
        p.Latitude !== property.Latitude || p.Longitude !== property.Longitude
      )
    );
  };

  // Handle clearing all selected properties
  const handleClearAllProperties = () => {
    setSelectedProperties([]);
    showNotification('info', 'Cleared all selected properties');
  };

  // Filter properties by distance
  const proximityProperties = useMemo(() => {
    if (!baseProperty) return properties;
    
    return filterPropertiesByDistance(
      properties,
      baseProperty,
      radius,
      unit
    );
  }, [properties, baseProperty, radius, unit]);

  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <FileUploader 
              onDataLoaded={handleDataLoaded} 
              onError={handleError} 
            />
            
            {properties.length > 0 && (
              <>
                <DataPreview data={properties} headers={headers} />
                <PropertySelector 
                  properties={properties} 
                  onSelectBase={handleSelectBase}
                  selectedBase={baseProperty}
                />
                <RadiusSelector 
                  radius={radius}
                  onRadiusChange={setRadius}
                  unit={unit}
                  onUnitChange={setUnit}
                  disabled={!baseProperty}
                />
              </>
            )}
          </div>
          
          {/* Map area */}
          <div className="lg:col-span-6 h-[calc(100vh-12rem)]">
            <PropertyMap 
              properties={properties}
              baseProperty={baseProperty}
              radius={radius}
              unit={unit}
              proximityProperties={proximityProperties}
              onSelectProperty={handleSelectProperty}
              selectedProperties={selectedProperties}
            />
          </div>
          
          {/* Right sidebar */}
          <div className="lg:col-span-3 h-[calc(100vh-12rem)]">
            <SelectedProperties 
              properties={selectedProperties}
              onRemoveProperty={handleRemoveProperty}
              onClearAll={handleClearAllProperties}
            />
          </div>
        </div>
      </main>
      
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
}

export default App;
