import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';

function LiveDataDisplay({ machineData, distanceFactor = 16, position, machineName }) {
  const [error, setError] = useState(null);

  const keys = ['AE', 'PE', 'OEE', 'DownTime', 'PartCount', 'key6'];

  // Helper function to get background color based on value
  const getBackgroundColor = (value, metric) => {
    switch (metric) {
      case 'AE':
      case 'PE':
      case 'OEE':
        if (value >= 90) return 'bg-green-200';
        if (value >= 60) return 'bg-yellow-200';
        return 'bg-red-200';
      default:
        return 'bg-white/90';
    }
  };
  
  return (
    <Html position={position}>
      <div className="bg-white/90 p-2 rounded-lg shadow-lg min-w-[200px]">
        {/* Machine Name */}
        <h2 className="text-base font-bold text-center">
          {/* {machineNames[machineID] || `Machine ${machineID}`} */}
          {machineName}
        </h2>
      </div>
      <div className="bg-white/90 p-2 rounded-lg shadow-lg min-w-[200px]">
        {error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : !machineData ? (
          <div className="text-gray-500 text-sm">Loading...</div>
        ) : (
          <div className="text-lg">
            <h3 className="font-bold mb-2 text-center text-sm">Live Machine Data</h3>
            <div className="space-y-1">
              {Object.entries(machineData).map(([key, value]) => (
                <div 
                  key={key} 
                  className={`flex justify-between p-1 rounded ${getBackgroundColor(value, keys[key])}`}
                >
                  <span className="font-medium text-xs">{keys[key]}:</span>
                  <span className='font-medium text-xs'>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Html>
  );
}

export default LiveDataDisplay;
