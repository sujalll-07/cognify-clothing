import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useWebGL } from './useWebGL';
import { useDeviceQuality } from './useDeviceQuality';
import LoadingExperience from './LoadingExperience';
import WebGLFallback from './WebGLFallback';

export default function CanvasShell({
  className = '',
  fallbackImage,
  fallbackAlt,
  camera = { position: [0, 0.2, 3.2], fov: 32 },
  children,
}) {
  const webgl = useWebGL();
  const quality = useDeviceQuality();

  if (!webgl) {
    return (
      <div className={className}>
        <WebGLFallback src={fallbackImage} alt={fallbackAlt} />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Canvas
        gl={{
          antialias: !quality.isMobile,
          powerPreference: quality.isMobile ? 'low-power' : 'high-performance',
          alpha: true,
          stencil: false,
        }}
        dpr={quality.dpr}
        shadows={quality.shadows}
        camera={camera}
        frameloop="always"
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
      <LoadingExperience />
    </div>
  );
}
