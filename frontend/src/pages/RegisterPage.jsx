import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    api.post('/auth/register', {
      username: form.username,
      email: form.email,
      password_hash: form.password
    })
      .then((response) => {
        // Login after successful registration
        return api.post('/auth/login', {
          email: form.email,
          password: form.password
        });
      })
      .then((loginResponse) => {
        login(loginResponse.data);
        navigate('/');
      })
      .catch((err) => {
        setError(err.response?.data || 'Registration failed. Please try again.');
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
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-gray-600 mt-2">Join Game-Zilla today</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input 
              id="username"
              name="username" 
              type="text" 
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input 
              id="password"
              name="password" 
              type="password" 
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input 
              id="confirmPassword"
              name="confirmPassword" 
              type="password" 
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              className="btn-primary w-full py-3 flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
              Sign In
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
