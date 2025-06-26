import React from 'react';
import { Map } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Map size={24} />
          <h1 className="text-xl font-bold">PropertyPulse</h1>
        </div>
        <div className="text-sm font-medium">Real Estate Proximity Finder</div>
      </div>
    </header>
  );
};

export default Header;
