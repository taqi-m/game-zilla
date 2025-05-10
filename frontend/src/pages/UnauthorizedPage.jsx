import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="max-w-lg mx-auto text-center py-16">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-24 h-24 mx-auto text-red-500 mb-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      
      <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
      <p className="text-gray-600 mb-8">
        You don't have permission to access this page.
        {currentUser ? (
          <> Your current role doesn't have sufficient privileges.</>
        ) : (
          <> Please log in to continue.</>
        )}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={handleGoBack}
          className="btn-secondary"
        >
          Go Back
        </button>
        <Link to="/" className="btn-primary">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
