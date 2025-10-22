import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaShoppingBag, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { toast } from 'react-toastify';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/auth/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'Shipped':
        return <FaTruck className="text-blue-500" />;
      case 'Cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaBox className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 mb-8 text-white text-center shadow-2xl">
            <FaShoppingBag className="text-6xl mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Order History</h1>
            <p className="text-xl">Track all your orders</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaBox className="text-gray-300 text-8xl mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">Start shopping and your orders will appear here!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 font-bold shadow-lg transform hover:scale-105"
            >
              🛍️ Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 mb-8 text-white text-center shadow-2xl">
          <FaShoppingBag className="text-6xl mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Order History</h1>
          <p className="text-xl">{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b-2 border-purple-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">Order ID:</span>
                    <span className="font-mono font-bold text-purple-700">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      📅 {formatDate(order.createdAt)}
                    </span>
                    <span
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 font-semibold text-sm ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusIcon(order.orderStatus)}
                      <span>{order.orderStatus}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300"
                    >
                      <img
                        src={item.product?.imageURL || '/placeholder.png'}
                        alt={item.product?.name || 'Product'}
                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg">
                          {item.product?.name || 'Product Unavailable'}
                        </h3>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-700">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-gray-500">per item</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="mr-2">📍</span> Shipping Address
                  </h4>
                  <p className="text-gray-700">
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                  </p>
                  <p className="text-gray-700">
                    {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-700">{order.shippingAddress.country}</p>
                </div>

                {/* Order Summary */}
                <div className="mt-6 flex items-center justify-between p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                  <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                  <span className="text-3xl font-extrabold text-purple-700">
                    ₹{order.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Payment Info */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span>Payment Method: {order.paymentMethod}</span>
                  <span>
                    {order.isPaid ? (
                      <span className="text-green-600 font-semibold flex items-center">
                        <FaCheckCircle className="mr-1" /> Paid
                      </span>
                    ) : (
                      <span className="text-orange-600 font-semibold">Payment Pending</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Shopping */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 font-bold shadow-lg transform hover:scale-105"
          >
            🛍️ Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
