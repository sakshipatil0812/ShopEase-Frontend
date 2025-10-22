import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaTag, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    cart,
    loading,
    updateQuantity,
    removeFromCart,
    getCartSubtotal,
    getDiscount,
    getCartTotal,
    getAppliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.productId.stock) {
      alert(`Only ${item.productId.stock} items in stock`);
      return;
    }
    updateQuantity(item._id, newQuantity);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    await applyCoupon(couponCode.toUpperCase());
    setApplyingCoupon(false);
    setCouponCode('');
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
  };

  const subtotal = getCartSubtotal();
  const discount = getDiscount();
  const total = getCartTotal();
  const appliedCoupon = getAppliedCoupon();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 animate-float">
            <FaShoppingCart className="text-6xl text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
          >
            🛍️ Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.productId.imageURL}
                        alt={item.productId.name}
                        className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-md"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                        {item.productId.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.productId.description}
                      </p>
                      
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        {/* Price */}
                        <div>
                          <p className="text-3xl font-bold text-purple-700">
                            ₹{(item.productId.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                          <p className="text-sm text-gray-500">
                            ₹{item.productId.price.toLocaleString('en-IN')} each
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-xl flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="text-xl font-bold text-gray-800 min-w-[3ch] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            disabled={item.quantity >= item.productId.stock}
                            className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-xl flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="ml-2 w-10 h-10 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300 flex items-center justify-center"
                            title="Remove item"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      {/* Stock Info */}
                      {item.productId.stock < 10 && (
                        <p className="text-orange-600 text-sm font-semibold mt-2">
                          Only {item.productId.stock} left in stock!
                        </p>
                      )}

                      {/* Buy Now Single Item Button */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => navigate('/checkout', { 
                            state: { 
                              singleItem: {
                                ...item,
                                _id: item._id,
                                productId: item.productId,
                                quantity: item.quantity
                              }
                            } 
                          })}
                          className="w-full py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-md transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <FaShoppingCart className="text-lg" />
                          Buy This Item Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaShoppingCart className="mr-2 text-purple-600" />
                Order Summary
              </h2>

              {/* Coupon Section */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Have a Coupon Code?
                </label>
                {appliedCoupon ? (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-600 text-2xl" />
                      <div>
                        <p className="font-bold text-green-800">{appliedCoupon.code}</p>
                        <p className="text-sm text-green-600">
                          {appliedCoupon.discountType === 'percentage' 
                            ? `${appliedCoupon.discountValue}% off` 
                            : `₹${appliedCoupon.discountValue} off`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Remove coupon"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent uppercase"
                      disabled={applyingCoupon}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || applyingCoupon}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold flex items-center gap-2"
                    >
                      <FaTag />
                      {applyingCoupon ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                )}
                
                {/* Sample Coupons */}
                <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs font-semibold text-blue-800 mb-2">💡 Try these codes:</p>
                  <div className="flex flex-wrap gap-2">
                    {['WELCOME10', 'SAVE500', 'FLASH20'].map((code) => (
                      <button
                        key={code}
                        onClick={() => setCouponCode(code)}
                        className="text-xs px-3 py-1 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-blue-700 font-mono font-bold"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span className="flex items-center gap-2">
                      <FaTag />
                      Discount
                    </span>
                    <span>−₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total</span>
                    <span className="text-3xl font-extrabold text-purple-700">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {discount > 0 && (
                  <div className="bg-green-100 border border-green-200 rounded-xl p-3">
                    <p className="text-sm text-green-800 font-semibold text-center">
                      🎉 You saved ₹{discount.toLocaleString('en-IN')}!
                    </p>
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `🛍️ Checkout All Items (${cart.items.length})`}
              </button>

              {/* Info Text */}
              <p className="text-center text-xs text-gray-500 mt-2">
                💡 Tip: Use "Buy This Item Now" button to purchase individual items
              </p>

              <button
                onClick={() => navigate('/')}
                className="w-full mt-3 border-2 border-purple-600 text-purple-700 py-3 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
