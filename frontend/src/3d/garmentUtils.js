import * as THREE from 'three';

export function cloneSkinned(scene) {
  return scene.clone(true);
}

export function prepareGarment(root, { castShadow = true } = {}) {
  root.traverse((obj) => {
    if (!obj.isMesh) return;
    obj.castShadow = castShadow;
    obj.receiveShadow = true;
    obj.frustumCulled = false;
    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
    materials.forEach((mat) => {
      if (!mat) return;
      mat.side = THREE.DoubleSide;
      if ('metalness' in mat) mat.metalness = Math.min(Number(mat.metalness) || 0, 0.06);
      if ('roughness' in mat) mat.roughness = Math.max(Number(mat.roughness) || 0, 0.78);
      if ('envMapIntensity' in mat) mat.envMapIntensity = 0.28;
    });
  });
  return root;
}

export function pickDecalMesh(root, { preferName = /front|hoodie|cloth|body/i } = {}) {
  let best = null;
  let bestScore = -Infinity;
  root.traverse((obj) => {
    if (!obj.isMesh || !obj.geometry) return;
    const geo = obj.geometry;
    if (!geo.boundingBox) geo.computeBoundingBox();
    const size = new THREE.Vector3();
    geo.boundingBox.getSize(size);
    const volume = size.x * size.y * size.z;
    const matName = obj.material?.name || '';
    const prefer = preferName.test(obj.name) || preferName.test(matName);
    const score = volume + (prefer ? volume * 0.35 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = obj;
    }
  });
  return best;
}

export function chestLocal(mesh, { yLift = 0.16, zInset = 0.002, scaleMul = 0.22 } = {}) {
  if (!mesh?.geometry) {
    return { position: [0, 0.2, 0.2], scale: 0.18 };
  }
  const geo = mesh.geometry;
  if (!geo.boundingBox) geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  bb.getSize(size);
  bb.getCenter(center);
  const zFront = bb.max.z - size.z * zInset;
  return {
    position: [center.x, center.y + size.y * yLift, zFront],
    scale: Math.max(0.04, Math.min(size.x, size.y) * scaleMul),
  };
}
