import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaImage } from 'react-icons/fa';
import { adminAPI } from '../api/api';
import { toast } from 'react-toastify';

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
    brand: '',
    imageURL: '',
    tags: ''
  });

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Books',
    'Sports',
    'Beauty',
    'Toys',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (formData.stock && formData.stock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        brand: formData.brand.trim() || undefined,
        imageURL: formData.imageURL.trim() || 'https://via.placeholder.com/400?text=No+Image',
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      };

      await adminAPI.createProduct(productData);
      
      toast.success('Product created successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4"
          >
            <FaArrowLeft />
            Back to Products
          </Link>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600">Create a new product in your catalog</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stock and Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
                <p className="text-sm text-gray-500 mt-1">Leave blank for 0</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Image URL
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="url"
                    name="imageURL"
                    value={formData.imageURL}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Provide a direct URL to the product image
                  </p>
                </div>
              </div>
              
              {/* Image Preview */}
              {formData.imageURL && (
                <div className="mt-4 border-2 border-dashed border-gray-300 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaImage /> Image Preview:
                  </p>
                  <img
                    src={formData.imageURL}
                    alt="Preview"
                    className="w-48 h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400?text=Invalid+Image';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="trending, sale, new arrival (comma separated)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate tags with commas (e.g., trending, sale, new)
              </p>
            </div>

            {/* Stock Indicator Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-2">📊 Stock Status Indicators:</h3>
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold">Out of Stock</span>
                  <span className="text-gray-600">= 0 units</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">Low Stock</span>
                  <span className="text-gray-600">= Less than 10 units</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">In Stock</span>
                  <span className="text-gray-600">= 10 or more units</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-bold"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Create Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCreate;
