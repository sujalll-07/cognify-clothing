import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = [
  { value: 'hoodies', label: 'Hoodies' },
  { value: 'shirts', label: 'Shirts' },
  { value: 'tshirts', label: 'T-Shirts' },
  { value: 'jeans', label: 'Jeans' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38'];

const COLORS = [
  { name: 'Black', hex: '#080808' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Olive', hex: '#858C72' },
  { name: 'Navy', hex: '#1B2A4A' },
  { name: 'Cream', hex: '#E8E5DC' },
];

const PRICE_RANGES = [
  { label: 'Under ₹1,000', min: 0, max: 999 },
  { label: '₹1,000 - ₹2,000', min: 1000, max: 1999 },
  { label: '₹2,000 - ₹3,000', min: 2000, max: 2999 },
  { label: '₹3,000+', min: 3000, max: 99999 },
];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-cognify-border pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-cognify-offwhite">{title}</span>
        {open ? <ChevronUp size={14} className="text-cognify-gray" /> : <ChevronDown size={14} className="text-cognify-gray" />}
      </button>
      {open && children}
    </div>
  );
}

export default function FilterPanel({ filters, onChange }) {
  const toggle = (key, value) => {
    const arr = filters[key];
    onChange({
      ...filters,
      [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
    });
  };

  const setPrice = (min, max) => {
    onChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const clearAll = () => {
    onChange({ categories: [], sizes: [], colors: [], minPrice: 0, maxPrice: 10000, inStock: false });
  };

  const hasFilters = filters.categories.length > 0 || filters.sizes.length > 0 || filters.colors.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-cognify-white uppercase tracking-widest">Filters</h3>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-cognify-olive hover:text-cognify-offwhite transition-colors">
            Clear All
          </button>
        )}
      </div>

      <FilterSection title="Category">
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.value)}
                onChange={() => toggle('categories', cat.value)}
                className="w-3.5 h-3.5 accent-cognify-olive"
              />
              <span className="text-sm text-cognify-gray group-hover:text-cognify-white transition-colors">{cat.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-2">
          {PRICE_RANGES.map(range => (
            <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                onChange={() => setPrice(range.min, range.max)}
                className="accent-cognify-olive"
              />
              <span className="text-sm text-cognify-gray group-hover:text-cognify-white transition-colors">{range.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio"
              name="price"
              checked={filters.minPrice === 0 && filters.maxPrice === 10000}
              onChange={() => setPrice(0, 10000)}
              className="accent-cognify-olive"
            />
            <span className="text-sm text-cognify-gray group-hover:text-cognify-white transition-colors">All Prices</span>
          </label>
        </div>
      </FilterSection>

      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map(size => (
            <button
              key={size}
              onClick={() => toggle('sizes', size)}
              className={`px-2.5 py-1 text-xs border transition-colors ${
                filters.sizes.includes(size)
                  ? 'border-cognify-offwhite text-cognify-offwhite bg-cognify-offwhite/10'
                  : 'border-cognify-border text-cognify-gray hover:border-cognify-olive'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {COLORS.map(color => (
            <button
              key={color.name}
              onClick={() => toggle('colors', color.name)}
              title={color.name}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                filters.colors.includes(color.name)
                  ? 'border-cognify-offwhite scale-110'
                  : 'border-transparent hover:border-cognify-gray'
              }`}
              style={{ backgroundColor: color.hex, boxShadow: color.name === 'White' ? 'inset 0 0 0 1px #2A2A2A' : undefined }}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
