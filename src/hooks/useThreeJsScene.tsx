import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface UseThreeJsSceneProps {
  modelSrc: string;
  containerRef: React.RefObject<HTMLDivElement>;
  onModelLoaded?: () => void;
  onHotspotUpdate?: () => void;
}

interface ThreeJsSceneRefs {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  controls: OrbitControls | null;
  model: THREE.Group | null;
  animationFrame: number | null;
}

export const useThreeJsScene = ({
  modelSrc,
  containerRef,
  onModelLoaded,
  onHotspotUpdate
}: UseThreeJsSceneProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Store Three.js objects for use in subsequent renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const loadingRef = useRef<boolean>(true);
  
  // Expose the ThreeJS objects for external use (like updating hotspot positions)
  const refs: ThreeJsSceneRefs = {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    controls: controlsRef.current,
    model: modelRef.current,
    animationFrame: animationFrameRef.current
  };

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Reset loading state when model source changes
    setIsLoading(true);
    loadingRef.current = true;
    setError(null);

    // Clean up previous scene
    if (sceneRef.current) {
      // Clear existing model if any
      if (modelRef.current) {
        sceneRef.current.remove(modelRef.current);
        modelRef.current = null;
      }
    } else {
      // Scene setup (only if not already created)
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x333333);
      sceneRef.current = scene;
    }

    // Camera setup (only if not already created)
    if (!cameraRef.current && containerRef.current) {
      const camera = new THREE.PerspectiveCamera(
        75, 
        containerRef.current.clientWidth / containerRef.current.clientHeight, 
        0.1, 
        1000
      );
      camera.position.z = 5;
      cameraRef.current = camera;
    }

    // Renderer setup (only if not already created)
    if (!rendererRef.current && containerRef.current) {
      const renderer = setupRenderer(containerRef.current);
      rendererRef.current = renderer;
    }

    // Controls setup (only if not already created)
    if (!controlsRef.current && cameraRef.current && rendererRef.current) {
      const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.screenSpacePanning = false;
      controls.maxDistance = 100;
      
      // Add event listener to update hotspot positions when user interacts
      if (onHotspotUpdate) {
        controls.addEventListener('change', onHotspotUpdate);
      }
      controlsRef.current = controls;
    }

    // Setup lighting (only if scene is newly created)
    if (sceneRef.current && !sceneRef.current.children.length) {
      setupLighting(sceneRef.current);
    }

    // Load model
    if (sceneRef.current && cameraRef.current && controlsRef.current && containerRef.current) {
      loadModel(modelSrc, sceneRef.current, cameraRef.current, controlsRef.current, containerRef.current, () => {
        setIsLoading(false);
        loadingRef.current = false;
        if (onModelLoaded) {
          onModelLoaded();
        }
      });
    }

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      if (onHotspotUpdate) {
        onHotspotUpdate();
      }
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      if (controlsRef.current) controlsRef.current.update();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Update hotspot positions in every frame
      if (onHotspotUpdate) {
        onHotspotUpdate();
      }
    };
    
    // Start animation only if it's not already running
    if (!animationFrameRef.current) {
      animate();
    }

    // Cleanup
    return () => {
      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      
      // Remove controls event listener
      if (controlsRef.current && onHotspotUpdate) {
        controlsRef.current.removeEventListener('change', onHotspotUpdate);
      }
      
      // We'll keep the renderer, camera, and scene for reuse
      // but remove the model to save memory
      if (sceneRef.current && modelRef.current) {
        sceneRef.current.remove(modelRef.current);
        modelRef.current = null;
      }
    };
  }, [modelSrc]);

  // Helper function to setup lighting
  const setupLighting = (scene: THREE.Scene) => {
    // Stronger ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    // Add multiple directional lights from different angles
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-1, 2, -1);
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight3.position.set(0, -1, 0);
    scene.add(directionalLight3);

    // Add a hemisphere light for more natural lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(hemisphereLight);
  };

  // Helper function to setup renderer
  const setupRenderer = (container: HTMLDivElement) => {
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Update to use the correct properties for newer Three.js versions
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Note: physicallyCorrectLights is deprecated and has been replaced
    // We'll set the legacy lighting mode to false to use the new lighting model
    renderer.useLegacyLights = false;
    
    container.appendChild(renderer.domElement);
    return renderer;
  };

  // Helper function to load the 3D model
  const loadModel = (
    modelSrc: string, 
    scene: THREE.Scene, 
    camera: THREE.PerspectiveCamera, 
    controls: OrbitControls, 
    container: HTMLDivElement,
    onModelLoaded?: () => void
  ) => {
    const loader = new GLTFLoader();
    
    // Clear any existing model first
    if (modelRef.current) {
      scene.remove(modelRef.current);
      modelRef.current = null;
    }
    
    loader.load(
      modelSrc,
      (gltf) => {
        // Center the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Reset position to center
        gltf.scene.position.x = -center.x;
        gltf.scene.position.y = -center.y;
        gltf.scene.position.z = -center.z;
        
        // Adjust camera position based on model size
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.5; // Add some margin
        camera.position.z = cameraZ;
        
        // Set controls target to model center
        controls.target.set(0, 0, 0);
        controls.update();
        
        modelRef.current = gltf.scene;
        scene.add(gltf.scene);
        
        // Notify that model has loaded
        if (onModelLoaded) {
          onModelLoaded();
        }
      },
      (xhr) => {
        // Loading progress
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('An error happened while loading the model:', error);
        setError('Failed to load 3D model. Please try again later.');
        setIsLoading(false);
        loadingRef.current = false;
      }
    );
  };

  return { isLoading, error, refs };
};
