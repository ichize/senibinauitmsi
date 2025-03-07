import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useThreeJsScene } from '@/hooks/useThreeJsScene';
import { useHotspotPositioning } from '@/hooks/useHotspotPositioning';
import LoadingState from './model-viewer/LoadingState';

interface ModelViewerProps {
  modelSrc: string;
  children?: React.ReactNode;
}

// Wrap ModelViewer with forwardRef to expose methods to parent
const ModelViewer = forwardRef(({ modelSrc, children }: ModelViewerProps, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Create a callback for when hotspot positions need to be updated
  const onHotspotUpdateRef = useRef<() => void>(() => {});

  // Initialize the Three.js scene
  const { isLoading, error, refs, resizeRendererToDisplaySize, retryLoadModel, zoomTo } = useThreeJsScene({
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

  // Expose zoomToHotspot method via ref using useImperativeHandle
  useImperativeHandle(ref, () => ({
    zoomToHotspot: (coordinates: [number, number, number]) => {
      zoomTo(coordinates);  // Calls zoomTo method from useThreeJsScene
    }
  }));

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
});

export default ModelViewer;
