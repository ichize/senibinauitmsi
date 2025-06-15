
import React, { useRef, useEffect } from 'react';
import { useThreeJsScene } from '@/hooks/useThreeJsScene';
import { useHotspotPositioning } from '@/hooks/useHotspotPositioning';
import LoadingState from './model-viewer/LoadingState';

interface ModelViewerProps {
  modelSrc: string;
  children?: React.ReactNode;
  targetRoomPosition?: [number, number, number]; // NEW
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelSrc, children, targetRoomPosition }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Create a callback for when hotspot positions need to be updated
  const onHotspotUpdateRef = useRef<() => void>(() => {});

  const { isLoading, error, refs, resizeRendererToDisplaySize, retryLoadModel, focusCameraOnPosition } = useThreeJsScene({
    modelSrc,
    containerRef,
    onModelLoaded: () => {
      setTimeout(() => onHotspotUpdateRef.current(), 100);
    },
    onHotspotUpdate: () => onHotspotUpdateRef.current()
  });

  const { updateHotspotPositions } = useHotspotPositioning({
    containerRef,
    cameraRef: { current: refs.camera },
    sceneRef: { current: refs.scene },
    isLoading
  });

  onHotspotUpdateRef.current = updateHotspotPositions;

  useEffect(() => {
    const handleResize = () => {
      resizeRendererToDisplaySize();
    };

    window.addEventListener('resize', handleResize);

    // Camera zoom effect when the targetRoomPosition changes
    if (targetRoomPosition && focusCameraOnPosition) {
      focusCameraOnPosition(targetRoomPosition);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [resizeRendererToDisplaySize, targetRoomPosition, focusCameraOnPosition]);

  return (
    <div className="relative w-full h-full min-h-[500px] md:min-h-[700px]" ref={containerRef}>
      <LoadingState 
        isLoading={isLoading} 
        error={error} 
        onRetry={retryLoadModel} 
        modelSrc={modelSrc} 
      />
      <div className="absolute inset-0 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default ModelViewer;
