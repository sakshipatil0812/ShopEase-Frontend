import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaTruck, FaHome, FaCreditCard, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Get order details from navigation state
    if (location.state?.orderDetails) {
      setOrderDetails(location.state.orderDetails);
      
      // Show celebratory message
      toast.success('🎊 Woohoo! Your order is confirmed!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
      });
      
      // Hide confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000);
    } else if (location.state?.orderId) {
      // If only orderId is passed, we could fetch full details from API
      // For now, we'll show minimal info
      setOrderDetails({ _id: location.state.orderId });
    } else {
      // No order data, redirect to home
      setTimeout(() => navigate('/'), 3000);
    }
  }, [location, navigate]);

  // Calculate estimated delivery date
  const getEstimatedDelivery = () => {
    const deliveryDays = orderDetails?.deliveryMethod?.includes('Express') ? 3 : 
                         orderDetails?.deliveryMethod?.includes('Overnight') ? 1 : 7;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
    return estimatedDate.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'][Math.floor(Math.random() * 6)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-2xl mb-6 animate-bounce">
            <FaCheckCircle className="text-white text-5xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-3 animate-pulse">
            🎉 Order Placed Successfully! 🎉
          </h1>
          <p className="text-xl text-gray-700 mb-2 font-semibold">
            Thank you for shopping with us! 
          </p>
          <p className="text-gray-600">
            Your order has been confirmed and will be delivered soon. 📦✨
          </p>
          <div className="mt-4 inline-block bg-green-100 border-2 border-green-300 rounded-full px-6 py-2 animate-bounce">
            <p className="text-green-800 font-bold">✓ Payment Successful</p>
          </div>
        </div>

        {/* Order ID Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="text-2xl font-bold text-purple-700">
                #{orderDetails._id?.slice(-8).toUpperCase() || 'XXXXXXXX'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date().toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Delivery Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <FaTruck className="text-white text-xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Delivery Info</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <FaCalendarAlt className="text-purple-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-semibold text-gray-800">{getEstimatedDelivery()}</p>
                </div>
              </div>
              {orderDetails.deliveryMethod && (
                <div className="flex items-start gap-2">
                  <FaBox className="text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Delivery Method</p>
                    <p className="font-semibold text-gray-800">{orderDetails.deliveryMethod}</p>
                  </div>
                </div>
              )}
              {orderDetails.shippingAddress && (
                <div className="flex items-start gap-2">
                  <FaHome className="text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Shipping Address</p>
                    <p className="font-semibold text-gray-800">
                      {orderDetails.shippingAddress.street}<br />
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}<br />
                      {orderDetails.shippingAddress.zipCode}, {orderDetails.shippingAddress.country}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <FaCreditCard className="text-white text-xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Payment Info</h2>
            </div>
            <div className="space-y-3">
              {orderDetails.paymentMethod && (
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-800">{orderDetails.paymentMethod}</p>
                </div>
              )}
              {orderDetails.totalPrice && (
                <>
                  {orderDetails.subtotal && (
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">₹{orderDetails.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {orderDetails.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">−₹{orderDetails.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {orderDetails.deliveryCharge !== undefined && (
                    <div className="flex justify-between text-gray-700">
                      <span>Delivery Charge</span>
                      <span className="font-semibold">
                        {orderDetails.deliveryCharge === 0 ? 'FREE' : `₹${orderDetails.deliveryCharge}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-extrabold text-purple-700">
                      ₹{orderDetails.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        {orderDetails.orderItems && orderDetails.orderItems.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Items</h2>
            <div className="space-y-3">
              {orderDetails.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <FaBox className="text-purple-600 text-2xl" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {item.product?.name || 'Product'}
                    </p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-purple-700">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">What's Next?</h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <p>We'll send you an email confirmation with your order details</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <p>Track your order status in the "Order History" section</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <p>We'll notify you when your order is out for delivery</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 font-bold shadow-lg text-center transform hover:scale-105"
          >
            View Order History
          </Link>
          <Link
            to="/"
            className="px-8 py-4 border-2 border-purple-600 text-purple-700 rounded-xl hover:bg-purple-50 transition-all duration-300 font-bold text-center"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Email Notification */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            A confirmation email has been sent to{' '}
            <span className="font-semibold text-purple-700">
              {orderDetails.user?.email || 'your email'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
