import React, { useCallback } from 'react';
import { FileWarning, Upload } from 'lucide-react';
import Papa from 'papaparse';

interface FileUploaderProps {
  onDataLoaded: (data: any[], headers: string[]) => void;
  onError: (error: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded, onError }) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      onError('Please upload a CSV file');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          onError(`Error parsing CSV: ${results.errors[0].message}`);
          return;
        }

        const requiredColumns = ['Name', 'Latitude', 'Longitude'];
        const headers = Object.keys(results.data[0] || {});
        
        const missingColumns = requiredColumns.filter(col => 
          !headers.some(header => header.toLowerCase() === col.toLowerCase())
        );

        if (missingColumns.length > 0) {
          onError(`Missing required columns: ${missingColumns.join(', ')}`);
          return;
        }

        onDataLoaded(results.data, headers);
      },
      error: (error) => {
        onError(`Error reading file: ${error.message}`);
      }
    });
  }, [onDataLoaded, onError]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-semibold mb-3">Upload Properties CSV</h2>
      <p className="text-sm text-gray-600 mb-4">
        Your file should include Name, Latitude, Longitude and other property details
      </p>
      
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-2 text-blue-600" />
          <p className="mb-2 text-sm text-blue-700 font-semibold">Click to upload CSV</p>
          <p className="text-xs text-gray-500">CSV file with property data</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept=".csv" 
          onChange={handleFileUpload}
        />
      </label>
      
      <div className="mt-3 text-xs text-gray-500 flex items-center">
        <FileWarning className="w-4 h-4 mr-1 text-blue-500" />
        <span>Required columns: Name, Latitude, Longitude</span>
      </div>
    </div>
  );
};

export default FileUploader;
