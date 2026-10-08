import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, LogOut } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      setOrdersLoading(true);
      setError(null);
      api.getOrders()
        .then(data => {
          setOrders(data.orders || []);
        })
        .catch(err => {
          setError(err.message || 'Failed to load orders');
        })
        .finally(() => {
          setOrdersLoading(false);
        });
    }
  }, [user, authLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="pt-28 pb-16 min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="text-center py-10 text-cognify-gray">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-cognify-white mb-8">My Orders</h1>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-2">
            <Link to="/account" className="flex items-center gap-3 p-3 text-cognify-gray hover:text-cognify-white hover:bg-cognify-card border border-transparent hover:border-cognify-border transition-colors">
              <User size={18} /> Profile
            </Link>
            <Link to="/orders" className="flex items-center gap-3 p-3 bg-cognify-card text-cognify-white border border-cognify-border font-medium">
              <Package size={18} /> Orders
            </Link>
            <Link to="/wishlist" className="flex items-center gap-3 p-3 text-cognify-gray hover:text-cognify-white hover:bg-cognify-card border border-transparent hover:border-cognify-border transition-colors">
              <Heart size={18} /> Wishlist
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-red-400 hover:text-red-300 hover:bg-cognify-card border border-transparent hover:border-cognify-border transition-colors text-left">
              <LogOut size={18} /> Log Out
            </button>
          </div>

          <div className="md:col-span-3">
            {ordersLoading ? (
              <div className="text-center py-10 text-cognify-gray">Loading orders...</div>
            ) : error ? (
              <div className="bg-cognify-card border border-cognify-border p-8 text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="btn-secondary">Try Again</button>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-cognify-card border border-cognify-border h-full">
                <EmptyState
                  icon={Package}
                  title="No Orders Yet"
                  description="You haven't placed any orders yet. Start exploring our collection."
                  actionLabel="Start Shopping"
                  actionHref="/shop"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-cognify-card border border-cognify-border p-6">
                    <div className="flex justify-between items-center mb-4 border-b border-cognify-border pb-4">
                      <div>
                        <p className="text-sm text-cognify-gray">Order #{order.id}</p>
                        <p className="text-xs text-cognify-gray">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-cognify-white">₹{order.total.toLocaleString('en-IN')}</p>
                        <p className="text-sm font-semibold text-cognify-olive">{order.status}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex-1">
                            <p className="text-sm text-cognify-white font-medium">{item.product?.name || 'Product'}</p>
                            <p className="text-xs text-cognify-gray">Qty: {item.quantity} | Size: {item.size || 'N/A'}</p>
                            {item.customization && (
                              <p className="text-xs text-cognify-olive mt-1">Customized: {item.customization.color || 'Base'} / {item.customization.customText || 'No Text'}</p>
                            )}
                          </div>
                          <p className="text-sm text-cognify-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
