import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar, FaInfoCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(product, 1);
      toast.success(
        <div className="flex items-center gap-2">
          <span>✅</span>
          <div>
            <div className="font-semibold">{product.name}</div>
            <div className="text-sm">Added to Cart!</div>
          </div>
        </div>,
        {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setTimeout(() => setIsAddingToCart(false), 500);
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    return stars;
  };

  // Get stock status info
  const getStockInfo = () => {
    if (product.stock === 0) {
      return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-50', available: false };
    } else if (product.stock < 10) {
      return { text: `Only ${product.stock} left!`, color: 'text-orange-600', bgColor: 'bg-orange-50', available: true };
    } else if (product.stock < 50) {
      return { text: `${product.stock} available`, color: 'text-green-600', bgColor: 'bg-green-50', available: true };
    } else {
      return { text: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-50', available: true };
    }
  };

  const stockInfo = getStockInfo();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] group">
      <Link to={`/products/${product._id}`}>
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <img
            src={product.imageURL}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Stock Badge */}
          {product.stock === 0 ? (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
              ❌ Out of Stock
            </span>
          ) : product.stock < 10 ? (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg">
              🔥 Only {product.stock} left
            </span>
          ) : (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg">
              ✅ In Stock
            </span>
          )}

          {/* Brand Badge (if available) */}
          {product.brand && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-3 py-1.5 rounded-full font-semibold shadow-md">
              {product.brand}
            </span>
          )}

          {/* Quick View Text on Hover */}
          <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
              Click to view details
            </span>
          </div>
        </div>
      </Link>

      <div className="p-5">
        {/* Product Name with Tooltip */}
        <div className="relative mb-3">
          <Link to={`/products/${product._id}`}>
            <div className="flex items-start gap-2">
              <h3 className="text-lg font-bold text-gray-800 hover:text-purple-600 transition-colors duration-300 line-clamp-2 flex-1">
                {product.name}
              </h3>
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-purple-600 transition-colors mt-1"
              >
                <FaInfoCircle className="text-sm" />
              </button>
            </div>
          </Link>
          
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute z-10 left-0 right-0 top-full mt-2 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl animate-fade-in">
              <div className="font-semibold mb-1">Product Details:</div>
              <p className="leading-relaxed">{product.description}</p>
              <div className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-900"></div>
            </div>
          )}
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {renderStars(product.averageRating || 0)}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
          </span>
          <span className="text-xs text-gray-400">
            ({product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'})
          </span>
        </div>
        
        {/* Short Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Category and Stock Info */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <span className="text-xs text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1.5 rounded-full font-semibold shadow-sm">
            📦 {product.category}
          </span>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${stockInfo.bgColor} ${stockInfo.color}`}>
            {stockInfo.text}
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <div className="text-xs text-gray-500 mb-1">Price</div>
            <div className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 transform font-semibold text-sm ${
              product.stock === 0
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : isAddingToCart
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-95'
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:scale-105'
            }`}
          >
            <FaShoppingCart className={`text-base ${isAddingToCart ? 'animate-bounce' : ''}`} />
            <span>{isAddingToCart ? 'Adding...' : product.stock === 0 ? 'Unavailable' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-400 transition-colors duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ProductCard;
