import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { adminAPI } from '../api/api';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 20
      };
      if (statusFilter) {
        params.status = statusFilter;
      }
      const response = await adminAPI.getAllOrders(params);
      setOrders(response.data.orders);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await adminAPI.updateOrderStatus(orderId, { orderStatus: newStatus });
      toast.success(newStatus === 'cancelled' ? 'Order cancelled and stock restored' : 'Order status updated successfully');
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await adminAPI.deleteOrder(orderToDelete._id);
      toast.success('Order deleted and stock restored successfully');
      setShowDeleteModal(false);
      setOrderToDelete(null);
      fetchOrders();
    } catch (error) {
      console.error('Failed to delete order:', error);
      toast.error('Failed to delete order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-2">
            Orders Management
          </h1>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-semibold"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-purple-700">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{order.user?.name || 'Guest'}</p>
                      <p className="text-sm text-gray-500">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {order.orderItems?.length || 0} items
                    </td>
                    <td className="px-6 py-4 font-bold text-purple-700">
                      ₹{order.totalPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        disabled={updatingStatus}
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)} cursor-pointer border-2 border-transparent hover:border-purple-400 transition-all`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => {
                            setOrderToDelete(order);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete Order"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && !loading && (
            <div className="text-center py-12">
              <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No orders found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full my-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Details</h2>
              
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-bold text-purple-700">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.user?.name}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 font-semibold mb-2">Shipping Address</p>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-800">
                    {selectedOrder.shippingAddress.street}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                    {selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 font-semibold mb-2">Order Items</p>
                <div className="space-y-2">
                  {selectedOrder.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <img
                        src={item.product?.imageURL || 'https://via.placeholder.com/80'}
                        alt={item.product?.name || 'Product'}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.product?.name || 'Product'}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                      <p className="font-bold text-purple-700">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t-2 border-gray-200 pt-4 mb-6">
                {selectedOrder.subtotal && (
                  <div className="flex justify-between text-gray-700 mb-2">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600 mb-2">
                    <span>Discount</span>
                    <span className="font-semibold">−₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedOrder.deliveryCharge !== undefined && (
                  <div className="flex justify-between text-gray-700 mb-2">
                    <span>Delivery Charge</span>
                    <span className="font-semibold">
                      {selectedOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharge}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-extrabold text-purple-700">
                    ₹{selectedOrder.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowOrderModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-colors font-bold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && orderToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Delete Order</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete order <strong>#{orderToDelete._id.slice(-8).toUpperCase()}</strong>?
                <br /><br />
                <span className="text-green-600 font-semibold">
                  ✓ Stock will be automatically restored to products
                </span>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setOrderToDelete(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteOrder}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-colors font-bold"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
