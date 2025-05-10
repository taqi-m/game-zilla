import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    api.post('/auth/login', form)
      .then((response) => {
        // Save user data to context and localStorage
        login(response.data);
        navigate('/');
      })
      .catch((err) => {
        setError('Invalid email or password. Please try again.');
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input 
              id="email"
              name="email" 
              type="email" 
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button 
                type="button" 
                className="text-sm text-primary-600 hover:text-primary-800 underline"
                onClick={() => alert('Forgot password functionality not implemented yet.')}
              >
                Forgot password?
              </button>
            </div>
            <input 
              id="password"
              name="password" 
              type="password" 
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div>
            <button 
              type="submit" 
              className="btn-primary w-full py-3 flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-800 font-medium">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
      
      <div className="text-center mt-6">
        <Link to="/" className="text-sm text-gray-600 hover:text-gray-800">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
