import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
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
        <h1 className="text-2xl font-bold text-cognify-white mb-2 text-center">Welcome Back</h1>
        <p className="text-sm text-cognify-gray mb-8 text-center">Log in to your Cognify account.</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-cognify-gray mb-2">Email</label>
            <input required name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs uppercase tracking-widest text-cognify-gray">Password</label>
              <a href="#" className="text-xs text-cognify-olive hover:text-cognify-white transition-colors">Forgot?</a>
            </div>
            <input required name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="input-field" />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary w-full mt-4">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-cognify-gray mt-6 text-center">
          Don't have an account? <Link to="/register" className="text-cognify-white hover:text-cognify-olive transition-colors">Register here</Link>
        </p>
      </div>
    </div>
  );
}
