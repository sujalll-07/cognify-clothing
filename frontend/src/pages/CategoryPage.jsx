import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { getProductsByCategory } from '../data/products';
import { categories } from '../data/products';
import ProductGrid from '../components/ui/ProductGrid';
import SortDropdown from '../components/ui/SortDropdown';
import EmptyState from '../components/ui/EmptyState';
import { ShoppingBag } from 'lucide-react';

const CATEGORY_LABELS = {
  hoodies: 'Hoodies',
  shirts: 'Shirts',
  tshirts: 'T-Shirts',
  jeans: 'Jeans',
};

export default function CategoryPage() {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState('relevance');
  const catData = categories.find(c => c.id === category);
  const allProducts = getProductsByCategory(category);

  const sorted = useMemo(() => {
    const result = [...allProducts];
    switch (sortBy) {
      case 'price_low': result.sort((a, b) => a.price - b.price); break;
      case 'price_high': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0)); break;
      case 'popularity': result.sort((a, b) => b.reviews - a.reviews); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [allProducts, sortBy]);

  const label = CATEGORY_LABELS[category] || category;

  return (
    <div className="pt-28 pb-16 min-h-screen">
      {/* Category Hero */}
      {catData && (
        <div className="relative h-48 md:h-64 mb-10 overflow-hidden">
          <img
            src={catData.image}
            alt={label}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.4)' }}
          />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 w-full">
              <p className="text-xs text-cognify-gray uppercase tracking-widest mb-2">
                <Link to="/shop" className="hover:text-cognify-offwhite">Shop</Link> › {label}
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{label}</h1>
              <p className="text-cognify-gray text-sm mt-2">{sorted.length} products</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-cognify-gray text-sm">{sorted.length} products</p>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No products found"
            description={`No products found in the ${label} category.`}
            actionLabel="Browse All"
            actionHref="/shop"
          />
        ) : (
          <ProductGrid products={sorted} columns={4} />
        )}
      </div>
    </div>
  );
}
