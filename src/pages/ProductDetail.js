import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { productsAPI } from '../api/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Fetch product error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600 mb-4">Product not found</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-white bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 mb-6 shadow-lg transform hover:scale-105"
        >
          <FaArrowLeft />
          <span className="font-semibold">Back to Products</span>
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-12">
            {/* Product Image */}
            <div className="fade-in">
              <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                <img
                  src={product.imageURL}
                  alt={product.name}
                  className="w-full h-96 lg:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Product Info */}
            <div className="fade-in space-y-6">
              <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-bold px-4 py-2 rounded-full shadow-sm">
                📦 {product.category}
              </span>
              
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                <span className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className={`text-sm font-bold px-4 py-2 rounded-full shadow-md ${
                  product.stock > 10
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : product.stock > 0
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white'
                    : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                }`}>
                  {product.stock > 10 ? '✨ In Stock' : product.stock > 0 ? `🔥 Only ${product.stock} left!` : '❌ Out of Stock'}
                </span>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-inner">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">📝</span> Product Description
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-md border-2 border-purple-100">
                  <label className="block text-lg font-bold text-gray-800 mb-4">
                    Select Quantity
                  </label>
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold text-xl shadow-lg transform hover:scale-110"
                    >
                      -
                    </button>
                    <span className="text-3xl font-extrabold text-purple-600 min-w-[60px] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold text-xl shadow-lg transform hover:scale-110"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full flex items-center justify-center space-x-3 py-5 rounded-xl transition-all duration-300 btn-hover text-lg font-bold shadow-xl ${
                  product.stock === 0
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transform hover:scale-105'
                }`}
              >
                <FaShoppingCart className="text-2xl" />
                <span>
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
