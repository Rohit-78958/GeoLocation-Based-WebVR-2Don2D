import { useThree, useFrame } from '@react-three/fiber'
import React, { useRef, useState, useEffect } from 'react'
import { useTexture } from '@react-three/drei'
import LiveDataDisplay from './LiveData'
import * as THREE from 'three'

export default function ImagePlane({ position, machineID, scaling=0.6 }) {
  // Load all three machine images
  const machine1Texture = useTexture('images/machineGreen.png'); // >90
  const machine2Texture = useTexture('images/machineYellow.png'); // 60-90
  const machine3Texture = useTexture('images/machineRed.png'); // <60
  const defaultMachineTexture = useTexture('images/pngegg.png');
  machine1Texture.colorSpace = THREE.SRGBColorSpace;
  machine2Texture.colorSpace = THREE.SRGBColorSpace;
  machine3Texture.colorSpace = THREE.SRGBColorSpace;
  
  const [currentTexture, setCurrentTexture] = useState(defaultMachineTexture);
  const [aeValue, setAeValue] = useState(null); // State to hold the AE value
  const planeRef = useRef();
  const [isLiveDataVisible, setIsLiveDataVisible] = useState(false);

  // Function to update texture based on AE value
  const updateTexture = (value) => {
    let newTexture;
    if (value >= 90) {
      newTexture = machine1Texture;
    } else if (value >= 60) {
      newTexture = machine2Texture;
    } else {
      newTexture = machine3Texture;
    }
    
    // Only update if the texture is different
    if (newTexture !== currentTexture) {
      setCurrentTexture(newTexture);
    }
  };

  // Set up automatic data fetching for texture updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://172.36.0.73:8016/api/GetMachineDetails?machineID=${machineID}`);
        const data = await response.json();
        setAeValue(data[0]); // Update AE value state
        updateTexture(data[0]); // Update texture based on fetched AE value
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch initial data
    fetchData();

    // Set up interval for updates every 2 seconds
    const intervalId = setInterval(fetchData, 2000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [machineID]);


  const handleMeshClick = (e) => {
    e.stopPropagation();
    setIsLiveDataVisible((prev) => !prev);
  };

  return (
    <mesh 
      ref={planeRef} 
      position={position} 
      rotation={[0, Math.PI / 2, 0]}
      onClick={handleMeshClick}
      scale={scaling}
    >
      <planeGeometry args={[15, 10]} />
      <meshBasicMaterial map={currentTexture} transparent />
      {isLiveDataVisible && (
        <LiveDataDisplay 
          machineID={machineID} 
          position={[3, 4.5, 0.1]} 
          onDataUpdate={setAeValue} // Pass setAeValue to update AE value from LiveDataDisplay
        />
      )}
    </mesh>
  );
}