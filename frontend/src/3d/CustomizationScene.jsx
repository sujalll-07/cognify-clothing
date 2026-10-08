import { Suspense, useMemo, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, PresentationControls, Environment, Decal, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useWebGL } from './useWebGL';
import WebGLFallback from './WebGLFallback';
import { useDeviceQuality } from './useDeviceQuality';

const COLOR_MAP = {
  'Black': '#111111',
  'White': '#F5F5F5',
  'Gray': '#6B7280',
  'Olive': '#858C72',
};

function CustomizableModel({ url, color, logo, graphic, customText, font }) {
  const { scene, nodes, materials } = useGLTF(url);
  
  // Clone scene so we don't mutate the cached one
  const clone = useMemo(() => scene.clone(), [scene]);
  
  // Load textures
  const logoTex = useTexture(logo === 'cognify' ? '/branding/cognify-logo.png' : '/branding/cognify-logo-white.svg');
  const graphicTex = useTexture(
    graphic === 'graphic01' ? '/graphics/graphic-01.png' :
    graphic === 'graphic02' ? '/graphics/graphic-02.png' :
    graphic === 'graphic03' ? '/graphics/graphic-03.png' :
    '/branding/cognify-logo.png' // fallback, won't be used if 'none'
  );

  // Extract all meshes to apply color and decals
  const meshes = useMemo(() => {
    const m = [];
    clone.traverse((child) => {
      if (child.isMesh) {
        // Ensure shadows
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Clone material so we can safely change its color
        child.material = child.material.clone();
        m.push(child);
      }
    });
    return m;
  }, [clone]);

  // Apply color
  useEffect(() => {
    const hex = COLOR_MAP[color] || '#111111';
    meshes.forEach((mesh) => {
      if (mesh.material && mesh.material.color) {
        // A simple way to colorize preserving some of the fabric details
        mesh.material.color.set(hex);
      }
    });
  }, [color, meshes]);

  // Determine decal positions based on model type (hoodie vs shirt might need slight offsets)
  const isHoodie = url.includes('hoodie');
  
  // Decal configs
  // Adjust these based on the actual model bounding box.
  // We place logo on chest, graphic on the back or lower front, text on the chest below logo
  const logoPos = isHoodie ? [0, 0.2, 0.15] : [0, 0.2, 0.12];
  const graphicPos = isHoodie ? [0, 0, -0.2] : [0, 0, -0.15]; // Back side
  const graphicRot = [0, Math.PI, 0]; // Facing backwards
  const textPos = isHoodie ? [0, 0.1, 0.15] : [0, 0.1, 0.13];

  const fontUrl = font === 'serif' ? 'https://fonts.gstatic.com/s/playfairdisplay/v29/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff' : 
                  font === 'mono' ? 'https://fonts.gstatic.com/s/spacemono/v12/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff' : 
                  'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'; // sans

  return (
    <group>
      {/* We render the meshes manually so we can inject Decals as children */}
      {meshes.map((mesh) => (
        <mesh
          key={mesh.uuid}
          geometry={mesh.geometry}
          material={mesh.material}
          position={mesh.position}
          rotation={mesh.rotation}
          scale={mesh.scale}
        >
          {logo !== 'none' && (
            <Decal position={logoPos} rotation={[0, 0, 0]} scale={[0.1, 0.1, 0.1]}>
              <meshStandardMaterial map={logoTex} transparent polygonOffset polygonOffsetFactor={-1} />
            </Decal>
          )}
          
          {graphic !== 'none' && (
            <Decal position={graphicPos} rotation={graphicRot} scale={[0.25, 0.25, 0.25]}>
              <meshStandardMaterial map={graphicTex} transparent polygonOffset polygonOffsetFactor={-1} />
            </Decal>
          )}
          
          {/* Custom Text can't be a Decal easily with just text, so we can position 3D text right on top.
              Wait, @react-three/drei Text can't be bent over the surface. We can just place it slightly in front. */}
        </mesh>
      ))}
      
      {/* Floating 3D Text as an alternative for text */}
      {customText && (
        <Text
          position={[textPos[0], textPos[1], textPos[2] + 0.08]} // Slightly offset from chest
          rotation={[0, 0, 0]}
          fontSize={0.03}
          font={fontUrl}
          color={color === 'White' ? '#111' : '#FFF'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.002}
          outlineColor={color === 'White' ? '#FFF' : '#111'}
        >
          {customText.toUpperCase()}
        </Text>
      )}
    </group>
  );
}

