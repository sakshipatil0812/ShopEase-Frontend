import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserShield, FaLock, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in and is admin
  React.useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        toast.error('Access Denied: Admin privileges required');
        localStorage.removeItem('token');
        window.location.reload();
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const result = await login(formData.email, formData.password);
      
      if (result.success && result.user) {
        // Check if user is admin
        if (result.user.isAdmin) {
          toast.success('Welcome Admin!');
          // Use setTimeout to ensure state updates before navigation
          setTimeout(() => {
            navigate('/admin/dashboard', { replace: true });
          }, 100);
        } else {
          toast.error('Access Denied: Admin privileges required');
          localStorage.removeItem('token');
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Admin login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-yellow-300 transition-colors font-semibold"
      >
        <FaArrowLeft />
        Back to Home
      </Link>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Admin Badge */}
        <div className="text-center">
          <div className="mx-auto h-24 w-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <FaUserShield className="text-5xl text-white" />
          </div>
          <h2 className="mt-6 text-4xl font-extrabold text-white">
            Admin Portal
          </h2>
          <p className="mt-2 text-lg text-purple-200">
            Secure Administrative Access
          </p>
          <div className="mt-4 bg-yellow-400 bg-opacity-20 border-2 border-yellow-400 rounded-xl p-3">
            <p className="text-sm text-yellow-200 font-semibold">
              🔒 For Authorized Personnel Only
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-purple-300" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-12 pr-4 py-3 border-2 border-purple-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-white mb-2">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-purple-300" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-12 pr-4 py-3 border-2 border-purple-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Verifying...
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    <FaUserShield />
                    Access Admin Panel
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Customer Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-purple-200">
              Not an admin?{' '}
              <Link
                to="/login"
                className="font-semibold text-yellow-300 hover:text-yellow-400 transition-colors"
              >
                Customer Login
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-purple-300">
            🔐 All admin activities are logged and monitored
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
