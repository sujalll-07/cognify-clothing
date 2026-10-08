import { useEffect, useState } from 'react';

function readQuality() {
  if (typeof window === 'undefined') {
    return { isMobile: false, isTablet: false, dpr: [1, 1.5], shadows: true, env: true, intensity: 1 };
  }
  const width = window.innerWidth;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const coarse = window.matchMedia?.('(pointer: coarse)')?.matches;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const mobileLike = isMobile || coarse;
  return {
    isMobile: mobileLike,
    isTablet,
    reduceMotion: !!reduce,
    dpr: mobileLike ? [1, 1.25] : [1, 1.75],
    shadows: !mobileLike,
    env: !isMobile,
    intensity: mobileLike ? 0.65 : 1,
  };
}

export function useDeviceQuality() {
  const [quality, setQuality] = useState(readQuality);
  useEffect(() => {
    const onResize = () => setQuality(readQuality());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return quality;
}
