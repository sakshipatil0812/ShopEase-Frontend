import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaShoppingCart, FaGift, FaTruck, FaStar, FaHeart, FaTag, FaCrown, FaBolt } from 'react-icons/fa';
import Logo from '../components/Logo';

const Welcome = () => {
  const navigate = useNavigate();
  const [animationStep, setAnimationStep] = useState(0);
  const [floatingIcons, setFloatingIcons] = useState([]);

  useEffect(() => {
    // Generate random floating icons
    const icons = [
      { Icon: FaShoppingBag, color: 'text-purple-500', delay: 0 },
      { Icon: FaShoppingCart, color: 'text-pink-500', delay: 0.5 },
      { Icon: FaGift, color: 'text-blue-500', delay: 1 },
      { Icon: FaTruck, color: 'text-green-500', delay: 1.5 },
      { Icon: FaStar, color: 'text-yellow-500', delay: 2 },
      { Icon: FaHeart, color: 'text-red-500', delay: 2.5 },
      { Icon: FaTag, color: 'text-indigo-500', delay: 3 },
      { Icon: FaCrown, color: 'text-orange-500', delay: 3.5 },
    ];

    setFloatingIcons(icons);

    // Animation sequence
    const timer1 = setTimeout(() => setAnimationStep(1), 300);
    const timer2 = setTimeout(() => setAnimationStep(2), 800);
    const timer3 = setTimeout(() => setAnimationStep(3), 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleStartShopping = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* Floating Shopping Icons */}
        {floatingIcons.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.color} text-4xl opacity-20 animate-float-random`}
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <item.Icon />
          </div>
        ))}

        {/* Sparkles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo Animation */}
        <div
          className={`transform transition-all duration-1000 ${
            animationStep >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          <div className="relative">
            {/* Logo with Glow */}
            <div className="relative inline-block">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-60 animate-pulse"></div>
              
              {/* ShopEase Logo Component */}
              <div className="relative transform hover:scale-110 transition-transform duration-300">
                <Logo size="large" animated={true} />
              </div>
              
              {/* Inner Glow Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-purple-300 opacity-30 animate-pulse"></div>
            </div>
            
            {/* Rotating Badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-spin-slow">
              <FaBolt className="inline mr-1" />
              NEW
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div
          className={`mt-12 text-center transform transition-all duration-1000 delay-300 ${
            animationStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-7xl md:text-8xl font-extrabold text-white mb-4 tracking-tight">
            <span className="inline-block animate-text-shimmer bg-gradient-to-r from-white via-yellow-200 to-white bg-[length:200%_auto] bg-clip-text text-transparent">
              ShopEase
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-xl md:text-2xl text-purple-100 font-medium">
            <FaStar className="text-yellow-400 animate-spin-slow" />
            <span>Your Ultimate Shopping Destination</span>
            <FaStar className="text-yellow-400 animate-spin-slow" />
          </div>
        </div>

        {/* Features Badges */}
        <div
          className={`mt-8 flex flex-wrap justify-center gap-4 transform transition-all duration-1000 delay-500 ${
            animationStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold flex items-center gap-2 shadow-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
            <FaTruck className="text-green-400" />
            Fast Delivery
          </div>
          <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold flex items-center gap-2 shadow-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
            <FaTag className="text-pink-400" />
            Best Prices
          </div>
          <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold flex items-center gap-2 shadow-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
            <FaCrown className="text-yellow-400" />
            Premium Quality
          </div>
        </div>

        {/* CTA Button */}
        <div
          className={`mt-16 transform transition-all duration-1000 delay-700 ${
            animationStep >= 3 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
        >
          <button
            onClick={handleStartShopping}
            className="group relative px-12 py-5 text-xl font-bold text-purple-900 bg-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 overflow-hidden"
          >
            {/* Button Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            
            {/* Button Content */}
            <span className="relative flex items-center gap-3">
              Start Shopping
              <FaShoppingBag className="group-hover:rotate-12 transition-transform duration-300" />
            </span>

            {/* Animated Border */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-white/50 transition-all duration-300"></div>
          </button>

          {/* Skip Link */}
          <div className="text-center mt-6">
            <button
              onClick={handleStartShopping}
              className="text-white/70 hover:text-white text-sm font-medium underline transition-colors duration-300"
            >
              Skip intro →
            </button>
          </div>
        </div>

        {/* Animated Stats */}
        <div
          className={`mt-20 grid grid-cols-3 gap-8 text-center transform transition-all duration-1000 delay-900 ${
            animationStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="text-white">
            <div className="text-4xl font-bold mb-2 animate-count-up">1000+</div>
            <div className="text-purple-200 text-sm">Products</div>
          </div>
          <div className="text-white">
            <div className="text-4xl font-bold mb-2 animate-count-up">50K+</div>
            <div className="text-purple-200 text-sm">Happy Customers</div>
          </div>
          <div className="text-white">
            <div className="text-4xl font-bold mb-2 animate-count-up">4.9★</div>
            <div className="text-purple-200 text-sm">Rating</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/70 rounded-full animate-scroll"></div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
};

export default Welcome;
