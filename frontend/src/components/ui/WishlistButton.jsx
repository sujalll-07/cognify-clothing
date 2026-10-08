import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext';

export default function WishlistButton({ product, size = 'md', className = '' }) {
  const { isInWishlist, dispatch } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const handleToggle = (e) => {
    e.preventDefault();
    dispatch({ type: 'TOGGLE', payload: product });
  };

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={handleToggle}
      className={`flex items-center justify-center transition-colors ${
        wishlisted ? 'text-red-400' : 'text-cognify-gray hover:text-red-400'
      } ${className}`}
      title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={iconSize}
        className={wishlisted ? 'fill-red-400' : ''}
      />
    </motion.button>
  );
}
