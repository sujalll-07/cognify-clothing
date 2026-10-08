import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="flex items-center border border-cognify-border">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center text-cognify-gray hover:text-cognify-white hover:bg-cognify-card transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Minus size={14} />
      </button>
      <span className="w-12 text-center text-cognify-white font-medium text-sm">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center text-cognify-gray hover:text-cognify-white hover:bg-cognify-card transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
