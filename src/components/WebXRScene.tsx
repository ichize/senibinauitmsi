import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory';

interface WebXRSceneProps {
  modelSrc: string;
}

const WebXRScene: React.FC<WebXRSceneProps> = ({ modelSrc }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let controller1: THREE.Group, controller2: THREE.Group;
    let loader: GLTFLoader;

    const initWebXR = () => {
      // Setup basic scene
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

      // Initialize WebGLRenderer with WebXR support
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;

      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
        document.body.appendChild(ARButton.createButton(renderer)); // AR Button for entering AR mode
      }

      // Load the 3D model using GLTFLoader
      loader = new GLTFLoader();
      loader.load(
        modelSrc,
        (gltf) => {
          const model = gltf.scene;
          scene.add(model);
        },
        undefined,
        (error) => {
          console.error('An error occurred loading the model:', error);
        }
      );

      // Add lights
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Add controllers for interaction
      const controllerModelFactory = new XRControllerModelFactory();
      controller1 = renderer.xr.getController(0);
      controller2 = renderer.xr.getController(1);
      controller1.add(controllerModelFactory.createControllerModel(controller1));
      controller2.add(controllerModelFactory.createControllerModel(controller2));
      scene.add(controller1);
      scene.add(controller2);

      // Start the rendering loop
      const animate = () => {
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });
      };

      animate();

      // Handle resizing
      window.addEventListener('resize', onWindowResize);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    initWebXR();

    return () => {
      // Clean up the scene, renderer, and event listeners
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', onWindowResize);
    };
  }, [modelSrc]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default WebXRScene;
