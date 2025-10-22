import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {  FaSearch, FaStar, FaFilter, FaTimes } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import api from '../api/api';
import { toast } from 'react-toastify';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All',
    search: '',
    sort: 'newest',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    brand: '',
  });
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 100000 },
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = [
    { name: 'All', emoji: '🌟' },
    { name: 'Electronics', emoji: '📱' },
    { name: 'Fashion', emoji: '👕' },
    { name: 'Home & Kitchen', emoji: '🏠' },
    { name: 'Sports', emoji: '⚽' },
    { name: 'Beauty', emoji: '💄' },
    { name: 'Books', emoji: '📚' },
    { name: 'Toys', emoji: '🧸' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...(filters.category !== 'All' && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
        ...(filters.sort && { sort: filters.sort }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.minRating && { minRating: filters.minRating }),
        ...(filters.brand && { brand: filters.brand }),
        page: pagination.page,
        limit: 12,
      });

      const response = await api.get(`/products?${queryParams}`);
      setProducts(response.data.products);
      setPagination({
        page: response.data.page,
        pages: response.data.pages,
        total: response.data.total,
      });
      
      if (response.data.filters) {
        setAvailableFilters(response.data.filters);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({
      category: 'All',
      search: '',
      sort: 'newest',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      brand: '',
    });
    setPagination({ ...pagination, page: 1 });
  };

  const loadMore = () => {
    if (pagination.page < pagination.pages) {
      setPagination({ ...pagination, page: pagination.page + 1 });
    }
  };

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">💰</span> Price Range
        </h3>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Range: ₹{availableFilters.priceRange.min.toLocaleString('en-IN')} - ₹{availableFilters.priceRange.max.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">⭐</span> Minimum Rating
        </h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleFilterChange('minRating', filters.minRating === rating.toString() ? '' : rating.toString())}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                filters.minRating === rating.toString()
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-purple-400'
              }`}
            >
              <div className="flex items-center">
                {[...Array(rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <span className="font-semibold">& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      {availableFilters.brands.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">🏷️</span> Brand
          </h3>
          <select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">All Brands</option>
            {availableFilters.brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-bold flex items-center justify-center space-x-2"
      >
        <FaTimes />
        <span>Clear All Filters</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in">
            Welcome to ShopEase! 🛒
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Discover amazing products at unbeatable prices
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-2xl p-2">
              <FaSearch className="text-gray-400 ml-4 text-xl" />
              <input
                type="text"
                placeholder="Search for products, brands, categories..."
                value={filters.search}
                onChange={handleSearchChange}
                className="flex-1 px-4 py-3 text-gray-800 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Pills */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleFilterChange('category', cat.name)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  filters.category === cat.name
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                <span className="mr-2">{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold flex items-center justify-center space-x-2"
            >
              <FaFilter />
              <span>Filters {showMobileFilters ? '(Hide)' : '(Show)'}</span>
            </button>
          </div>

          {/* Filters Sidebar */}
          <div
            className={`${
              showMobileFilters ? 'block' : 'hidden'
            } lg:block lg:w-64 flex-shrink-0`}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center">
                <FaFilter className="mr-2 text-purple-600" /> Filters
              </h2>
              <FilterSection />
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Sorting and Results Info */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <p className="text-gray-600 font-semibold">
                {pagination.total} Products Found
              </p>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 font-semibold"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-6xl mb-4">😢</p>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search term
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <div
                      key={product._id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Load More / Pagination */}
                {pagination.page < pagination.pages && (
                  <div className="text-center mt-12">
                    <button
                      onClick={loadMore}
                      className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-12 py-4 rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg transform hover:scale-105"
                    >
                      Load More Products ({pagination.page} of {pagination.pages})
                    </button>
                  </div>
                )}

                {/* Pagination Info */}
                <div className="text-center mt-6 text-gray-600">
                  Showing {products.length} of {pagination.total} products
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            🎉 Special Offers Just for You!
          </h2>
          <p className="text-xl mb-6">
            Sign up now and get exclusive discounts on your first order
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-lg transform hover:scale-105"
          >
            Get Started Now →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
