import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaBox } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [isAuthenticated, navigate]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data.user;
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        street: userData.address?.street || '',
        city: userData.address?.city || '',
        state: userData.address?.state || '',
        zipCode: userData.address?.zipCode || '',
        country: userData.address?.country || 'India',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/auth/profile', {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      });

      updateUser(response.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 mb-8 text-white text-center shadow-2xl">
          <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-purple-600 text-5xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">My Profile</h1>
          <p className="text-xl">{user?.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              
              <button
                onClick={() => navigate('/orders')}
                className="w-full flex items-center space-x-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-4 rounded-xl hover:from-purple-200 hover:to-pink-200 transition-all duration-300 font-semibold"
              >
                <FaBox className="text-2xl" />
                <span>Order History</span>
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center space-x-3 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-6 py-4 rounded-xl hover:from-blue-200 hover:to-cyan-200 transition-all duration-300 font-semibold"
              >
                <span>🛍️</span>
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600 flex items-center">
                    <FaUser className="mr-2" /> Personal Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl">
                      <FaEnvelope className="text-gray-400 mr-3" />
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="flex-1 bg-transparent focus:outline-none text-gray-600"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex items-center px-4 py-3 border-2 border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-purple-600">
                      <FaPhone className="text-gray-400 mr-3" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        className="flex-1 focus:outline-none"
                        placeholder="10-digit phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600 flex items-center">
                    <FaMapMarkerAlt className="mr-2" /> Address Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="House no., Street name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        pattern="[0-9]{6}"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="6-digit PIN code"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <FaSave />
                  <span>{loading ? 'Updating...' : 'Save Changes'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
