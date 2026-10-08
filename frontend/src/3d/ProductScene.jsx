import { useState, Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, PresentationControls, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Zap, Maximize2, RotateCcw } from 'lucide-react';
import { useWebGL } from './useWebGL';
import WebGLFallback from './WebGLFallback';
import { useDeviceQuality } from './useDeviceQuality';

const COLOR_MAP = {
  'Black': '#111111',
  'White': '#F5F5F5',
  'Gray': '#6B7280',
  'Olive': '#858C72',
};

function Model({ url }) {
  const { scene } = useGLTF(url);
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

  return <primitive object={clone} />;
}

export default function ProductScene({ product, activeColor }) {

  const [activeImg, setActiveImg] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const orbitRef = useRef();

  const has3DModel = product.category === 'hoodies' || product.category === 'shirts';
  const modelUrl = product.modelUrl || (product.category === 'hoodies' ? '/models/cognify-hoodie.glb' : '/models/cognify-shirt.glb');
  const hasWebGL = useWebGL();
  const quality = useDeviceQuality();

  if (!hasWebGL || !has3DModel) {
    // Fallback to 2D for jeans, tshirts, etc.
    return (
      <div className="space-y-3">
        <div className="relative aspect-[3/4] bg-cognify-card border border-cognify-border overflow-hidden">
          <img
            src={product.images?.[activeImg]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-16 h-20 border-2 overflow-hidden transition-colors ${
                  i === activeImg ? 'border-cognify-offwhite' : 'border-cognify-border hover:border-cognify-gray'
                }`}
              >
                <img src={img} alt={`View ${i+1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const handleReset = () => {
    if (orbitRef.current) {
      orbitRef.current.reset();
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] bg-cognify-card border border-cognify-border overflow-hidden group cursor-grab active:cursor-grabbing">
        
        <Canvas shadows={quality.shadows} dpr={quality.dpr} camera={{ position: [0, 0, 4], fov: 45 }}>
          <Suspense fallback={null}>
            {quality.env && <Environment preset="studio" />}
            <ambientLight intensity={0.5 * quality.intensity} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1 * quality.intensity} castShadow={quality.shadows} />
            
            <OrbitControls 
              ref={orbitRef}
              autoRotate={autoRotate}
              autoRotateSpeed={2}
              enablePan={false}
              minDistance={2}
              maxDistance={6}
              makeDefault
            />
            
            <Stage environment="studio" intensity={0.5 * quality.intensity} adjustCamera={1.2}>
              <Model url={modelUrl} />
            </Stage>
            
          </Suspense>
        </Canvas>

        {product.isCustomizable && (
          <div className="absolute top-4 left-4 bg-cognify-bg/80 border border-cognify-olive/50 px-3 py-1.5 text-xs text-cognify-olive tracking-widest flex items-center gap-1.5 pointer-events-none">
            <Zap size={10} /> 3D CUSTOMIZABLE
          </div>
        )}

        {/* 3D Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button 
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 bg-cognify-bg/80 backdrop-blur-sm border ${autoRotate ? 'border-cognify-offwhite text-cognify-offwhite' : 'border-cognify-border text-cognify-gray'} transition-colors`}
            title="Toggle Auto-Rotation"
          >
            <RotateCcw size={16} className={autoRotate ? "animate-spin-slow" : ""} />
          </button>
          <button 
            onClick={handleReset}
            className="p-2 bg-cognify-bg/80 backdrop-blur-sm border border-cognify-border text-cognify-gray hover:text-cognify-white transition-colors"
            title="Reset View"
          >
            <Maximize2 size={16} />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-4 bg-cognify-bg/60 backdrop-blur-sm border border-cognify-border px-3 py-2 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs text-cognify-offwhite">Drag to rotate • Scroll to zoom</p>
        </div>

      </div>
      
      {/* Thumbnails (for reference to 2D view if they want to see actual photos, or we can just leave it for non-3D)
          Actually, let's keep the thumbnails as they might show different real-world angles */}
      {product.images && product.images.length > 0 && (
        <div className="flex gap-2 opacity-50 grayscale pointer-events-none">
           <div className="text-xs text-cognify-gray py-2 flex items-center gap-2">
             <Zap size={12} /> Interactive 3D Model Loaded
           </div>
        </div>
      )}
    </div>
  );
}

// Preload the models
useGLTF.preload('/models/cognify-hoodie.glb');
useGLTF.preload('/models/cognify-shirt.glb');
