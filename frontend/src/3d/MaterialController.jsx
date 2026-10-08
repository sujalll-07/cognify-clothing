import { useLayoutEffect } from 'react';
import * as THREE from 'three';

const SKIP = /stitch|button|metal|zip|hardware/i;

export function applyGarmentColor(root, hex) {
  if (!root || !hex) return;
  const color = new THREE.Color(hex);
  root.traverse((obj) => {
    if (!obj.isMesh) return;
    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
    materials.forEach((mat) => {
      if (!mat) return;
      if (mat.name && SKIP.test(mat.name) && !/fabric|muslin|cloth|hoodie|sweat|rib/i.test(mat.name)) {
        return;
      }
      if (mat.color) mat.color.copy(color);
      if ('metalness' in mat) mat.metalness = Math.min(Number(mat.metalness) || 0, 0.06);
      if ('roughness' in mat) mat.roughness = Math.max(Number(mat.roughness) || 0, 0.78);
      if ('envMapIntensity' in mat) mat.envMapIntensity = 0.28;
      mat.needsUpdate = true;
    });
  });
}

export default function MaterialController({ object, colorHex }) {
  useLayoutEffect(() => {
    applyGarmentColor(object, colorHex);
  }, [object, colorHex]);
  return null;
}
