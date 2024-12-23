import { useThree, useFrame } from '@react-three/fiber'
import React, { useRef, useState, useEffect } from 'react'
import { useTexture, Html } from '@react-three/drei'
import { AlertTriangle } from 'lucide-react'
import LiveDataDisplay from './LiveData'
import * as THREE from 'three'

export default function ImagePlane({ position, machineID, scaling=0.8, machineName }) {
  const machine1Texture = useTexture('images/machineGreen.png');
  const machine2Texture = useTexture('images/machineYellow.png');
  const machine3Texture = useTexture('images/machineRed.png');
  const defaultMachineTexture = useTexture('images/pngegg.png');
  
  machine1Texture.colorSpace = THREE.SRGBColorSpace;
  machine2Texture.colorSpace = THREE.SRGBColorSpace;
  machine3Texture.colorSpace = THREE.SRGBColorSpace;
  
  const [currentTexture, setCurrentTexture] = useState(defaultMachineTexture);
  const [lightColor, setLightColor] = useState("#ffffff");
  const [machineData, setMachineData] = useState(null);
  const [isLiveDataVisible, setIsLiveDataVisible] = useState(false);
  const planeRef = useRef();
  const glowRef = useRef();

  useFrame(({ clock }) => {
    if (glowRef.current) {
      const intensity = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
      glowRef.current.scale.set(intensity, intensity, 1);
    }
  });

  const updateTexture = (value) => {
    let newTexture;
    let newColor;
    
    if (value >= 90) {
      newTexture = machine1Texture;
      newColor = "#00ff00"; // Green
    } else if (value >= 60) {
      newTexture = machine2Texture;
      newColor = "#ffff00"; // Yellow
    } else {
      newTexture = machine3Texture;
      newColor = "#ff0000"; // Red
    }
    
    if (newTexture !== currentTexture) {
      setCurrentTexture(newTexture);
      setLightColor(newColor);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://172.36.0.73:8016/api/GetMachineDetails?machineID=${machineID}`);
        const data = await response.json();
        setMachineData(data);
        updateTexture(data[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 20000);
    return () => clearInterval(intervalId);
  }, [machineID]);

  const handleMeshClick = (e) => {
    e.stopPropagation();
    setIsLiveDataVisible((prev) => !prev);
  };

  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]} scale={scaling}>
      <mesh ref={planeRef} onClick={handleMeshClick}>
        <planeGeometry args={[15, 10]} />
        <meshBasicMaterial map={currentTexture} transparent />
      </mesh>

      {/* Lamp light effect */}
      <group position={[3.1, 4, 0.1]}>
        {/* Glowing sphere for the lamp */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color={lightColor} />
        </mesh>
        
        {/* Glowing halo effect */}
        <mesh ref={glowRef} position={[0, 0, 0.05]}>
          <circleGeometry args={[0.6, 32]} />
          <meshBasicMaterial
            color={lightColor}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Point light for actual illumination */}
        <pointLight
          color={lightColor}
          intensity={5}
          distance={5}
          decay={2}
        />
      </group>
      
      {machineData && machineData[2] < 60 && (
        <Html position={[-2, 5, 0]}>
          <div className="flex items-center justify-center bg-red-500 rounded-full p-2 transform -translate-y-2">
            <AlertTriangle className="text-white w-4 h-4" />
          </div>
        </Html>
      )}

      {isLiveDataVisible && (
        <LiveDataDisplay 
          machineData={machineData} 
          position={[3, 4.5, 0.1]}
          //onDataUpdate={(data) => setMachineData(data)}
          machineName = {machineName}
        />
      )}
    </group>
  );
}