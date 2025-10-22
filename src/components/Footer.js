import React from 'react';
import { FaShoppingCart, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaShoppingCart className="text-primary text-2xl" />
              <span className="text-2xl font-bold">ShopEasy</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your one-stop destination for quality products at affordable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-primary transition">Home</a></li>
              <li><a href="/" className="hover:text-primary transition">Products</a></li>
              <li><a href="/cart" className="hover:text-primary transition">Cart</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/?category=Electronics" className="hover:text-primary transition">Electronics</a></li>
              <li><a href="/?category=Fashion" className="hover:text-primary transition">Fashion</a></li>
              <li><a href="/?category=Home & Kitchen" className="hover:text-primary transition">Home & Kitchen</a></li>
              <li><a href="/?category=Sports" className="hover:text-primary transition">Sports</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition text-xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition text-xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition text-xl">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition text-xl">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 ShopEasy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
