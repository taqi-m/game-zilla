import React, { useEffect, useState, useRef } from 'react';
import api from '../api/api';
import GameCard from '../components/GameCard';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './HomePage.css'; // Add a CSS file for animations
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');
  const [filterBy, setFilterBy] = useState('all');
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const nodeRefs = useRef({}); // Store refs for each game card
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();

  // Redirect Admin users to admin dashboard
  useEffect(() => {
    if (currentUser && isAdmin()) {
      navigate('/admin/dashboard');
    }
  }, [currentUser, isAdmin, navigate]);

  useEffect(() => {
    // Get distinct genres and platforms for filters
    const fetchFilters = async () => {
      try {
        const genresResponse = await api.get('/games/genres');
        const platformsResponse = await api.get('/games/platforms');
        setGenres(genresResponse.data);
        setPlatforms(platformsResponse.data);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);

      // Build query parameters for sorting and filtering
      let endpoint = '/games';
      const params = new URLSearchParams();

      if (sortBy && sortBy !== 'popularity') {
        params.append('sort', sortBy);
      }

      if (filterBy && filterBy !== 'all') {
        if (genres.includes(filterBy)) {
          params.append('genre', filterBy);
        } else if (platforms.includes(filterBy)) {
          params.append('platform', filterBy);
        }
      }

      const queryString = params.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }

      try {
        const res = await api.get(endpoint);
        setGames(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [sortBy, filterBy, genres, platforms]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 text-white mb-12 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Your Next Gaming Adventure
          </h1>
          <p className="text-lg mb-8 text-gray-300">
            Find the latest and greatest games at competitive prices. From action to strategy, we've got you covered.
          </p>
          <button className="btn-primary text-lg px-8 py-3">Browse All Games</button>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">All Games</h2>
          <div className="flex gap-4 items-center mt-2 sm:mt-0">
            {/* Filter dropdown */}
            <select 
              className="form-input py-1 text-sm" 
              value={filterBy}
              onChange={handleFilterChange}
            >
              <option value="all">All Games</option>
              <optgroup label="Genres">
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </optgroup>
              <optgroup label="Platforms">
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </optgroup>
            </select>
            
            {/* Sort dropdown */}
            <select 
              className="form-input py-1 text-sm"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="popularity">Sort by: Popularity</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="release_date_desc">Newest First</option>
              <option value="title_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          )}
          <TransitionGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game) => {
              if (!nodeRefs.current[game.game_id]) {
                nodeRefs.current[game.game_id] = React.createRef();
              }
              return (
                <CSSTransition
                  key={game.game_id}
                  nodeRef={nodeRefs.current[game.game_id]}
                  timeout={300}
                  classNames="fade"
                >
                  <div ref={nodeRefs.current[game.game_id]}>
                    <GameCard game={game} />
                  </div>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        </div>
      </section>
    </div>
  );
}
