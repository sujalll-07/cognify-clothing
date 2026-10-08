import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductGrid from '../ui/ProductGrid';

export default function ProductSection({ title, subtitle, products, viewAllHref, columns = 4 }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            {subtitle && (
              <p className="section-subtitle mb-2">{subtitle}</p>
            )}
            <h2 className="section-title">{title}</h2>
          </div>
          {viewAllHref && (
            <Link
              to={viewAllHref}
              className="hidden sm:flex items-center gap-2 text-sm text-cognify-gray hover:text-cognify-offwhite transition-colors group"
            >
              View All
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <ProductGrid products={products} columns={columns} />

        {/* Mobile View All */}
        {viewAllHref && (
          <div className="mt-8 sm:hidden text-center">
            <Link to={viewAllHref} className="btn-secondary inline-flex items-center gap-2">
              View All <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
