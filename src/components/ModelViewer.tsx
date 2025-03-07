import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThreeJsScene } from '@/hooks/useThreeJsScene';
import { useHotspotPositioning } from '@/hooks/useHotspotPositioning';
import LoadingState from './model-viewer/LoadingState';

interface ModelViewerProps {
  modelSrc: string;
  children?: React.ReactNode;
  zoomToPosition?: (position: THREE.Vector3) => void; // New prop for zoom functionality
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelSrc, children, zoomToPosition }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Create a callback for when hotspot positions need to be updated
  const onHotspotUpdateRef = useRef<() => void>(() => {});

  // Initialize the Three.js scene
  const { isLoading, error, refs, resizeRendererToDisplaySize, retryLoadModel } = useThreeJsScene({
    modelSrc,
    containerRef,
    onModelLoaded: () => {
      // Force update positions after model loaded
      setTimeout(() => onHotspotUpdateRef.current(), 100);
    },
    onHotspotUpdate: () => onHotspotUpdateRef.current()
  });

  // Setup hotspot positioning
  const { updateHotspotPositions } = useHotspotPositioning({
    containerRef,
    cameraRef: { current: refs.camera },
    sceneRef: { current: refs.scene },
    isLoading
  });

  // Assign the update function to the ref so the ThreeJS scene can call it
  onHotspotUpdateRef.current = updateHotspotPositions;

  // Add useEffect for resizing
  useEffect(() => {
    const handleResize = () => {
      resizeRendererToDisplaySize();
    };

    window.addEventListener('resize', handleResize);

    // Log the model source for debugging
    console.log(`ModelViewer attempting to load: ${modelSrc}`);
    console.log(`Current origin: ${window.location.origin}`);
    console.log(`Full expected URL: ${new URL(modelSrc, window.location.origin).href}`);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [resizeRendererToDisplaySize, modelSrc]);

  // Function to zoom into a specific position (useful for hotspots like "Bilik Krit Utama")
  const zoomCameraToPosition = (position: THREE.Vector3) => {
    const camera = refs.camera;
    if (!camera) return;

    // Animate the camera to the new position
    const duration = 1000; // Duration of the zoom in milliseconds
    const startPosition = camera.position.clone();
    const targetPosition = position.clone().add(new THREE.Vector3(0, 1.5, 2)); // Offset the position slightly

    let startTime: number | null = null;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsedTime = time - startTime;
      const t = Math.min(elapsedTime / duration, 1);

      camera.position.lerpVectors(startPosition, targetPosition, t);

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  // Make the zoom function available via props
  if (zoomToPosition) {
    zoomToPosition(zoomCameraToPosition);
  }

  return (
    <div className="relative w-full h-full min-h-[500px] md:min-h-[700px]" ref={containerRef}>
      <LoadingState 
        isLoading={isLoading} 
        error={error} 
        onRetry={retryLoadModel} 
        modelSrc={modelSrc} 
      />
      
      {/* Interactive elements positioned over the 3D scene */}
      <div className="absolute inset-0 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default ModelViewer;
