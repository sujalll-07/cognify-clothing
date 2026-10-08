import { ContactShadows, Environment } from '@react-three/drei';
import { useDeviceQuality } from './useDeviceQuality';

export default function StudioEnvironment({ groundY = -1.2 }) {
  const quality = useDeviceQuality();

  return (
    <>
      {quality.env ? (
        <Environment preset="studio" environmentIntensity={0.32} />
      ) : (
        <hemisphereLight args={['#e8e5dc', '#1a1a1a', 0.4]} />
      )}
      <ContactShadows
        position={[0, groundY, 0]}
        opacity={quality.isMobile ? 0.28 : 0.42}
        scale={8}
        blur={quality.isMobile ? 1.8 : 2.6}
        far={2.4}
      />
    </>
  );
}
