import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface UseThreeJsSceneProps {
  modelSrc: string;
  containerRef: React.RefObject<HTMLDivElement>;
  onModelLoaded?: () => void;
  onLoadProgress?: (progress: number) => void;
  onHotspotUpdate?: () => void;
  onObjectClick?: (object: THREE.Object3D) => void;
  onObjectHover?: (object: THREE.Object3D | null) => void;
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
  onLoadProgress,
  onHotspotUpdate,
  onObjectClick,
  onObjectHover
}: UseThreeJsSceneProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const loadingRef = useRef<boolean>(true);
  
  const refs: ThreeJsSceneRefs = {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    controls: controlsRef.current,
    model: modelRef.current,
    animationFrame: animationFrameRef.current
  };

  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const hoveredObject = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    setIsLoading(true);
    loadingRef.current = true;
    setError(null);

    if (sceneRef.current) {
      if (modelRef.current) {
        sceneRef.current.remove(modelRef.current);
        modelRef.current = null;
      }
    } else {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x333333);
      sceneRef.current = scene;
    }

    if (!cameraRef.current && containerRef.current) {
      const camera = new THREE.PerspectiveCamera(
        75, 
        containerRef.current.clientWidth / containerRef.current.clientHeight, 
        0.1, 
        1000
      );
      camera.position.z = 50;
      cameraRef.current = camera;
    }

    if (!rendererRef.current && containerRef.current) {
      const renderer = setupRenderer(containerRef.current);
      rendererRef.current = renderer;
    }

    if (!controlsRef.current && cameraRef.current && rendererRef.current) {
      const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.screenSpacePanning = false;
      controls.maxDistance = 100;
      
      if (onHotspotUpdate) {
        controls.addEventListener('change', onHotspotUpdate);
      }
      controlsRef.current = controls;
    }

    if (sceneRef.current && !sceneRef.current.children.length) {
      setupLighting(sceneRef.current);
    }

    if (sceneRef.current && cameraRef.current && controlsRef.current && containerRef.current) {
      loadModel(modelSrc, sceneRef.current, cameraRef.current, controlsRef.current, containerRef.current, (progress) => {
        if (onLoadProgress) {
          onLoadProgress(progress);
        }
      }, () => {
        setIsLoading(false);
        loadingRef.current = false;
        if (onModelLoaded) {
          onModelLoaded();
        }
      });
    }

    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current || !modelRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;
      
      raycaster.current.setFromCamera(mouse.current, cameraRef.current);
      const intersects = raycaster.current.intersectObjects(modelRef.current.children, true);
      
      if (intersects.length > 0) {
        const object = intersects[0].object;
        
        if (hoveredObject.current !== object && onObjectHover) {
          hoveredObject.current = object;
          onObjectHover(object);
          containerRef.current.style.cursor = 'pointer';
        }
      } else if (hoveredObject.current !== null) {
        hoveredObject.current = null;
        if (onObjectHover) onObjectHover(null);
        containerRef.current.style.cursor = 'auto';
      }
    };

    const onMouseClick = (event: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current || !modelRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;
      
      raycaster.current.setFromCamera(mouse.current, cameraRef.current);
      
      const intersects = raycaster.current.intersectObjects(modelRef.current.children, true);
      if (intersects.length > 0 && onObjectClick) {
        onObjectClick(intersects[0].object);
      }
    };

    containerRef.current.addEventListener('mousemove', onMouseMove);
    containerRef.current.addEventListener('click', onMouseClick);

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

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      if (controlsRef.current) controlsRef.current.update();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      if (onHotspotUpdate) {
        onHotspotUpdate();
      }
    };
    
    if (!animationFrameRef.current) {
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousemove', onMouseMove);
      containerRef.current?.removeEventListener('click', onMouseClick);
      
      if (controlsRef.current && onHotspotUpdate) {
        controlsRef.current.removeEventListener('change', onHotspotUpdate);
      }
      
      if (sceneRef.current && modelRef.current) {
        sceneRef.current.remove(modelRef.current);
        modelRef.current = null;
      }
    };
  }, [modelSrc]);

  const setupLighting = (scene: THREE.Scene) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-1, 2, -1);
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight3.position.set(0, -1, 0);
    scene.add(directionalLight3);

    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(hemisphereLight);
  };

  const setupRenderer = (container: HTMLDivElement) => {
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setClearColor(0x000000, 0);
    
    container.appendChild(renderer.domElement);
    return renderer;
  };

  const loadModel = (
    modelSrc: string, 
    scene: THREE.Scene, 
    camera: THREE.PerspectiveCamera, 
    controls: OrbitControls,
    container: HTMLDivElement,
    onProgress: (progress: number) => void,
    onLoaded: () => void
  ) => {
    const loader = new GLTFLoader();
    
    loader.load(
      modelSrc, 
      (gltf) => {
        console.log('Model loaded successfully:', gltf);
        
        const model = gltf.scene;
        console.log('Model structure:', model);
        
        let partCounter = 0;
        model.traverse((object) => {
          if ((object as THREE.Mesh).isMesh) {
            const mesh = object as THREE.Mesh;
            
            if (!object.name || object.name === '') {
              const materialName = mesh.material ? 
                (Array.isArray(mesh.material) ? mesh.material[0].name || 'Material' : mesh.material.name || 'Material') : 
                'Unknown';
              
              const position = new THREE.Vector3();
              mesh.getWorldPosition(position);
              
              const areaName = getAreaName(position);
              object.name = areaName || `Area_${materialName}_${++partCounter}`;
            }
            
            object.userData.interactive = true;
            console.log('Named object:', object.name);
          }
        });
        
        model.scale.set(1, 1, 1);
        scene.add(model);
        modelRef.current = model;

        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 90); 
        let cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));
        camera.position.set(size.x * 0.5, size.y * 2, size.z * 2);
        
        const center = new THREE.Vector3();
        box.getCenter(center);
        camera.lookAt(center);
        
        controls.target.copy(center);
        controls.update();

        onLoaded();
      },
      (xhr) => {
        const progress = xhr.loaded / xhr.total;
        console.log('Loading progress:', progress);
        onProgress(progress);
      }, 
      (error) => {
        console.error('Error loading model:', error);
        setError('An error occurred while loading the model.');
        setIsLoading(false);
        loadingRef.current = false;
      }
    );
  };

  const getAreaName = (position: THREE.Vector3): string => {
    let xPosition = position.x < 0 ? 'West' : 'East';
    let zPosition = position.z < 0 ? 'North' : 'South';
    let floorLevel = '';
    
    if (position.y < -5) {
      floorLevel = 'Basement';
    } else if (position.y < 0) {
      floorLevel = 'Ground Floor';
    } else if (position.y < 5) {
      floorLevel = 'First Floor';
    } else if (position.y < 10) {
      floorLevel = 'Second Floor';
    } else {
      floorLevel = 'Upper Floors';
    }
    
    return `${floorLevel} ${xPosition} ${zPosition} Wing`;
  };

  const resizeRendererToDisplaySize = () => {
    if (!rendererRef.current || !containerRef.current || !cameraRef.current) return false;
    
    const canvas = rendererRef.current.domElement;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    
    if (needResize) {
      rendererRef.current.setSize(width, height, false);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    }
    
    return needResize;
  };

  return {
    isLoading,
    error,
    refs,
    resizeRendererToDisplaySize
  };
};
