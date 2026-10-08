import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { products } from '../data/products';
import ProductGrid from '../components/ui/ProductGrid';
import SortDropdown from '../components/ui/SortDropdown';
import FilterPanel from '../components/ui/FilterPanel';
import EmptyState from '../components/ui/EmptyState';
import { ShoppingBag } from 'lucide-react';

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({ categories: [], sizes: [], colors: [], minPrice: 0, maxPrice: 10000, inStock: false });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const query = searchParams.get('q') || '';
  const filterParam = searchParams.get('filter') || '';

  const filtered = useMemo(() => {
    let result = [...products];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    if (filterParam === 'new') result = result.filter(p => p.isNewArrival);
    if (filterParam === 'trending') result = result.filter(p => p.isTrending);
    if (filters.categories.length > 0) result = result.filter(p => filters.categories.includes(p.category));
    if (filters.sizes.length > 0) result = result.filter(p => p.sizes?.some(s => filters.sizes.includes(s)));
    result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    switch (sortBy) {
      case 'newest': result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0)); break;
      case 'price_low': result.sort((a, b) => a.price - b.price); break;
      case 'price_high': result.sort((a, b) => b.price - a.price); break;
      case 'popularity': result.sort((a, b) => b.reviews - a.reviews); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [query, filterParam, filters, sortBy]);

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-cognify-gray uppercase tracking-widest mb-1">Cognify Store</p>
          <h1 className="text-3xl md:text-4xl font-bold text-cognify-white">
            {query ? `Results for "${query}"` : 'All Products'}
          </h1>
          <p className="text-cognify-gray text-sm mt-2">{filtered.length} products found</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filter - Desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <FilterPanel filters={filters} onChange={setFilters} />
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-cognify-border text-cognify-gray text-sm hover:border-cognify-olive transition-colors"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
              <div className="ml-auto">
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No products found"
                description={query ? `No results for "${query}". Try a different search.` : 'No products match your filters.'}
                actionLabel="Clear Filters"
                actionHref="/shop"
              />
            ) : (
              <ProductGrid products={filtered} columns={3} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-cognify-secondary border-l border-cognify-border overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-cognify-border">
              <h3 className="font-semibold text-cognify-white">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="text-cognify-gray hover:text-cognify-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <FilterPanel filters={filters} onChange={setFilters} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
