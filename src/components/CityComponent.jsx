import React from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import { Html } from '@react-three/drei';

// Plant location data for each city
const PLANT_LOCATIONS = {
    'Delhi': [
      { lat: 28.6139, lon: 77.2090, name: 'Plant 1 - Delhi Central' },
      { lat: 28.6280, lon: 77.2789, name: 'Plant 2 - East Delhi' },
      { lat: 28.5921, lon: 77.2290, name: 'Plant 3 - South Delhi' },
    ],
    'Bangalore': [
      { lat: 12.9716, lon: 77.5946, name: 'Plant 1 - MG Road' },
      { lat: 12.9352, lon: 77.6245, name: 'Plant 2 - Koramangala' },
      { lat: 13.0098, lon: 77.5511, name: 'Plant 3 - Malleshwaram' },
    ],
    'Pune': [
      { lat: 18.5204, lon: 73.8567, name: 'Plant 1 - Central Pune' },
      { lat: 18.5089, lon: 73.9259, name: 'Plant 2 - Viman Nagar' },
      { lat: 18.4529, lon: 73.8290, name: 'Plant 3 - Sinhagad Road' },
    ],
  };
  
// New component for city map
const CityMap = ({ city, onPlantSelect, onBack }) => {
  const [selectedPlant, setSelectedPlant] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const mapOptions = {
    zoom: 12,
    center: { lat: city.lat, lng: city.lon },
    mapTypeId: 'roadmap',
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  if (!isLoaded) return (
    <Html>
      <div>Loading...</div>
    </Html>
  );

  return (
    <Html fullscreen>
      <div style={{ width: '100%', height: '100vh' }}>
        <GoogleMap
          options={mapOptions}
          mapContainerStyle={{ width: '100%', height: '100%' }}
        >
          {PLANT_LOCATIONS[city.info]?.map((plant, index) => (
            <Marker
              key={index}
              position={{ lat: plant.lat, lng: plant.lon }}
              onClick={() => setSelectedPlant(plant)}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          ))}

          {selectedPlant && (
            <InfoWindow
              position={{ lat: selectedPlant.lat, lng: selectedPlant.lon }}
              onCloseClick={() => setSelectedPlant(null)}
            >
              <div>
                <h3>{selectedPlant.name}</h3>
                <button onClick={() => onPlantSelect(selectedPlant)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid black',
                    padding: '8px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}  
                >
                  Go to Plant
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            left: '15px',
            top: '55px',
            padding: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            zIndex: '10'
          }}
        >
          Back
        </button>
      </div>
    </Html>
  );
};

export default CityMap;
