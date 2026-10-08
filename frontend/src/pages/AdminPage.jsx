import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Plus, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addProduct'
  
  // Product form state
  const [productData, setProductData] = useState({
    name: '', slug: '', description: '', price: '', categoryId: '1', stock: '100'
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      navigate('/account');
    } else if (user && user.role === 'ADMIN') {
      loadOrders();
    }
  }, [user, loading, navigate]);

  const loadOrders = () => {
    api.getAllOrders().then(data => setOrders(data.orders || [])).catch(console.error);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrder(orderId, { status: newStatus });
      loadOrders();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addProduct(productData);
      alert('Product added successfully!');
      setProductData({ name: '', slug: '', description: '', price: '', categoryId: '1', stock: '100' });
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading || !user || user.role !== 'ADMIN') return null;

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-cognify-white mb-8">Admin Dashboard</h1>

        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 border ${activeTab === 'orders' ? 'bg-cognify-olive border-cognify-olive text-white' : 'border-cognify-border text-cognify-gray'}`}>All Orders</button>
          <button onClick={() => setActiveTab('addProduct')} className={`px-4 py-2 border ${activeTab === 'addProduct' ? 'bg-cognify-olive border-cognify-olive text-white' : 'border-cognify-border text-cognify-gray'}`}>Add Product</button>
        </div>

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-cognify-card border border-cognify-border p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-cognify-gray">Order #{order.id} - User: {order.user?.email}</p>
                    <p className="text-xs text-cognify-gray">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-cognify-white">₹{order.total.toLocaleString('en-IN')}</p>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-cognify-bg border border-cognify-border text-cognify-white px-2 py-1 text-sm"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-cognify-gray">No orders found.</p>}
          </div>
        )}

        {activeTab === 'addProduct' && (
          <div className="bg-cognify-card border border-cognify-border p-6">
            <form onSubmit={handleProductSubmit} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Name</label>
                <input required type="text" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Slug (optional)</label>
                <input type="text" value={productData.slug} onChange={e => setProductData({...productData, slug: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Price (₹)</label>
                <input required type="number" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Category ID</label>
                <input required type="number" value={productData.categoryId} onChange={e => setProductData({...productData, categoryId: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Description</label>
                <textarea required value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} className="input-field min-h-[100px]" />
              </div>
              <button type="submit" className="btn-primary">Add Product</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
