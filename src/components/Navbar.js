import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaChevronDown, FaLaptop, FaTshirt, FaHome, FaBook, FaMobileAlt, FaGamepad, FaHeartbeat, FaBaby } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  // Product Categories
  const categories = [
    { name: 'Electronics', icon: FaLaptop, path: '/home?category=Electronics' },
    { name: 'Fashion', icon: FaTshirt, path: '/home?category=Fashion' },
    { name: 'Home & Kitchen', icon: FaHome, path: '/home?category=Home & Kitchen' },
    { name: 'Books', icon: FaBook, path: '/home?category=Books' },
    { name: 'Mobile & Accessories', icon: FaMobileAlt, path: '/home?category=Mobile & Accessories' },
    { name: 'Sports & Toys', icon: FaGamepad, path: '/home?category=Sports & Toys' },
    { name: 'Health & Beauty', icon: FaHeartbeat, path: '/home?category=Health & Beauty' },
    { name: 'Baby Products', icon: FaBaby, path: '/home?category=Baby Products' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-2xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2 transform hover:scale-105 transition-transform duration-300">
            <FaShoppingCart className="text-white text-3xl animate-float" />
            <span className="text-2xl font-bold text-white drop-shadow-lg">ShopEase</span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Search Icon for tablets */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="lg:hidden text-white hover:text-yellow-300 transition-all duration-300 transform hover:scale-110"
            >
              <FaSearch className="text-2xl" />
            </button>

            <Link to="/home" className="text-white hover:text-yellow-300 transition-all duration-300 font-semibold text-lg relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Products Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowProductsMenu(true)}
              onMouseLeave={() => setShowProductsMenu(false)}
            >
              <button className="text-white hover:text-yellow-300 transition-all duration-300 font-semibold text-lg relative group flex items-center space-x-1">
                <span>Products</span>
                <FaChevronDown className={`text-sm transition-transform duration-300 ${showProductsMenu ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
              </button>
              
              {/* Dropdown Menu */}
              {showProductsMenu && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 transform animate-slide-down z-50">
                  <div className="px-4 py-2 text-xs font-bold text-purple-600 uppercase tracking-wider border-b border-gray-200">
                    Shop by Category
                  </div>
                  {categories.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <Link
                        key={index}
                        to={category.path}
                        onClick={() => setShowProductsMenu(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 font-medium transition-all duration-300 group"
                      >
                        <IconComponent className="text-purple-500 group-hover:text-pink-500 transition-colors duration-300" />
                        <span>{category.name}</span>
                      </Link>
                    );
                  })}
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <Link
                      to="/home"
                      onClick={() => setShowProductsMenu(false)}
                      className="block px-4 py-2 text-sm text-center text-purple-600 hover:bg-purple-50 font-bold transition-all duration-300"
                    >
                      View All Products →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className="relative transform hover:scale-110 transition-transform duration-300">
              <FaShoppingCart className="text-3xl text-white hover:text-yellow-300 transition-colors duration-300" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="bg-white text-purple-600 rounded-full p-2 shadow-lg">
                    <FaUser className="text-xl" />
                  </div>
                  <span className="font-semibold hidden lg:block">{user?.name}</span>
                  <FaChevronDown className={`text-sm transition-transform duration-300 hidden lg:block ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 transform animate-slide-down z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    {user?.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-purple-700 bg-purple-50 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 font-bold transition-all duration-300 border-b border-purple-200"
                      >
                        <span>⚡</span>
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 font-medium transition-all duration-300"
                    >
                      <span>👤</span>
                      <span>View Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 font-medium transition-all duration-300"
                    >
                      <span>📦</span>
                      <span>Orders</span>
                    </Link>
                    <div className="border-t border-gray-200 mt-1"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-all duration-300"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-yellow-300 transition-all duration-300 font-semibold text-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-purple-600 px-6 py-2 rounded-full hover:bg-yellow-300 hover:text-purple-700 transition-all duration-300 font-bold shadow-lg transform hover:scale-105 hover:shadow-2xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-2xl hover:text-yellow-300 transition-colors"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Tablet Search Bar (shows when search icon clicked) */}
        {showSearch && (
          <div className="lg:hidden py-3 border-t border-purple-400 border-opacity-30">
            <SearchBar />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-xl">
          {/* Mobile Search Bar */}
          <div className="px-4 py-3 border-b border-gray-200">
            <SearchBar />
          </div>
          
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/home"
              className="block text-gray-700 hover:text-purple-600 transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              🏠 Home
            </Link>
            
            {/* Mobile Products with Categories */}
            <div className="border-t border-b border-gray-200 py-3 -mx-4 px-4">
              <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">
                Shop by Category
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <Link
                      key={index}
                      to={category.path}
                      className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-lg transition font-medium text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <IconComponent className="text-purple-500" />
                      <span>{category.name}</span>
                    </Link>
                  );
                })}
              </div>
              <Link
                to="/home"
                className="block text-center text-purple-600 font-bold mt-3 text-sm hover:text-purple-700"
                onClick={() => setIsOpen(false)}
              >
                View All Products →
              </Link>
            </div>

            <Link
              to="/cart"
              className="flex items-center justify-between text-gray-700 hover:text-purple-600 transition font-medium bg-gray-50 px-4 py-3 rounded-lg -mx-4"
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center space-x-2">
                <FaShoppingCart />
                <span>Cart</span>
              </span>
              {getCartCount() > 0 && (
                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {getCartCount()}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <>
                <div className="text-gray-700 font-bold border-t pt-3 flex items-center space-x-2">
                  <div className="bg-purple-100 text-purple-600 rounded-full p-2">
                    <FaUser className="text-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 text-purple-700 bg-purple-50 px-3 py-2 rounded-lg hover:bg-purple-100 transition font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>⚡</span>
                    <span>Admin Panel</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-lg transition"
                  onClick={() => setIsOpen(false)}
                >
                  <span>👤</span>
                  <span>View Profile</span>
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-lg transition"
                  onClick={() => setIsOpen(false)}
                >
                  <span>📦</span>
                  <span>Orders</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition font-medium border-t border-gray-200 mt-2 pt-3"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-purple-600 transition font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  🔐 Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-lg text-center hover:from-purple-700 hover:to-pink-700 transition font-bold shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  ✨ Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
