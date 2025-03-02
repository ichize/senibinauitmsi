import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

interface HoverDetailsProps {
  camera: THREE.Camera | null;
  position: THREE.Vector3;
  label: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

const HoverDetails: React.FC<HoverDetailsProps> = ({ camera, position, label, containerRef }) => {
  const [screenPosition, setScreenPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const hoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScreenPosition = () => {
      if (!camera || !containerRef.current) return;

      const vector = position.clone().project(camera);

      const containerRect = containerRef.current.getBoundingClientRect();
      const widthHalf = containerRect.width / 2;
      const heightHalf = containerRect.height / 2;

      const x = (vector.x * widthHalf) + widthHalf;
      const y = -(vector.y * heightHalf) + heightHalf;

      setScreenPosition({ x, y });
    };

    // Update the screen position when the camera moves
    updateScreenPosition();
    const handleResize = () => updateScreenPosition();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [camera, position, containerRef]);

  return (
    <div
      ref={hoverRef}
      className="absolute pointer-events-none bg-white shadow-lg p-2 rounded-md text-xs text-gray-700"
      style={{
        left: `${screenPosition.x}px`,
        top: `${screenPosition.y}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      {label}
    </div>
  );
};

export default HoverDetails;
