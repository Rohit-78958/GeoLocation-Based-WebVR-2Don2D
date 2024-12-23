import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';

function LiveDataDisplay({ machineID, distanceFactor = 16, position, onDataUpdate, machineName }) {
  const [data, setData] = useState(null);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://172.36.0.73:8016/api/GetMachineDetails?machineID=' + machineID);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        console.log('Fetched data:', jsonData);
        setData(jsonData);
        // Update parent component with AE value
        if (onDataUpdate && jsonData[0]) {
          onDataUpdate(jsonData[0]); // Assuming AE is the first value
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for periodic updates
    const intervalId = setInterval(fetchData, 2000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [machineID, onDataUpdate]);
  

  return (
    <Html distanceFactor={distanceFactor} position={position}>
      <div className="bg-white/90 p-4 rounded-lg shadow-lg min-w-[350px]">
        {/* Machine Name */}
        <h2 className="text-5xl font-bold text-center mb-3">
          {/* {machineNames[machineID] || `Machine ${machineID}`} */}
          {machineName}
        </h2>
      </div>
      <div className="bg-white/90 p-4 rounded-lg shadow-lg min-w-[200px]">
        {error ? (
          <div className="text-red-500 text-3xl">{error}</div>
        ) : !data ? (
          <div className="text-gray-500 text-3xl">Loading...</div>
        ) : (
          <div className="text-3xl">
            <h3 className="font-bold mb-2 text-center text-3xl">Live Machine Data</h3>
            <div className="space-y-1">
              {Object.entries(data).map(([key, value]) => (
                <div 
                  key={key} 
                  className={`flex justify-between p-2 rounded ${getBackgroundColor(value, keys[key])}`}
                >
                  <span className="font-medium text-2xl">{keys[key]}:</span>
                  <span>{value}</span>
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
