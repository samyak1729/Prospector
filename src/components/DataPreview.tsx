import React from 'react';

interface DataPreviewProps {
  data: any[];
  headers: string[];
}

const DataPreview: React.FC<DataPreviewProps> = ({ data, headers }) => {
  const previewData = data.slice(0, 5);

  if (previewData.length === 0) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 mb-4 overflow-hidden">
      <h2 className="text-lg font-semibold mb-3">Data Preview</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {previewData.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {headers.map((header) => (
                  <td key={`${idx}-${header}`} className="px-3 py-2 text-xs text-gray-900 truncate max-w-[150px]">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 5 && (
        <p className="mt-2 text-xs text-gray-500 italic">
          Showing 5 of {data.length} properties
        </p>
      )}
    </div>
  );
};

export default DataPreview;
