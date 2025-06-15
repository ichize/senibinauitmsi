
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Animates the camera from a given origin to a target position and controls.target.
 * This matches the behavior for deep link transitions.
 * 
 * @param camera The PerspectiveCamera to animate.
 * @param controls The OrbitControls instance.
 * @param lookTarget The destination 3D point the camera should look at.
 * @param desiredDistance The distance from lookTarget for the camera to end up at (along the positive Z).
 * @param yOffset Optional Y offset to apply at the end position.
 * @param durationMs Duration of the animation in ms (default 850).
 * @param onComplete Optional callback after animation.
 */
export function focusCameraOnPosition(
  camera: THREE.PerspectiveCamera | null,
  controls: OrbitControls | null,
  target: [number, number, number],
  desiredDistance: number = 38,
  yOffset: number = 10,
  durationMs: number = 850,
  onComplete?: () => void
) {
  if (!camera || !controls) return;

  const lookTarget = new THREE.Vector3(...target);

  // End position: in front of lookTarget, offset by desiredDistance and yOffset
  const direction = new THREE.Vector3(0, 0, 1);
  const newCameraPos = lookTarget.clone().add(direction.multiplyScalar(desiredDistance));
  newCameraPos.y += yOffset;

  // **Start position is always fixed at (0,0,50) (the overview camera pos)**
  const overviewStartPos = new THREE.Vector3(0, 0, 50);
  const startTarget = controls.target.clone();
  let start: number | null = null;

  function animate(now: number) {
    if (start === null) start = now;
    const elapsed = now - start;
    const t = Math.min(1, elapsed / durationMs);

    // Interpolate position and controls target
    camera.position.lerpVectors(overviewStartPos, newCameraPos, t);
    controls.target.lerpVectors(startTarget, lookTarget, t);

    controls.update();

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      // Snap to final
      camera.position.copy(newCameraPos);
      controls.target.copy(lookTarget);
      controls.update();
      onComplete && onComplete();
    }
  }
  requestAnimationFrame(animate);
}
