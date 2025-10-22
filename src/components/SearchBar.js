import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import api from '../api/api';

const SearchBar = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debouncing
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/search/suggestions?q=${encodeURIComponent(query)}`);
        setSuggestions(response.data.suggestions || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search suggestions error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/home?search=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      setQuery('');
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product._id}`);
    setShowSuggestions(false);
    setQuery('');
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="font-semibold text-purple-600">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
          placeholder="Search products, brands, categories..."
          className="w-full px-4 py-2.5 pl-12 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
        
        {/* Search Icon */}
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        
        {/* Clear Button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
          <div className="p-2">
            <p className="text-xs text-gray-500 px-3 py-2 font-medium uppercase tracking-wide">
              Suggestions ({suggestions.length})
            </p>
            
            {suggestions.map((product, index) => (
              <div
                key={product._id}
                onClick={() => handleSuggestionClick(product)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150 ${
                  index === selectedIndex
                    ? 'bg-purple-50 border border-purple-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Product Image */}
                <img
                  src={product.image || 'https://via.placeholder.com/60'}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-md border border-gray-200"
                />
                
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {highlightMatch(product.name, query)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                    {product.brand && (
                      <span className="text-xs text-gray-500">
                        {highlightMatch(product.brand, query)}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Price & Rating */}
                <div className="text-right">
                  <p className="text-sm font-bold text-purple-600">
                    ₹{product.price?.toLocaleString()}
                  </p>
                  {product.averageRating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-yellow-500">★</span>
                      <span className="text-xs text-gray-600">
                        {product.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* View All Results */}
          <div className="border-t border-gray-200 p-2">
            <button
              onClick={handleSearch}
              className="w-full py-2.5 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              View all results for "{query}"
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {showSuggestions && !loading && query.trim().length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-6 text-center">
          <div className="text-gray-400 text-4xl mb-2">🔍</div>
          <p className="text-gray-600 font-medium">No products found</p>
          <p className="text-sm text-gray-500 mt-1">Try searching with different keywords</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
