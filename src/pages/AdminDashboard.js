import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaRupeeSign, 
  FaClock,
  FaExclamationTriangle,
  FaChartLine,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { adminAPI } from '../api/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <FaBox className="text-3xl" />,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <FaShoppingCart className="text-3xl" />,
      color: 'from-green-500 to-green-600',
      link: '/admin/orders',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <FaUsers className="text-3xl" />,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/users',
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: <FaRupeeSign className="text-3xl" />,
      color: 'from-pink-500 to-pink-600',
      link: '/admin/orders',
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: <FaClock className="text-3xl" />,
      color: 'from-yellow-500 to-yellow-600',
      link: '/admin/orders?status=pending',
      badge: stats?.pendingOrders > 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Welcome back! Here's your store overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {statCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center text-white`}>
                  {card.icon}
                </div>
                {card.badge && (
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </div>
              <h3 className="text-gray-600 text-sm font-semibold mb-2">{card.title}</h3>
              <p className="text-2xl font-extrabold text-gray-800">{card.value}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaShoppingCart className="text-purple-600" />
                Recent Orders
              </h2>
              <Link
                to="/admin/orders"
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                View All →
              </Link>
            </div>

            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {order.user?.name || 'Guest'}
                      </p>
                      <p className="text-sm text-gray-600">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-700">
                        ₹{order.totalPrice.toLocaleString('en-IN')}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-700' :
                        order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-700' :
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent orders</p>
            )}
          </div>

          {/* Low Stock Products */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaExclamationTriangle className="text-yellow-600" />
                Low Stock Alert
              </h2>
              <Link
                to="/admin/products"
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                Manage →
              </Link>
            </div>

            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {stats.lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        Stock: {product.stock} units
                      </p>
                    </div>
                    <FaExclamationTriangle className="text-yellow-600 text-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">All products have sufficient stock</p>
            )}
          </div>
        </div>

        {/* Revenue Chart (Simple visualization) */}
        {stats?.revenueByMonth && stats.revenueByMonth.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <FaChartLine className="text-purple-600" />
              Revenue Trend (Last 6 Months)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.revenueByMonth.map((month, index) => {
                const monthName = new Date(month._id.year, month._id.month - 1).toLocaleDateString('en-IN', { month: 'short' });
                const prevRevenue = index > 0 ? stats.revenueByMonth[index - 1].revenue : month.revenue;
                const change = ((month.revenue - prevRevenue) / prevRevenue * 100).toFixed(1);
                const isPositive = change >= 0;

                return (
                  <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 font-semibold mb-1">{monthName}</p>
                    <p className="text-xl font-bold text-purple-700 mb-2">
                      ₹{(month.revenue / 1000).toFixed(1)}K
                    </p>
                    <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? <FaArrowUp /> : <FaArrowDown />}
                      {Math.abs(change)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/products/new"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              <FaBox className="text-2xl" />
              <span className="font-bold">Add New Product</span>
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              <FaShoppingCart className="text-2xl" />
              <span className="font-bold">View All Orders</span>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              <FaUsers className="text-2xl" />
              <span className="font-bold">Manage Users</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
