import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingBag, Heart, User, Package, Menu, X, ChevronDown, Shield
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Hoodies', href: '/category/hoodies' },
  { label: 'Shirts', href: '/category/shirts' },
  { label: 'T-Shirts', href: '/category/tshirts' },
  { label: 'Jeans', href: '/category/jeans' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user } = useAuth();
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const navClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${scrolled
      ? 'bg-cognify-bg/95 backdrop-blur-md border-b border-cognify-border shadow-lg'
      : 'bg-transparent'}
  `;

  return (
    <>
      <nav className={navClasses}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xl md:text-2xl font-bold tracking-[0.15em] text-cognify-offwhite font-['Space_Grotesk',sans-serif] uppercase">
                Cognify
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more"
                  className="w-full bg-cognify-secondary border border-cognify-border text-cognify-white placeholder-cognify-gray px-4 py-2.5 pr-12 text-sm focus:outline-none focus:border-cognify-olive transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 bottom-0 px-4 bg-cognify-olive text-white hover:bg-cognify-offwhite hover:text-cognify-bg transition-colors"
                >
                  <Search size={16} />
                </button>
              </form>
            </div>

            {/* Desktop Nav Actions */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/account" className="flex flex-col items-center gap-0.5 px-3 py-2 hover:text-cognify-offwhite transition-colors group">
                <User size={20} className="text-cognify-gray group-hover:text-cognify-offwhite transition-colors" />
                <span className="text-xs text-cognify-gray group-hover:text-cognify-offwhite">Account</span>
              </Link>
              {user && user.role === 'ADMIN' && (
                <Link to="/admin" className="flex flex-col items-center gap-0.5 px-3 py-2 hover:text-cognify-offwhite transition-colors group">
                  <Shield size={20} className="text-cognify-olive group-hover:text-cognify-offwhite transition-colors" />
                  <span className="text-xs text-cognify-olive group-hover:text-cognify-offwhite font-bold">Admin</span>
                </Link>
              )}
              <Link to="/orders" className="flex flex-col items-center gap-0.5 px-3 py-2 hover:text-cognify-offwhite transition-colors group">
                <Package size={20} className="text-cognify-gray group-hover:text-cognify-offwhite transition-colors" />
                <span className="text-xs text-cognify-gray group-hover:text-cognify-offwhite">Orders</span>
              </Link>
              <Link to="/wishlist" className="flex flex-col items-center gap-0.5 px-3 py-2 hover:text-cognify-offwhite transition-colors group relative">
                <div className="relative">
                  <Heart size={20} className="text-cognify-gray group-hover:text-cognify-offwhite transition-colors" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-cognify-olive text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </div>
                <span className="text-xs text-cognify-gray group-hover:text-cognify-offwhite">Wishlist</span>
              </Link>
              <Link to="/cart" className="flex flex-col items-center gap-0.5 px-3 py-2 hover:text-cognify-offwhite transition-colors group relative">
                <div className="relative">
                  <ShoppingBag size={20} className="text-cognify-gray group-hover:text-cognify-offwhite transition-colors" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-cognify-offwhite text-cognify-bg text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="text-xs text-cognify-gray group-hover:text-cognify-offwhite">Cart</span>
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-cognify-gray hover:text-cognify-white transition-colors"
              >
                <Search size={20} />
              </button>
              <Link to="/cart" className="relative text-cognify-gray hover:text-cognify-white transition-colors">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-cognify-offwhite text-cognify-bg text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-cognify-gray hover:text-cognify-white transition-colors"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Desktop Category Nav */}
          <div className="hidden md:flex items-center gap-6 pb-2 border-t border-cognify-border/30">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-xs tracking-widest uppercase text-cognify-gray hover:text-cognify-offwhite transition-colors py-1.5 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-cognify-olive transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-cognify-secondary border-t border-cognify-border overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 px-2 text-sm text-cognify-gray hover:text-cognify-white border-b border-cognify-border/30 tracking-wider"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 grid grid-cols-3 gap-2">
                  <Link to="/account" onClick={() => setMenuOpen(false)} className="flex flex-col items-center gap-1 py-3 text-cognify-gray hover:text-cognify-white">
                    <User size={18} />
                    <span className="text-xs">Account</span>
                  </Link>
                  {user && user.role === 'ADMIN' && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex flex-col items-center gap-1 py-3 text-cognify-olive hover:text-white">
                      <Shield size={18} />
                      <span className="text-xs font-bold">Admin</span>
                    </Link>
                  )}
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="flex flex-col items-center gap-1 py-3 text-cognify-gray hover:text-cognify-white">
                    <Package size={18} />
                    <span className="text-xs">Orders</span>
                  </Link>
                  <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="flex flex-col items-center gap-1 py-3 text-cognify-gray hover:text-cognify-white relative">
                    <div className="relative">
                      <Heart size={18} />
                      {wishlistItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-cognify-olive text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                          {wishlistItems.length}
                        </span>
                      )}
                    </div>
                    <span className="text-xs">Wishlist</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-cognify-bg/95 backdrop-blur-md flex flex-col"
          >
            <div className="flex items-center gap-4 p-4 border-b border-cognify-border">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cognify-gray" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full bg-cognify-secondary border border-cognify-border text-cognify-white placeholder-cognify-gray px-10 py-3 text-sm focus:outline-none focus:border-cognify-olive"
                />
              </form>
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="text-cognify-gray hover:text-cognify-white"
              >
                <X size={22} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs text-cognify-gray uppercase tracking-widest mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Hoodies', 'Black Shirt', 'Slim Jeans', 'Oversized Tee', 'Linen Shirt'].map(term => (
                  <button
                    key={term}
                    onClick={() => {
                      navigate(`/shop?q=${encodeURIComponent(term)}`);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="px-3 py-1.5 bg-cognify-card border border-cognify-border text-cognify-gray text-sm hover:border-cognify-olive hover:text-cognify-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
