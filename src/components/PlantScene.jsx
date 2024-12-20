import React, { useState, Suspense } from 'react';
import { Stats, Environment, Html, useProgress, PerspectiveCamera, useTexture } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import ImagePlane from './ImagePlane';
import Loader from './Loader';

function BackgroundImage() {
  const texture = useTexture('images/layout.png');

  return (
    <mesh position={[-600, 0, -50]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[2450, 1150]} /> {/* Adjust size */}
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export default function PlantScene({onBack}) {
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

          <ImagePlane position={[70, 5, -28]} />
          <ImagePlane position={[70, 5, -16]} />
          <ImagePlane position={[70, 10, -16]} />
          <ImagePlane position={[70, 10, -28]} />
          <ImagePlane position={[70, 15, -16]} />
          <ImagePlane position={[70, 15, -28]} />
          
          
          <ImagePlane position={[70, 25, -20]} />
          <ImagePlane position={[70, 25, -34]} />
          <ImagePlane position={[70, 30.5, -34]} />


          <ImagePlane position={[70, 18, 5]} />
          <ImagePlane position={[70, 18, 18]} />
          <ImagePlane position={[70, 25, 5]} />
          <ImagePlane position={[70, 25, 18]} />

          <ImagePlane position={[70, -8, -50]} scaling={0.8}/>
          <ImagePlane position={[70, -8, -16]} scaling={0.8}/>
          <ImagePlane position={[70, -8, -35]} scaling={0.8}/>

          <ImagePlane position={[70, -3, 25]} scaling={1} />

        </Suspense>
    </>
  );
}
