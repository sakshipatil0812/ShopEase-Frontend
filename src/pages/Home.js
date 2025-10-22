import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaUserShield } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import { productsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filterOptions, setFilterOptions] = useState({ categories: [], brands: [] });
  const { user } = useAuth();
  
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    minPrice: '',
    maxPrice: '',
    minRating: '',
  });
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('newest');

  // Handle category from URL params
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setFilters(prev => ({
        ...prev,
        categories: [categoryFromUrl]
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters, sort, searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        sort,
        search: searchParams.get('search') || search,
      };

      // Add category filter
      if (filters.categories.length > 0) {
        params.category = filters.categories.join(',');
      }

      // Add brand filter
      if (filters.brands.length > 0) {
        params.brand = filters.brands.join(',');
      }

      // Add price filter
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      // Add rating filter
      if (filters.minRating) params.minRating = filters.minRating;

      const response = await productsAPI.getAll(params);
      setProducts(response.data.products);
      setTotalProducts(response.data.total || response.data.count);
      
      // Set filter options
      if (response.data.filters) {
        setFilterOptions({
          categories: response.data.filters.categories || [],
          brands: response.data.filters.brands || [],
        });
      }
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
  };

  const hasActiveFilters = () => {
    return (
      filters.categories.length > 0 ||
      filters.brands.length > 0 ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.minRating
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        {/* Admin Login Button - Top Right */}
        {!user?.isAdmin && (
          <Link
            to="/admin-login"
            className="absolute top-4 right-4 md:top-6 md:right-8 bg-white text-purple-700 px-6 py-3 rounded-xl font-bold shadow-2xl hover:bg-yellow-300 hover:text-purple-900 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2 z-20"
          >
            <FaUserShield className="text-xl" />
            <span className="hidden sm:inline">Admin Login</span>
            <span className="sm:hidden">Admin</span>
          </Link>
        )}

        {/* Admin Dashboard Button - If logged in as admin */}
        {user?.isAdmin && (
          <Link
            to="/admin/dashboard"
            className="absolute top-4 right-4 md:top-6 md:right-8 bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-2xl hover:from-green-500 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2 z-20 animate-pulse"
          >
            <FaUserShield className="text-xl" />
            <span className="hidden sm:inline">Admin Dashboard</span>
            <span className="sm:hidden">Dashboard</span>
          </Link>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 animate-fade-in drop-shadow-2xl">
            🛍️ Welcome to ShopEase
          </h1>
          <p className="text-lg md:text-xl mb-6 animate-slide-up font-medium">
            ✨ Discover Amazing Products at Unbeatable Prices ✨
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              onFilterChange={handleFilterChange}
              currentFilters={filters}
              filterOptions={filterOptions}
            />
          </div>

          {/* Products Section */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              {/* Results Count */}
              <div className="flex items-center gap-3">
                <div className="text-gray-700">
                  <span className="font-bold text-xl text-purple-600">{totalProducts}</span>
                  <span className="text-gray-600 ml-1">
                    {totalProducts === 1 ? 'Product' : 'Products'}
                  </span>
                </div>
                {hasActiveFilters() && (
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                    Filtered
                  </span>
                )}
              </div>

              {/* Sort Dropdown */}
              <SortDropdown currentSort={sort} onSortChange={handleSortChange} />
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex flex-col justify-center items-center h-96 bg-white rounded-2xl shadow-lg">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
                <p className="text-purple-600 font-semibold text-lg animate-pulse">
                  Loading amazing products...
                </p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <div
                      key={product._id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Promotional Banner */}
                <div className="mt-12 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 text-white text-center shadow-2xl">
                  <h2 className="text-3xl font-bold mb-2">🎉 Special Offer!</h2>
                  <p className="text-xl mb-4">Get up to 50% off on selected items</p>
                  <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 hover:text-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Shop Now
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <div className="text-6xl mb-4">�</div>
                <p className="text-gray-800 text-2xl font-bold mb-2">No products found</p>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                {hasActiveFilters() && (
                  <button
                    onClick={() =>
                      setFilters({
                        categories: [],
                        brands: [],
                        minPrice: '',
                        maxPrice: '',
                        minRating: '',
                      })
                    }
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
