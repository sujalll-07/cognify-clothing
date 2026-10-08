import { Star } from 'lucide-react';

export default function Rating({ value, count, size = 'sm', showCount = true }) {
  const starSize = size === 'sm' ? 12 : size === 'md' ? 16 : 20;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(s => (
          <Star
            key={s}
            size={starSize}
            className={s <= Math.round(value) ? 'text-yellow-400 fill-yellow-400' : 'text-cognify-border fill-cognify-border'}
          />
        ))}
      </div>
      <span className={`text-cognify-gray ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        {value}
      </span>
      {showCount && count !== undefined && (
        <span className={`text-cognify-gray ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          ({count} reviews)
        </span>
      )}
    </div>
  );
}
