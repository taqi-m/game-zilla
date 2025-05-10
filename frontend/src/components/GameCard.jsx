import { Link } from 'react-router-dom';

export default function GameCard({ game }) {
  // Placeholder image when no image is available
  const placeholderImage = `https://via.placeholder.com/300x150?text=${encodeURIComponent(game.title)}`;
  
  return (
    <div className="card group">
      <div className="relative overflow-hidden" style={{ paddingTop: '56.25%' }}>
        <img 
          src={game.image_url || placeholderImage} 
          alt={game.title}
          className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {game.is_featured && (
          <span className="absolute top-2 right-2 bg-secondary-600 text-white text-xs px-2 py-1 rounded">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{game.title}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="mr-2">{game.genre}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
          <span className="ml-2">{game.platform}</span>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-lg font-bold text-primary-700">${game.price}</span>
          <Link 
            to={`/game/${game.game_id}`}
            className="btn-primary text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
