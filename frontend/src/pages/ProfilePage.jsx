import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const [message] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    api.post('/auth/logout')
      .then(() => {
        logout();
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
        // Logout locally even if server request fails
        logout();
        navigate('/');
      });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Sign Out
          </button>
        </div>

        {message.text && (
          <div className={`p-3 rounded mb-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div>
          <dl className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 border-b border-gray-100">
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="text-sm text-gray-900 sm:col-span-2">{currentUser.username}</dd>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 border-b border-gray-100">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900 sm:col-span-2">{currentUser.email}</dd>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 border-b border-gray-100">
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="text-sm text-gray-900 sm:col-span-2">
                {currentUser.role_name === 'Admin' ? (
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    {currentUser.role_name}
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    User
                  </span>
                )}
              </dd>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 border-b border-gray-100">
              <dt className="text-sm font-medium text-gray-500">Account Status</dt>
              <dd className="text-sm text-gray-900 sm:col-span-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
              </dd>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3">
              <dt className="text-sm font-medium text-gray-500">Member Since</dt>
              <dd className="text-sm text-gray-900 sm:col-span-2">
                {new Date(currentUser.created_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
