import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="pt-28 pb-16 min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="text-center py-10 text-cognify-gray">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const [firstName, ...lastNameParts] = (user.name || '').split(' ');
  const lastName = lastNameParts.join(' ');

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-cognify-white mb-8">My Account</h1>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-2">
            <Link to="/account" className="flex items-center gap-3 p-3 bg-cognify-card text-cognify-white border border-cognify-border font-medium">
              <User size={18} /> Profile
            </Link>
            <Link to="/orders" className="flex items-center gap-3 p-3 text-cognify-gray hover:text-cognify-white hover:bg-cognify-card border border-transparent hover:border-cognify-border transition-colors">
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
            <div className="bg-cognify-card border border-cognify-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-cognify-white mb-6">Profile Details</h2>
              <div className="space-y-6 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">First Name</label>
                    <input type="text" defaultValue={firstName} className="input-field bg-cognify-bg" readOnly />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Last Name</label>
                    <input type="text" defaultValue={lastName} className="input-field bg-cognify-bg" readOnly />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Email Address</label>
                  <input type="email" defaultValue={user.email} disabled className="input-field bg-cognify-bg opacity-70 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Address</label>
                  <textarea defaultValue={user.address || ''} className="input-field bg-cognify-bg min-h-[80px]" readOnly />
                </div>
                <button className="btn-secondary" onClick={() => alert('Editing profile is coming soon!')}>Edit Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
