import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Zap, Truck, RotateCcw, Shield, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { getProductById, getRelatedProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Rating from '../components/ui/Rating';
import Price from '../components/ui/Price';
import QuantitySelector from '../components/ui/QuantitySelector';
import ProductGrid from '../components/ui/ProductGrid';
import EmptyState from '../components/ui/EmptyState';
import { ShoppingBag as BagIcon } from 'lucide-react';

import ProductScene from '../3d/ProductScene';

// Removed ProductViewerPlaceholder

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-cognify-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="text-sm font-semibold text-cognify-white tracking-wide">{title}</span>
        {open ? <ChevronUp size={16} className="text-cognify-gray" /> : <ChevronDown size={16} className="text-cognify-gray" />}
      </button>
      {open && (
        <div className="pb-4 text-cognify-gray text-sm leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const { dispatch: cartDispatch } = useCart();
  const { isInWishlist, dispatch: wishlistDispatch } = useWishlist();

  if (!product) {
    return (
      <div className="pt-28 min-h-screen">
        <EmptyState
          icon={BagIcon}
          title="Product Not Found"
          description="This product does not exist or has been removed."
          actionLabel="Browse Shop"
          actionHref="/shop"
        />
      </div>
    );
  }

  const activeColor = selectedColor || product.colors?.[0];
  const wishlisted = isInWishlist(product.id);
  const related = getRelatedProducts(product, 4);

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    cartDispatch({
      type: 'ADD_ITEM',
      payload: { product, color: activeColor, size: selectedSize, quantity },
    });
    navigate('/cart');
  };

  const handleBuyNow = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    cartDispatch({
      type: 'ADD_ITEM',
      payload: { product, color: activeColor, size: selectedSize, quantity },
    });
    navigate('/checkout');
  };

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-cognify-gray mb-8">
          <Link to="/" className="hover:text-cognify-offwhite transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-cognify-offwhite transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-cognify-offwhite transition-colors capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-cognify-offwhite line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
          {/* LEFT — Product Viewer */}
          <ProductScene product={product} activeColor={activeColor} />

          {/* RIGHT — Product Info */}
          <div>
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              {product.isNewArrival && (
                <span className="text-xs bg-cognify-olive text-white px-2 py-0.5 font-semibold tracking-wide">NEW</span>
              )}
              {product.isTrending && (
                <span className="text-xs border border-cognify-border text-cognify-gray px-2 py-0.5 tracking-wide">TRENDING</span>
              )}

            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-cognify-white tracking-tight mb-3">
              {product.name}
            </h1>

            <div className="mb-4">
              <Rating value={product.rating} count={product.reviews} size="md" />
            </div>

            <div className="mb-6">
              <Price
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                size="lg"
              />
              <p className="text-xs text-cognify-gray mt-1">Inclusive of all taxes</p>
            </div>

                        {/* Size */}
            {product.sizes && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-cognify-offwhite">
                    Size: <span className="text-cognify-gray">{selectedSize || 'Select'}</span>
                  </p>
                  <button className="text-xs text-cognify-olive hover:text-cognify-offwhite transition-colors">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className={`min-w-[44px] h-10 px-3 border text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-cognify-offwhite text-cognify-offwhite bg-cognify-offwhite/10'
                          : 'border-cognify-border text-cognify-gray hover:border-cognify-olive'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="text-red-400 text-xs mt-2">Please select a size</p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-cognify-offwhite mb-3">Quantity</p>
              <QuantitySelector value={quantity} onChange={setQuantity} />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist + Share */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => wishlistDispatch({ type: 'TOGGLE', payload: product })}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  wishlisted ? 'text-red-400' : 'text-cognify-gray hover:text-red-400'
                }`}
              >
                <Heart size={16} className={wishlisted ? 'fill-red-400' : ''} />
                {wishlisted ? 'Saved' : 'Save to Wishlist'}
              </button>
              <button className="flex items-center gap-2 text-sm text-cognify-gray hover:text-cognify-white transition-colors">
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* Customize CTA */}
            {product.isCustomizable && (
              <div className="mb-8 p-4 border border-cognify-olive/30 bg-cognify-olive/5">
                <p className="text-cognify-offwhite font-semibold text-sm mb-1">Make it yours</p>
                <p className="text-cognify-gray text-xs mb-3">Customize this {product.category === 'hoodies' ? 'hoodie' : 'shirt'} with colors, graphics, and text.</p>
                <Link
                  to={`/customize/${product.id}`}
                  className="flex items-center gap-2 text-sm text-cognify-olive hover:text-cognify-offwhite transition-colors font-medium"
                >
                  <Zap size={14} /> Customize in 3D →
                </Link>
              </div>
            )}

            {/* Perks */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: Truck, label: 'Free Delivery', sub: 'Orders above ₹999' },
                { icon: RotateCcw, label: '15-Day Returns', sub: 'Hassle-free' },
                { icon: Shield, label: 'Authentic', sub: '100% Genuine' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center p-3 border border-cognify-border">
                  <Icon size={18} className="text-cognify-olive mx-auto mb-1" />
                  <p className="text-xs text-cognify-white font-medium">{label}</p>
                  <p className="text-xs text-cognify-gray">{sub}</p>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="border-t border-cognify-border">
              <AccordionItem title="Description">
                <p>{product.description}</p>
              </AccordionItem>
              <AccordionItem title="Material & Care">
                <p className="mb-2"><strong className="text-cognify-white">Material:</strong> {product.material}</p>
                <p><strong className="text-cognify-white">Care:</strong> {product.care}</p>
              </AccordionItem>
              <AccordionItem title="Shipping & Returns">
                <p className="mb-2">Free delivery on orders above ₹999. Standard delivery in 3-5 business days.</p>
                <p>Easy 15-day returns. Products must be unworn and in original condition.</p>
              </AccordionItem>
              <AccordionItem title={`Reviews (${product.reviews})`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl font-black text-cognify-offwhite">{product.rating}</div>
                  <div>
                    <Rating value={product.rating} count={product.reviews} size="md" />
                    <p className="text-xs text-cognify-gray mt-1">Based on {product.reviews} verified reviews</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[{
                    name: 'Rahul M.', rating: 5, text: 'Excellent quality! The fabric feels premium and the fit is perfect. Highly recommend.', date: 'Oct 2026'
                  }, {
                    name: 'Arjun K.', rating: 4, text: 'Great product for the price. Shipping was fast. Would buy again.', date: 'Sep 2026'
                  }].map((review, i) => (
                    <div key={i} className="border-b border-cognify-border pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-cognify-white">{review.name}</span>
                        <span className="text-xs text-cognify-gray">{review.date}</span>
                      </div>
                      <Rating value={review.rating} showCount={false} size="sm" />
                      <p className="text-sm text-cognify-gray mt-2">{review.text}</p>
                    </div>
                  ))}
                </div>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="mb-8">
              <p className="section-subtitle mb-2">More like this</p>
              <h2 className="section-title">Related Products</h2>
            </div>
            <ProductGrid products={related} columns={4} />
          </div>
        )}
      </div>
    </div>
  );
}
