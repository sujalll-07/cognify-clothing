import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Heart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import QuantitySelector from '../components/ui/QuantitySelector';
import EmptyState from '../components/ui/EmptyState';
import Price from '../components/ui/Price';

export default function CartPage() {
  const { items, dispatch: cartDispatch, subtotal, shipping, discountAmount, total } = useCart();
  const { dispatch: wishlistDispatch } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="pt-28 pb-16 min-h-screen max-w-screen-xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-cognify-white mb-8">Shopping Cart</h1>
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
          actionLabel="Continue Shopping"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-cognify-white mb-8">Shopping Cart ({items.length} items)</h1>
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.itemKey} className="flex gap-4 p-4 bg-cognify-card border border-cognify-border">
                <Link to={`/product/${item.product.id}`} className="w-24 h-32 flex-shrink-0 bg-cognify-bg">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-semibold text-cognify-white hover:text-cognify-offwhite transition-colors">{item.product.name}</h3>
                      </Link>
                      <Price price={item.customPrice || item.product.price} size="sm" />
                    </div>
                    <div className="text-xs text-cognify-gray mt-1 space-y-0.5">
                      <p>Color: {item.color?.name || 'Standard'}</p>
                      <p>Size: {item.size}</p>
                      {item.customization && (
                        <div className="mt-2 p-2 border border-cognify-border/50 bg-cognify-bg/50">
                          <span className="text-cognify-olive font-semibold block mb-1">Customizations:</span>
                          <p>Logo: {item.customization.logo}</p>
                          <p>Graphic: {item.customization.graphic}</p>
                          {item.customization.customText && <p>Text: "{item.customization.customText}"</p>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <QuantitySelector 
                      value={item.quantity} 
                      onChange={(q) => cartDispatch({ type: 'UPDATE_QUANTITY', payload: { itemKey: item.itemKey, quantity: q } })} 
                    />
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          wishlistDispatch({ type: 'TOGGLE', payload: item.product });
                          cartDispatch({ type: 'REMOVE_ITEM', payload: item.itemKey });
                        }}
                        className="text-xs flex items-center gap-1 text-cognify-gray hover:text-cognify-white"
                      >
                        <Heart size={14} /> Save
                      </button>
                      <button 
                        onClick={() => cartDispatch({ type: 'REMOVE_ITEM', payload: item.itemKey })}
                        className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-cognify-card border border-cognify-border p-6 sticky top-28">
              <h2 className="text-lg font-bold text-cognify-white mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm text-cognify-gray mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-cognify-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-cognify-white">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
              </div>
              <div className="border-t border-cognify-border pt-4 mb-6 flex justify-between items-end">
                <span className="font-semibold text-cognify-white">Total</span>
                <span className="text-2xl font-bold text-cognify-white">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
