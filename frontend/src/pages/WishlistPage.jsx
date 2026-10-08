import { Link } from 'react-router-dom';
import { User, Package, Heart, LogOut } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductGrid from '../components/ui/ProductGrid';
import EmptyState from '../components/ui/EmptyState';

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-cognify-white mb-8">My Wishlist</h1>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-2">
            <Link to="/account" className="flex items-center gap-3 p-3 text-cognify-gray hover:text-cognify-white hover:bg-cognify-card border border-transparent hover:border-cognify-border transition-colors">
              <User size={18} /> Profile
            </Link>
            <Link to="/orders" className="flex items-center gap-3 p-3 text-cognify-gray hover:text-cognify-white hover:bg-cognify-card border border-transparent hover:border-cognify-border transition-colors">
              <Package size={18} /> Orders
            </Link>
            <Link to="/wishlist" className="flex items-center gap-3 p-3 bg-cognify-card text-cognify-white border border-cognify-border font-medium">
              <Heart size={18} /> Wishlist
            </Link>
            <Link to="/login" className="flex items-center gap-3 p-3 text-red-400 hover:text-red-300 hover:bg-cognify-card border border-transparent hover:border-cognify-border transition-colors text-left">
              <LogOut size={18} /> Log Out
            </Link>
          </div>

          <div className="md:col-span-3">
            {items.length === 0 ? (
              <div className="bg-cognify-card border border-cognify-border h-full">
                <EmptyState
                  icon={Heart}
                  title="Wishlist is Empty"
                  description="Save items you love to your wishlist to review them later."
                  actionLabel="Explore Products"
                  actionHref="/shop"
                />
              </div>
            ) : (
              <div>
                <p className="text-cognify-gray text-sm mb-6">{items.length} items saved</p>
                <ProductGrid products={items} columns={3} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
