import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye, Zap } from 'lucide-react';
import ProductCardScene from './ProductCardScene';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`;
}

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={11}
            className={star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-cognify-border fill-cognify-border'}
          />
        ))}
      </div>
      <span className="text-xs text-cognify-gray">
        {rating} ({count})
      </span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [hovering, setHovering] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { dispatch: cartDispatch } = useCart();
  const { isInWishlist, dispatch: wishlistDispatch } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    cartDispatch({
      type: 'ADD_ITEM',
      payload: {
        product,
        color: selectedColor,
        size: product.sizes?.[2] || product.sizes?.[0] || 'M',
        quantity: 1,
      },
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    wishlistDispatch({ type: 'TOGGLE', payload: product });
  };

  return (
    <motion.div
      className="group relative bg-cognify-card border border-cognify-border overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
        {product.modelUrl ? (
          <ProductCardScene url={product.modelUrl} />
        ) : (
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* Second image on hover */}
        {!product.modelUrl && product.images?.[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alt`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovering ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.discount > 0 && (
            <span className="bg-cognify-offwhite text-cognify-bg text-xs font-bold px-2 py-0.5 tracking-wide">
              -{product.discount}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-cognify-olive text-white text-xs font-semibold px-2 py-0.5 tracking-wide">
              NEW
            </span>
          )}
          {product.isCustomizable && (
            <span className="bg-cognify-bg/80 border border-cognify-border text-cognify-gray text-xs px-2 py-0.5 tracking-wide flex items-center gap-1">
              <Zap size={9} /> 3D
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${hovering ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <button
            onClick={handleWishlist}
            className="w-8 h-8 bg-cognify-bg/80 backdrop-blur-sm border border-cognify-border flex items-center justify-center hover:border-cognify-olive transition-colors"
            title="Add to Wishlist"
          >
            <Heart
              size={14}
              className={wishlisted ? 'fill-red-400 text-red-400' : 'text-cognify-gray'}
            />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="w-8 h-8 bg-cognify-bg/80 backdrop-blur-sm border border-cognify-border flex items-center justify-center hover:border-cognify-olive transition-colors"
            title="Quick View"
          >
            <Eye size={14} className="text-cognify-gray" />
          </Link>
        </div>

        {/* Add to Cart overlay */}
        <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${hovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 text-xs font-semibold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 ${
              addedToCart
                ? 'bg-cognify-olive text-white'
                : 'bg-cognify-offwhite text-cognify-bg hover:bg-white'
            }`}
          >
            <ShoppingBag size={13} />
            {addedToCart ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-cognify-white mb-1.5 hover:text-cognify-offwhite transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <StarRating rating={product.rating} count={product.reviews} />

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold text-cognify-white">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-sm text-cognify-gray line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-xs text-green-400 font-semibold">
                {product.discount}% off
              </span>
            </>
          )}
        </div>

        {/* Free Shipping for high-value */}
        {product.price >= 1999 && (
          <p className="text-xs text-cognify-olive mt-1">Free delivery</p>
        )}
      </div>
    </motion.div>
  );
}
