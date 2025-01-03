import React, { useState, Suspense } from 'react';
import { Stats, Environment, Html, useProgress, PerspectiveCamera, useTexture } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import ImagePlane2 from './ImagePlane2';
import Loader from './Loader';

function BackgroundImage() {
  const texture = useTexture('images/background.jpg');

  return (
    <mesh position={[-600, 0, -50]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[2450, 1150]} /> {/* Adjust size */}
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export default function PlantScene({onBack, Name}) {
  return (
    <>
        <PerspectiveCamera makeDefault fov={75} position={[100, 10, -8]} rotation={[0, Math.PI / 2, 0]} />
        {/* <Perf position="top-left" /> */}
        {/* <CameraLookAround /> */}
        <directionalLight position={[1, 10, 1]} />
        <Environment preset="warehouse" />
        {/* <Stats position="top-right" /> */}
        <Suspense fallback={<Loader />}>
          <BackgroundImage />

          <Html fullscreen>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
              zIndex: 10,
              border: '2px solid white',
              padding: '5px 10px',
            }}
          >
            Acemicromatic
          </div>
        </Html>

          {/* Add a back button */}
          <Html fullscreen>
            <button
              onClick={onBack}
              style={{
                position: 'absolute',
                left: '40px',
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
          </Html>

          
          <ImagePlane2 position={[70, 15, 20]} machineName={"ACE-01"} scaling={1.5}/>
          <ImagePlane2 position={[70, 15, -5]} machineName={"ACE-02"} scaling={1.5}/>
          <ImagePlane2 position={[70, 15, -30]} machineName={"ACE-03"} scaling={1.5}/>

{/* 
          <ImagePlane position={[70, -8, -50]} machineName={"ACE-11"}/>
          <ImagePlane position={[70, -8, -16]} machineName={"ACE-12"}/>
          <ImagePlane position={[70, -8, -35]} machineName={"ACE-13"}/>

          <ImagePlane position={[70, -3, 25]} machineName={"ACE-14"}/> */}

        </Suspense>
    </>
  );
}
