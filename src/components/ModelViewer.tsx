
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useThreeJsScene } from '@/hooks/useThreeJsScene';
import { useHotspotPositioning } from '@/hooks/useHotspotPositioning';
import LoadingState from './model-viewer/LoadingState';
import * as THREE from 'three';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ModelViewerProps {
  modelSrc: string;
  children?: React.ReactNode;
  onModelPartHover?: (info: {
    object: THREE.Object3D;
    position: THREE.Vector3;
    name: string;
  } | null) => void;
  onModelPartClick?: (info: {
    object: THREE.Object3D;
    position: THREE.Vector3;
    name: string;
  }) => void;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  modelSrc, 
  children,
  onModelPartHover,
  onModelPartClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [hoveredInfo, setHoveredInfo] = useState<{
    position: [number, number];
    info: { title: string; description: string } | null;
  } | null>(null);
  const [hoveredPart, setHoveredPart] = useState<{
    object: THREE.Object3D;
    position: { x: number, y: number };
    name: string;
  } | null>(null);

  // Create a callback for when hotspot positions need to be updated
  const onHotspotUpdateRef = useRef<() => void>(() => {});

  // Initialize the Three.js scene
  const { isLoading, error, refs, resizeRendererToDisplaySize } = useThreeJsScene({
    modelSrc,
    containerRef,
    onLoadProgress: (progressValue: number) => {
      setProgress(progressValue);
    },
    onHotspotUpdate: () => onHotspotUpdateRef.current(),
    onObjectHover: (object) => {
      if (object) {
        const position = new THREE.Vector3();
        object.getWorldPosition(position);
        
        // Get 2D screen position for tooltip
        if (containerRef.current && refs.camera) {
          const vector = position.clone();
          vector.project(refs.camera);
          
          const rect = containerRef.current.getBoundingClientRect();
          const x = (vector.x * 0.5 + 0.5) * rect.width;
          const y = (-(vector.y * 0.5) + 0.5) * rect.height;
          
          setHoveredPart({
            object,
            position: { x, y },
            name: object.name || 'Unknown part'
          });
        }
        
        if (onModelPartHover) {
          onModelPartHover({
            object,
            position,
            name: object.name || 'Unknown part'
          });
        }
      } else {
        setHoveredPart(null);
        if (onModelPartHover) {
          onModelPartHover(null);
        }
      }
    },
    onObjectClick: (object) => {
      if (onModelPartClick) {
        const position = new THREE.Vector3();
        object.getWorldPosition(position);
        onModelPartClick({
          object,
          position,
          name: object.name || 'Unknown part'
        });
      }
    }
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

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [resizeRendererToDisplaySize]);

  // Get part details based on the object name
  const getPartDetails = (partName: string) => {
    // This is a simple example - you can expand with more detailed information
    return {
      title: partName,
      description: `This is the ${partName} area of the building`
    };
  };

  return (
    <div className="relative w-full h-full min-h-[500px] md:min-h-[700px]" ref={containerRef}>
      <LoadingState isLoading={isLoading} error={error} progress={progress} />
      
      {/* Tooltip for hovered part */}
      <TooltipProvider>
        {hoveredPart && (
          <div 
            className="absolute pointer-events-none z-10"
            style={{
              left: `${hoveredPart.position.x}px`,
              top: `${hoveredPart.position.y}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <Tooltip open={true}>
              <TooltipContent side="top">
                <div className="p-2">
                  <h4 className="font-bold">{hoveredPart.name}</h4>
                  <p className="text-sm">{getPartDetails(hoveredPart.name).description}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </TooltipProvider>
      
      {/* This is where interactive elements would be placed */}
      <div className="model-container absolute inset-0 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default ModelViewer;
