import React, { useRef, useEffect } from 'react';
import { useThreeJsScene } from '@/hooks/useThreeJsScene';
import LoadingState from './model-viewer/LoadingState';

const ModelViewer = ({ modelSrc, children }) => {
  const containerRef = useRef(null);

  const { 
    isLoading, 
    error, 
    refs, 
    resizeRendererToDisplaySize, 
    retryLoadModel, 
    isARSupported, 
    startARSession 
  } = useThreeJsScene({
    modelSrc,
    containerRef,
    onModelLoaded: () => {},
    onHotspotUpdate: () => {}
  });

  useEffect(() => {
    window.addEventListener('resize', resizeRendererToDisplaySize);
    return () => window.removeEventListener('resize', resizeRendererToDisplaySize);
  }, [resizeRendererToDisplaySize]);

  return (
    <div className="relative w-full h-full min-h-[500px] md:min-h-[700px]" ref={containerRef}>
      <LoadingState isLoading={isLoading} error={error} onRetry={retryLoadModel} modelSrc={modelSrc} />
      
      {/* Check if AR is supported */}
      {isARSupported && (
        <button className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded" onClick={startARSession}>
          Start AR
        </button>
      )}
      
      <div className="absolute inset-0 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default ModelViewer;

