import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/api';

export default function AdminGameFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock_quantity: '',
    developer: '',
    publisher: '',
    release_date: '',
    platform: '',
    genre: '',
    is_featured: false,
    image_url: ''
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const genresResponse = await api.get('/games/genres');
        const platformsResponse = await api.get('/games/platforms');
        
        setGenres(genresResponse.data);
        setPlatforms(platformsResponse.data);
      } catch (err) {
        console.error('Error fetching form options:', err);
        setError('Failed to load form options');
      }
    };

    fetchOptions();

    // If in edit mode, fetch the game data
    if (isEditMode) {
      const fetchGameData = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/games/${id}`);
          const gameData = response.data;
          
          // Format the date to YYYY-MM-DD for the input
          const formattedDate = gameData.release_date ? 
            new Date(gameData.release_date).toISOString().split('T')[0] : '';
            
          setFormData({
            ...gameData,
            release_date: formattedDate,
            is_featured: Boolean(gameData.is_featured)
          });
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching game:', err);
          setError('Failed to load game data');
          setLoading(false);
        }
      };
      
      fetchGameData();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form data
      if (!formData.title || !formData.price || !formData.platform || !formData.genre) {
        setError('Please fill out all required fields');
        return;
      }
      
      // Ensure price is a number
      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue) || priceValue <= 0) {
        setError('Please enter a valid price');
        return;
      }
      
      // Ensure stock quantity is a positive integer
      const stockValue = parseInt(formData.stock_quantity);
      if (isNaN(stockValue) || stockValue < 0) {
        setError('Please enter a valid stock quantity');
        return;
      }
      
      // Prepare data for API
      const gameData = {
        ...formData,
        price: priceValue,
        stock_quantity: stockValue,
        is_featured: formData.is_featured ? 1 : 0
      };
      
      if (isEditMode) {
        await api.put(`/admin/games/${id}`, gameData);
      } else {
        await api.post('/admin/games', gameData);
      }
      
      navigate('/admin/games');
    } catch (err) {
      console.error('Error saving game:', err);
      setError('Failed to save game data');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{isEditMode ? 'Edit Game' : 'Add New Game'}</h1>
        <Link to="/admin/games" className="btn-secondary">
          Back to Games
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url || ''}
                onChange={handleChange}
                className="form-input w-full"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows="5"
                className="form-textarea w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)*
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="form-input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity*
              </label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity || 0}
                onChange={handleChange}
                required
                min="0"
                className="form-input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Developer
              </label>
              <input
                type="text"
                name="developer"
                value={formData.developer || ''}
                onChange={handleChange}
                className="form-input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publisher
              </label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher || ''}
                onChange={handleChange}
                className="form-input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Release Date
              </label>
              <input
                type="date"
                name="release_date"
                value={formData.release_date || ''}
                onChange={handleChange}
                className="form-input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform*
              </label>
              <select
                name="platform"
                value={formData.platform || ''}
                onChange={handleChange}
                required
                className="form-select w-full"
              >
                <option value="">Select Platform</option>
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre*
              </label>
              <select
                name="genre"
                value={formData.genre || ''}
                onChange={handleChange}
                required
                className="form-select w-full"
              >
                <option value="">Select Genre</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <div className="flex items-center mt-5">
                <input
                  type="checkbox"
                  name="is_featured"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
                <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                  Featured Game
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex justify-end gap-4">
            <Link
              to="/admin/games"
              className="btn-secondary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="btn-primary"
            >
              {isEditMode ? 'Update Game' : 'Add Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
