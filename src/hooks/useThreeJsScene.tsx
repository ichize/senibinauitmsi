import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { UseThreeJsSceneProps, ThreeJsSceneRefs } from './three-js-scene/types';
import { setupLighting, setupRenderer, resizeRenderer } from './three-js-scene/sceneUtils';
import { loadModel } from './three-js-scene/modelLoader';
import { useThreeJsSceneCore } from './three-js-scene/useThreeJsSceneCore';
import { focusCameraOnPosition as focusCameraAnim } from './three-js-scene/useCameraAnimation';

export const useThreeJsScene = ({
  modelSrc,
  containerRef,
  onModelLoaded,
  onHotspotUpdate,
  onObjectClick
}: import('./three-js-scene/types').UseThreeJsSceneProps) => {
  const core = useThreeJsSceneCore({
    modelSrc,
    containerRef,
    onModelLoaded,
    onHotspotUpdate,
    onObjectClick
  });

  // Camera focus/animation for deep link — same signature/API as before
  const focusCameraOnPosition = (target: [number, number, number]) => {
    // Use the camera/controls from the refs exposed by the core hook
    focusCameraAnim(
      core.refs.camera,
      core.refs.controls,
      target
      // All options default as before
    );
  };

  return {
    ...core,
    focusCameraOnPosition
  };
};
