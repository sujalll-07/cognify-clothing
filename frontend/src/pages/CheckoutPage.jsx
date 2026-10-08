import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/ui/EmptyState';
import { ShoppingBag, CheckCircle, Truck, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function CheckoutPage() {
  const { items, total, subtotal, shipping, dispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0 && !placed) {
    return (
      <div className="pt-28 pb-16 min-h-screen max-w-screen-xl mx-auto px-4 sm:px-6">
        <EmptyState
          icon={ShoppingBag}
          title="Checkout Error"
          description="Your cart is empty. Please add items before checking out."
          actionLabel="Back to Shop"
          actionHref="/shop"
        />
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const address = `${formData.get('address')}, ${formData.get('city')}, ${formData.get('pincode')}`;

    try {
      const orderData = {
        shippingAddress: address,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color?.name || item.color,
          customization: item.customization || undefined,
        }))
      };

      await api.createOrder(orderData);
      setPlaced(true);
      dispatch({ type: 'CLEAR_CART' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    return (
      <div className="pt-28 pb-16 min-h-screen max-w-screen-xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center justify-center">
        <div className="w-16 h-16 rounded-full bg-cognify-olive/20 flex items-center justify-center mb-6">
          <CheckCircle size={32} className="text-cognify-olive" />
        </div>
        <h1 className="text-3xl font-bold text-cognify-white mb-2">Order Confirmed!</h1>
        <p className="text-cognify-gray mb-8">Thank you for your purchase. Your order has been placed successfully.</p>
        <Link to="/orders" className="btn-primary">View Orders</Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-cognify-white mb-8">Checkout</h1>
        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Contact Info */}
            <div className="bg-cognify-card border border-cognify-border p-6">
              <h2 className="text-xl font-bold text-cognify-white mb-4">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Email Address</label>
                  <input required type="email" placeholder="john@example.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Phone Number</label>
                  <input required type="tel" placeholder="+91 98765 43210" className="input-field" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-cognify-card border border-cognify-border p-6">
              <h2 className="text-xl font-bold text-cognify-white mb-4 flex items-center gap-2"><MapPin size={20} /> Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">First Name</label>
                    <input required type="text" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Last Name</label>
                    <input required type="text" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Address</label>
                  <input name="address" required type="text" placeholder="Street, House No." className="input-field" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">City</label>
                    <input name="city" required type="text" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">PIN Code</label>
                    <input name="pincode" required type="text" className="input-field" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-cognify-card border border-cognify-border p-6">
              <h2 className="text-xl font-bold text-cognify-white mb-4">Payment Method</h2>
              <div className="border border-cognify-olive bg-cognify-olive/5 p-4 flex items-center gap-3 cursor-pointer">
                <input type="radio" checked readOnly className="accent-cognify-olive w-4 h-4" />
                <span className="font-semibold text-cognify-offwhite">Cash on Delivery (COD)</span>
              </div>
              <p className="text-xs text-cognify-gray mt-2">Agent 2 will implement online payment systems later.</p>
            </div>

          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-cognify-card border border-cognify-border p-6 sticky top-28">
              <h2 className="text-lg font-bold text-cognify-white mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.itemKey} className="flex gap-3">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-20 object-cover bg-cognify-bg" />
                    <div className="flex-1">
                      <p className="text-sm text-cognify-white font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-cognify-gray">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-cognify-white mt-1">₹{(item.customPrice || item.product.price).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm text-cognify-gray mb-6 pt-4 border-t border-cognify-border">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-cognify-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-cognify-white">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
              </div>
              <div className="border-t border-cognify-border pt-4 mb-6 flex justify-between items-end">
                <span className="font-semibold text-cognify-white">Total</span>
                <span className="text-2xl font-bold text-cognify-white">₹{total.toLocaleString('en-IN')}</span>
              </div>
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? 'Processing...' : (
                  <>Place Order <Truck size={16} /></>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
