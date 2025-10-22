import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartAPI } from '../api/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, token } = useAuth();

  // Load cart from localStorage on mount (for guest users)
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart && !isAuthenticated) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Fetch cart from server when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCart();
    }
  }, [isAuthenticated, token]);

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data.cart);
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      if (isAuthenticated) {
        const response = await cartAPI.addToCart({
          productId: product._id,
          quantity,
        });
        setCart(response.data.cart);
        toast.success('Item added to cart!');
      } else {
        // Guest cart (localStorage)
        const existingItemIndex = cart.items.findIndex(
          (item) => item.productId._id === product._id
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...cart.items];
          updatedItems[existingItemIndex].quantity += quantity;
          setCart({ ...cart, items: updatedItems });
        } else {
          setCart({
            ...cart,
            items: [...cart.items, { productId: product, quantity }],
          });
        }
        toast.success('Item added to cart!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item';
      toast.error(message);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (isAuthenticated) {
        const response = await cartAPI.updateItem(itemId, { quantity });
        setCart(response.data.cart);
        toast.success('Cart updated!');
      } else {
        const updatedItems = cart.items.map((item) =>
          item.productId._id === itemId ? { ...item, quantity } : item
        );
        setCart({ ...cart, items: updatedItems });
        toast.success('Cart updated!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (isAuthenticated) {
        const response = await cartAPI.removeItem(itemId);
        setCart(response.data.cart);
        toast.info('Item removed from cart');
      } else {
        const updatedItems = cart.items.filter(
          (item) => item.productId._id !== itemId
        );
        setCart({ ...cart, items: updatedItems });
        toast.info('Item removed from cart');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartAPI.clearCart();
      }
      setCart({ items: [] });
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  const getCartTotal = () => {
    // Use backend calculated total if available (includes discounts)
    if (cart.total !== undefined) {
      return cart.total;
    }
    // Fallback for guest users
    return cart.items.reduce((total, item) => {
      return total + (item.productId?.price || 0) * item.quantity;
    }, 0);
  };

  const getCartSubtotal = () => {
    if (cart.subtotal !== undefined) {
      return cart.subtotal;
    }
    return cart.items.reduce((total, item) => {
      return total + (item.productId?.price || 0) * item.quantity;
    }, 0);
  };

  const getDiscount = () => {
    return cart.discount || 0;
  };

  const getAppliedCoupon = () => {
    return cart.appliedCoupon || null;
  };

  const getCartCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  const applyCoupon = async (code) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please login to apply coupons');
        return;
      }
      setLoading(true);
      const response = await cartAPI.applyCoupon({ code });
      setCart(response.data.cart);
      toast.success(`Coupon ${code} applied! You saved ₹${response.data.discount}`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to apply coupon';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = async () => {
    try {
      if (!isAuthenticated) {
        return;
      }
      setLoading(true);
      const response = await cartAPI.removeCoupon();
      setCart(response.data.cart);
      toast.info('Coupon removed');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove coupon';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartSubtotal,
    getDiscount,
    getAppliedCoupon,
    getCartCount,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
