import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    setLoading(true);
    api.get(`/games/${id}`)
      .then(res => {
        setGame(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // Check if game is already in the user's cart
  useEffect(() => {
    if (currentUser && game) {
      api.get(`/cart/${currentUser.user_id}`)
        .then(res => {
          const items = res.data.items || [];
          const found = items.some(item => item.game_id === parseInt(id));
          setInCart(found);
        })
        .catch(err => {
          console.error("Error checking cart:", err);
        });
    }
  }, [currentUser, game, id]);

  const handleAddToCart = () => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    setIsAddingToCart(true);
    api.post('/cart/add', { 
      game_id: game.game_id, 
      quantity,
      user_id: currentUser.user_id 
    })
      .then(() => {
        setInCart(true);
        setIsAddingToCart(false);
      })
      .catch(err => {
        console.error(err);
        setIsAddingToCart(false);
        alert(`Failed to add to cart. Current user: ${JSON.stringify(currentUser)}`);
      });
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!game) return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-600">Game not found</h2>
      <p className="mt-2">The game you're looking for doesn't exist or has been removed.</p>
    </div>
  );

  // Placeholder image when no image is available
  const placeholderImage = `https://via.placeholder.com/600x400?text=${encodeURIComponent(game.title)}`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        {/* Game Image */}
        <div className="md:w-1/2">
          <div className="aspect-video bg-gray-200">
            <img 
              src={game.image_url || placeholderImage} 
              alt={game.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Game Details */}
        <div className="p-6 md:w-1/2">
          <div className="flex items-center mb-4">
            <span className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">{game.platform}</span>
            {game.is_featured && (
              <span className="ml-2 bg-secondary-600 text-white text-sm px-3 py-1 rounded-full">Featured</span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
          
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span>{game.developer}</span>
            <span className="mx-2">•</span>
            <span>{game.genre}</span>
            <span className="mx-2">•</span>
            <span>{new Date(game.release_date).getFullYear()}</span>
          </div>
          
          <div className="text-2xl font-bold text-primary-700 mb-6">${game.price}</div>
          
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <div className="flex items-center">
              <button 
                className="bg-gray-200 px-3 py-1 rounded-l-md"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input 
                type="number" 
                id="quantity"
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="text-center w-16 py-1 border-t border-b border-gray-300"
                min="1"
              />
              <button 
                className="bg-gray-200 px-3 py-1 rounded-r-md"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          {inCart ? (
            <button 
              className="bg-green-600 hover:bg-green-700 text-white w-full py-3 flex items-center justify-center mb-6 rounded"
              onClick={handleGoToCart}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Go to Cart
            </button>
          ) : (
            <button 
              className={`btn-primary w-full py-3 flex items-center justify-center mb-6 ${isAddingToCart ? 'opacity-75' : ''}`}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Adding...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
          )}
          
          {/* Game attributes */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold mb-2">Game Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Platform:</div>
              <div>{game.platform}</div>
              
              <div className="text-gray-600">Developer:</div>
              <div>{game.developer}</div>
              
              <div className="text-gray-600">Release Date:</div>
              <div>{new Date(game.release_date).toLocaleDateString()}</div>
              
              <div className="text-gray-600">Genre:</div>
              <div>{game.genre}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game Description */}
      <div className="p-6 border-t border-gray-200">
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{game.description}</p>
      </div>
    </div>
  );
}
