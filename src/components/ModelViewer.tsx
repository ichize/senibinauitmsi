import React, { useRef, useEffect } from 'react';
import { useThreeJsScene } from '@/hooks/useThreeJsScene';
import { useHotspotPositioning } from '@/hooks/useHotspotPositioning';
import LoadingState from './model-viewer/LoadingState';
import { ARButton } from 'three/examples/jsm/webxr/ARButton'; // Import ARButton from Three.js

interface ModelViewerProps {
  modelSrc: string;
  children?: React.ReactNode;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelSrc, children }) => {
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
    onHotspotUpdate: () => onHotspotUpdateRef.current(),
    enableXR: true, // <-- Enable WebXR in useThreeJsScene hook
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

  // Add useEffect for resizing and AR Button
  useEffect(() => {
    const handleResize = () => {
      resizeRendererToDisplaySize();
    };

    // Log the model source for debugging
    console.log(`ModelViewer attempting to load: ${modelSrc}`);
    console.log(`Current origin: ${window.location.origin}`);
    console.log(`Full expected URL: ${new URL(modelSrc, window.location.origin).href}`);

    // Add AR button to the page if renderer and container are available
    if (refs.renderer && containerRef.current) {
      // Add AR button to allow users to switch to AR mode
      const arButton = ARButton.createButton(refs.renderer);
      containerRef.current.appendChild(arButton);
    }

    window.addEventListener('resize', handleResize);

    // Clean up the event listener and AR button on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(containerRef.current.lastChild!); // Remove ARButton on unmount
      }
    };
  }, [resizeRendererToDisplaySize, modelSrc, refs.renderer]);

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
