import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stage, Center } from '@react-three/drei';

function CardModel({ url }) {
  const { scene } = useGLTF(url);
  const clone = useMemo(() => scene.clone(), [scene]);
  const group = useRef();
  
  clone.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={group}>
      <Center>
        <primitive object={clone} />
      </Center>
    </group>
  );
}

export default function ProductCardScene({ url }) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none bg-cognify-card">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 40 }}>
        <Suspense fallback={null}>
          <Stage environment="studio" intensity={0.5} adjustCamera={1.2}>
            <CardModel url={url} />
          </Stage>
        </Suspense>
      </Canvas>
    </div>
  );
}