export default function CustomizationScene({ product, color, logo, graphic, customText, font }) {
  const modelUrl = product.category === 'hoodies' ? '/models/cognify-hoodie.glb' : '/models/cognify-shirt.glb';
  const hasWebGL = useWebGL();
  const quality = useDeviceQuality();

  if (!hasWebGL) {
    return (
      <div className="sticky top-28">
        <WebGLFallback src={product.images?.[0]} />
        <div className="mt-3 p-3 bg-cognify-card border border-cognify-border">
          <p className="text-xs text-cognify-gray uppercase tracking-widest mb-2">Preview Summary</p>
          <div className="space-y-1 text-xs text-cognify-gray">
            <p>Color: <span className="text-cognify-white">{color.name}</span></p>
            <p>Logo: <span className="text-cognify-white">{logo === 'cognify' ? 'Cognify Logo' : 'No Logo'}</span></p>
            <p>Graphic: <span className="text-cognify-white">{graphic === 'none' ? 'None' : graphic.replace('graphic0', 'Graphic ')}</span></p>
            {customText && <p>Text: <span className="text-cognify-white">"{customText}"</span></p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-28">
      <div className="relative aspect-[3/4] bg-cognify-card border border-cognify-border overflow-hidden group cursor-grab active:cursor-grabbing">
        <Canvas shadows={quality.shadows} dpr={quality.dpr} camera={{ position: [0, 0, 4], fov: 45 }}>
          <Suspense fallback={null}>
            {quality.env && <Environment preset="studio" />}
            <ambientLight intensity={0.5 * quality.intensity} />
            <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1 * quality.intensity} castShadow={quality.shadows} />
            
            <PresentationControls
              global
              config={{ mass: 1, tension: 500 }}
              snap={{ mass: 4, tension: 1500 }}
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI, Math.PI]}
            >
              <Stage environment="studio" intensity={0.5 * quality.intensity} adjustCamera={1.2}>
                <CustomizableModel 
                  url={modelUrl}
                  color={color.name}
                  logo={logo}
                  graphic={graphic}
                  customText={customText}
                  font={font}
                />
              </Stage>
            </PresentationControls>
            
          </Suspense>
        </Canvas>
        
        <div className="absolute bottom-4 left-4 bg-cognify-bg/60 backdrop-blur-sm border border-cognify-border px-3 py-2 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs text-cognify-offwhite">Drag to rotate • Scroll to zoom</p>
        </div>
      </div>
      
      {/* Summary */}
      <div className="mt-3 p-3 bg-cognify-card border border-cognify-border">
        <p className="text-xs text-cognify-gray uppercase tracking-widest mb-2">Preview Summary</p>
        <div className="space-y-1 text-xs text-cognify-gray">
          <p>Color: <span className="text-cognify-white">{color.name}</span></p>
          <p>Logo: <span className="text-cognify-white">{logo === 'cognify' ? 'Cognify Logo' : 'No Logo'}</span></p>
          <p>Graphic: <span className="text-cognify-white">{graphic === 'none' ? 'None' : graphic.replace('graphic0', 'Graphic ')}</span></p>
          {customText && <p>Text: <span className="text-cognify-white">"{customText}"</span></p>}
        </div>
      </div>
    </div>
  );
}

useGLTF.preload('/models/cognify-hoodie.glb');
useGLTF.preload('/models/cognify-shirt.glb');
