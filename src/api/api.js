import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL||"https://shopease-backend-icp7.onrender.com/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateItem: (itemId, data) => api.put(`/cart/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
  applyCoupon: (data) => api.post('/cart/coupon', data),
  removeCoupon: () => api.delete('/cart/coupon'),
};

// Orders API
export const ordersAPI = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

// Reviews API
export const reviewsAPI = {
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  createReview: (data) => api.post('/reviews', data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

// Admin API
export const adminAPI = {
  // Dashboard
  getStats: () => api.get('/admin/stats'),
  
  // Products
  getAllProducts: (params) => api.get('/admin/products', { params }),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  bulkUpdateStock: (data) => api.post('/admin/products/bulk-update-stock', data),
  
  // Orders
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),
  
  // Users
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  
  // Categories
  getCategories: () => api.get('/admin/categories'),
};

export default api;
