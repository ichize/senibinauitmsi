import React, { useRef, useEffect, useState } from 'react';
import { useThreeJsScene } from '@/hooks/useThreeJsScene';
import { useHotspotPositioning } from '@/hooks/useHotspotPositioning';
import LoadingState from './model-viewer/LoadingState';
import WebXRScene from './WebXRScene';

interface ModelViewerProps {
  modelSrc: string;
  children?: React.ReactNode;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelSrc, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isARActive, setIsARActive] = useState(false); // Track AR/VR mode

  // Initialize the Three.js scene
  const { isLoading, error, refs, resizeRendererToDisplaySize, retryLoadModel, toggleXR } = useThreeJsScene({
    modelSrc,
    containerRef,
    onModelLoaded: () => setTimeout(() => onHotspotUpdateRef.current(), 100),
    onHotspotUpdate: () => onHotspotUpdateRef.current(),
    isARActive, // Pass AR/VR state to scene
  });

  // Setup hotspot positioning
  const { updateHotspotPositions } = useHotspotPositioning({
    containerRef,
    cameraRef: { current: refs.camera },
    sceneRef: { current: refs.scene },
    isLoading,
  });

  const onHotspotUpdateRef = useRef(updateHotspotPositions);

  useEffect(() => {
    const handleResize = () => resizeRendererToDisplaySize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeRendererToDisplaySize]);

  const handleToggleARVR = () => {
    setIsARActive(!isARActive); // Toggle AR/VR mode
    toggleXR(!isARActive); // Toggle XR in Three.js
  };

  return (
    <div className="relative w-full h-full min-h-[500px] md:min-h-[700px]" ref={containerRef}>
      <LoadingState isLoading={isLoading} error={error} onRetry={retryLoadModel} modelSrc={modelSrc} />

      {/* AR/VR Toggle Button */}
      <button
        onClick={handleToggleARVR}
        className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-lg z-10"
      >
        {isARActive ? 'Exit AR/VR' : 'Enter AR/VR'}
      </button>

      {/* Replace regular viewer with AR/VR viewer */}
      {isARActive ? (
        <WebXRScene modelSrc={modelSrc} containerRef={containerRef} /> // Use containerRef here
      ) : (
        <div className="absolute inset-0 pointer-events-none">{children}</div>
      )}
    </div>
  );
};

export default ModelViewer;
