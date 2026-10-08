import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Float, Center } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useWebGL } from './useWebGL';
import WebGLFallback from './WebGLFallback';
import { useDeviceQuality } from './useDeviceQuality';

gsap.registerPlugin(ScrollTrigger);

import { useTexture, Decal } from '@react-three/drei';

function HoodieModel() {
  const group = useRef();
  const autoRotateGroup = useRef();
  const { scene } = useGLTF('/models/cognify-hoodie.glb');
  const logoTex = useTexture('/branding/cognify-logo.png');
  
  const clone = useMemo(() => scene.clone(), [scene]);
  
  const meshes = useMemo(() => {
    const m = [];
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        m.push(child);
      }
    });
    return m;
  }, [clone]);
  
  // Auto rotation
  useFrame((state) => {
    if (autoRotateGroup.current) {
      autoRotateGroup.current.rotation.y += 0.005;
    }
  });

  useEffect(() => {
    if (group.current) {
      const el = group.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: '+=200%', // Pin for 2x screen height
          scrub: 1,
          pin: true,
        }
      });

      // Step 1: Fade out the hero text and scroll indicator (duration 1)
      tl.to('.hero-section .max-w-xl, .hero-section .absolute.bottom-8', {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power2.inOut'
      }, 0);

      // Step 1: Bring the hoodie from right to center, zoom in, and spin (duration 2)
      tl.to(el.position, {
        x: 0, // True center
        y: -0.2,
        z: 2.5, 
        duration: 2,
        ease: 'power2.inOut'
      }, 0);

      tl.to(el.rotation, {
        x: 0.3, 
        y: Math.PI * 2, 
        duration: 2,
        ease: 'power2.inOut'
      }, 0);

      // Step 2: Move from center to left and disappear (duration 2, starts at 2s)
      tl.to(el.position, {
        x: -3.5, // Move far left (off-screen)
        y: 0.5,  // Move slightly up
        z: 1,    // Start moving back
        duration: 2,
        ease: 'power2.in'
      }, 2);

      tl.to(el.rotation, {
        y: Math.PI * 3, // Keep spinning
        duration: 2,
        ease: 'power2.in'
      }, 2);

      // Shrink to 0 so it completely disappears smoothly
      tl.to(el.scale, {
        x: 0.001,
        y: 0.001,
        z: 0.001,
        duration: 1.5,
        ease: 'power2.inOut'
      }, 2.5); // Starts shrinking slightly after it begins moving left
      
      return () => {
        ScrollTrigger.getAll().forEach(t => {
          if(t.vars.trigger === '.hero-section') t.kill();
        });
        tl.kill();
      };
    }
  }, []);

  // Check if mobile to adjust initial X position so it doesn't overflow off-screen on small devices
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const initialX = isMobile ? 0 : 1.5;

  return (
    <group ref={group} position={[initialX, 0.3, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
        <Center>
          <group scale={0.03}>
            <group ref={autoRotateGroup}>
              {meshes.map((mesh) => (
                <mesh
                  key={mesh.uuid}
                  geometry={mesh.geometry}
                  material={mesh.material}
                  position={mesh.position}
                  rotation={mesh.rotation}
                  scale={mesh.scale}
                >
                  {/* Logo on the left breast */}
                  <Decal position={[0.12, 0.25, 0.2]} rotation={[0, 0, 0]} scale={[0.2, 0.2, 0.5]}>
                    <meshStandardMaterial map={logoTex} color="#000000" transparent polygonOffset polygonOffsetFactor={-1} />
                  </Decal>
                </mesh>
              ))}
            </group>
          </group>
        </Center>
      </Float>
    </group>
  );
}

function CameraRig() {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();

  useFrame(() => {
    // Subtle camera movement based on mouse
    camera.position.lerp(vec.set(mouse.x * 0.5, mouse.y * 0.5, 5), 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function HeroScene() {
  const hasWebGL = useWebGL();
  const quality = useDeviceQuality();

  if (!hasWebGL) {
    return (
      <div className="absolute inset-0 overflow-hidden z-0">
        <WebGLFallback src="https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80" alt="Hero" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Cinematic background gradient (kept from placeholder) */}
      <div className="absolute inset-0 bg-gradient-to-br from-cognify-bg via-[#0D0D0D] to-[#111111]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#E8E5DC 1px, transparent 1px), linear-gradient(90deg, #E8E5DC 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-cognify-bg to-transparent z-10" />

      {/* 3D Canvas */}
      <div className="absolute inset-0 w-full pointer-events-auto h-full">
        <Canvas shadows={quality.shadows} dpr={quality.dpr} camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            {quality.env && <Environment preset="studio" environmentIntensity={0.8} />}
            <ambientLight intensity={0.5 * quality.intensity} />
            <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1 * quality.intensity} castShadow={quality.shadows} />
            <pointLight position={[-5, 5, -5]} intensity={0.5 * quality.intensity} />
            
            <HoodieModel />
            
            {quality.shadows && <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />}
            <CameraRig />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload('/models/cognify-hoodie.glb');
