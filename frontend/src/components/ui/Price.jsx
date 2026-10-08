export default function Price({ price, originalPrice, discount, size = 'md' }) {
  const format = (v) => `₹${v.toLocaleString('en-IN')}`;
  const textSize = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };

  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <span className={`font-bold text-cognify-white ${textSize[size]}`}>
        {format(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <span className="text-cognify-gray line-through text-sm">
          {format(originalPrice)}
        </span>
      )}
      {discount > 0 && (
        <span className="text-green-400 text-sm font-semibold">
          {discount}% off
        </span>
      )}
    </div>
  );
}
