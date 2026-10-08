import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function CameraController({
  autoRotate = false,
  enableZoom = true,
  minDistance = 1.8,
  maxDistance = 4.8,
  target = [0, 0.05, 0],
  resetToken = 0,
}) {
  const controls = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (!controls.current) return;
    controls.current.reset();
    camera.position.set(0, 0.2, 3.1);
    controls.current.target.set(...target);
    controls.current.update();
  }, [resetToken, camera, target]);

  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      autoRotate={autoRotate}
      autoRotateSpeed={0.55}
      enableZoom={enableZoom}
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={Math.PI * 0.28}
      maxPolarAngle={Math.PI * 0.72}
      makeDefault
    />
  );
}
