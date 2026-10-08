import { useDeviceQuality } from './useDeviceQuality';

export default function Lighting({ intensity = 1 } = {}) {
  const quality = useDeviceQuality();
  const mul = intensity * quality.intensity;

  return (
    <>
      <ambientLight intensity={0.28 * mul} color="#f2efe6" />
      <directionalLight
        position={[2.4, 3.2, 2.2]}
        intensity={1.15 * mul}
        color="#fff7ea"
        castShadow={quality.shadows}
        shadow-mapSize-width={quality.isMobile ? 512 : 1024}
        shadow-mapSize-height={quality.isMobile ? 512 : 1024}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-2.2, 1.4, 1.2]} intensity={0.35 * mul} color="#c9d2e0" />
      <directionalLight position={[0.2, 1.6, -2.4]} intensity={0.45 * mul} color="#e8e5dc" />
    </>
  );
}
