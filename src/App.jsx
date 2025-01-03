import { Canvas } from '@react-three/fiber'
import React, {useState, Suspense} from 'react'
import GlobeScene from './components/Globe'
import PlantScene from './components/PlantScene'
import PlantScene2 from './components/PlantScene2'
import Loader from './components/Loader'
import CityMap from './components/CityComponent'

function App() {
  const [currentScene, setCurrentScene] = useState('globe');
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCurrentScene('city');
  };

  const handlePlantSelect = (plant) => {
    setSelectedPlant(plant);
    setCurrentScene('plant');
  };

  return (
    <Canvas style={{ height: '100vh', width: '100vw', background: 'black' }}>
      <Suspense fallback={<Loader />}>
        {currentScene === 'globe' && (
          <GlobeScene onCitySelect={handleCitySelect} />
        )}
        {currentScene === 'city' && selectedCity && (
          <CityMap 
            city={selectedCity}
            onBack={() => setCurrentScene('globe')} 
            onPlantSelect={handlePlantSelect}
          />
        )}
        {currentScene === 'plant' && selectedPlant && (
          <PlantScene
            plant={selectedPlant}
            onBack={() => setCurrentScene('city')} 
            Name = {"Acemicromatic"}
          />
        )}
      </Suspense>
    </Canvas>
  )
}

export default App