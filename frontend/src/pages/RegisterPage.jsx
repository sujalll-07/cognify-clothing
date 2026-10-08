import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await register(formData);
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pt-32 pb-16 min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-cognify-card border border-cognify-border p-8">
        <h1 className="text-2xl font-bold text-cognify-white mb-2 text-center">Create Account</h1>
        <p className="text-sm text-cognify-gray mb-8 text-center">Join Cognify and unlock exclusive benefits.</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Full Name</label>
            <input required name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Email</label>
            <input required name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Password (min. 8 characters)</label>
            <input required minLength={8} name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Address (Optional)</label>
            <textarea name="address" placeholder="Your delivery address" value={formData.address} onChange={handleChange} className="input-field min-h-[80px]" />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary w-full mt-4">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-cognify-gray mt-6 text-center">
          Already have an account? <Link to="/login" className="text-cognify-white hover:text-cognify-olive transition-colors">Log in</Link>
        </p>
      </div>
    </div>
  );
}
