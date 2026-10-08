import { useProgress } from '@react-three/drei';

export default function LoadingExperience({ force = false }) {
  const { active, progress } = useProgress();
  if (!force && !active) return null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-cognify-bg/85 backdrop-blur-sm pointer-events-none">
      <p className="text-2xl tracking-[0.45em] font-bold text-cognify-offwhite">COGNIFY</p>
      <p className="mt-3 text-xs tracking-[0.28em] uppercase text-cognify-gray">Loading experience...</p>
      <div className="mt-6 h-px w-32 bg-cognify-border overflow-hidden">
        <div
          className="h-full bg-cognify-olive transition-[width] duration-200"
          style={{ width: `${Math.min(100, Math.round(progress || 0))}%` }}
        />
      </div>
    </div>
  );
}
