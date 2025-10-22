import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShippingFast, FaCreditCard, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, getCartSubtotal, getDiscount, getCartTotal, getAppliedCoupon, clearCart } = useCart();
  const { user } = useAuth();

  // Check if buying a single item
  const singleItem = location.state?.singleItem;
  const checkoutItems = singleItem ? [singleItem] : cart.items;
  const isSingleItemCheckout = !!singleItem;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Shipping Information
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
  });

  // Billing same as shipping
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  // Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '5-7 business days',
      price: 0,
      icon: '📦',
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: '2-3 business days',
      price: 200,
      icon: '⚡',
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      description: 'Next business day',
      price: 500,
      icon: '🚀',
    },
  ];

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const paymentOptions = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive',
      icon: '💵',
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, Rupay',
      icon: '💳',
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      description: 'Google Pay, PhonePe, Paytm',
      icon: '📱',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks',
      icon: '🏦',
    },
  ];

  // Card Details (for card payment)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    if (!checkoutItems || checkoutItems.length === 0) {
      navigate('/cart');
    }
  }, [checkoutItems, navigate]);

  const handleShippingChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleBillingChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    let value = e.target.value;
    
    // Format card number with spaces
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }
    
    // Format expiry date
    if (e.target.name === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').substr(0, 5);
    }
    
    // Limit CVV to 3 digits
    if (e.target.name === 'cvv') {
      value = value.replace(/\D/g, '').substr(0, 3);
    }
    
    setCardDetails({ ...cardDetails, [e.target.name]: value });
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || 
          !shippingInfo.street || !shippingInfo.city || !shippingInfo.state || 
          !shippingInfo.zipCode) {
        toast.error('Please fill in all shipping details');
        return false;
      }
      
      if (!billingSameAsShipping) {
        if (!billingInfo.fullName || !billingInfo.phone || !billingInfo.street || 
            !billingInfo.city || !billingInfo.state || !billingInfo.zipCode) {
          toast.error('Please fill in all billing details');
          return false;
        }
      }
      return true;
    }
    
    if (step === 2) {
      return true; // Delivery method is optional
    }
    
    if (step === 3) {
      if (paymentMethod === 'card') {
        if (!cardDetails.cardNumber || !cardDetails.cardName || 
            !cardDetails.expiryDate || !cardDetails.cvv) {
          toast.error('Please fill in all card details');
          return false;
        }
      }
      return true;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(3)) return;
    
    setLoading(true);
    
    try {
      // Calculate totals for single item or full cart
      const calculateSubtotal = () => {
        if (isSingleItemCheckout) {
          return singleItem.productId.price * singleItem.quantity;
        }
        return getCartSubtotal();
      };

      const calculateDiscount = () => {
        if (isSingleItemCheckout) {
          return 0; // No coupon for single item checkout
        }
        return getDiscount();
      };

      const subtotal = calculateSubtotal();
      const discount = calculateDiscount();
      const deliveryCharge = deliveryOptions.find(d => d.id === deliveryMethod)?.price || 0;
      const totalPrice = subtotal - discount + deliveryCharge;

      // Prepare order data
      const orderData = {
        orderItems: checkoutItems.map(item => ({
          product: item.productId._id,
          name: item.productId.name,
          quantity: item.quantity,
          price: item.productId.price,
          image: item.productId.imageURL,
        })),
        shippingAddress: {
          street: shippingInfo.street,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
        },
        paymentMethod: paymentOptions.find(p => p.id === paymentMethod)?.name || 'Cash on Delivery',
        deliveryMethod: deliveryOptions.find(d => d.id === deliveryMethod)?.name || 'Standard Delivery',
        subtotal: subtotal,
        discount: discount,
        deliveryCharge: deliveryCharge,
        totalPrice: totalPrice,
        appliedCoupon: isSingleItemCheckout ? null : (getAppliedCoupon()?.code || null),
      };

      // Simulate payment processing for card/UPI
      if (paymentMethod !== 'cod') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success('💳 Payment processed successfully!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      // Create order
      const response = await api.post('/orders', orderData);
      
      // Show celebratory success message
      toast.success(
        `🎉 Order Placed Successfully! 
        
Order ID: #${response.data.order._id.slice(-8).toUpperCase()}
Total Amount: ₹${totalPrice.toLocaleString('en-IN')}
${isSingleItemCheckout ? '📦 Single Item' : `📦 ${checkoutItems.length} Items`}

We'll send you an email confirmation shortly!`, 
        {
          position: "top-center",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
          }
        }
      );

      // Additional quick success toast
      setTimeout(() => {
        toast.info('📧 Confirmation email sent!', {
          position: "bottom-right",
          autoClose: 3000,
        });
      }, 1000);
      
      // Clear cart
      await clearCart();
      
      // Navigate to success page with order ID
      navigate('/order-success', { 
        state: { 
          orderId: response.data.order._id,
          orderDetails: response.data.order 
        } 
      });
      
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const selectedDelivery = deliveryOptions.find(d => d.id === deliveryMethod);
  const deliveryCharge = selectedDelivery?.price || 0;
  const finalTotal = getCartTotal() + deliveryCharge;

  const steps = [
    { number: 1, title: 'Shipping', icon: <FaMapMarkerAlt /> },
    { number: 2, title: 'Delivery', icon: <FaShippingFast /> },
    { number: 3, title: 'Payment', icon: <FaCreditCard /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-2">
            Checkout
          </h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.number ? <FaCheckCircle className="text-2xl" /> : step.icon}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={`font-semibold ${currentStep >= step.number ? 'text-purple-700' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 md:w-32 h-1 mx-4 transition-all duration-300 ${
                    currentStep > step.number
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                      : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaMapMarkerAlt className="mr-3 text-purple-600" />
                  Shipping Information
                </h2>

                <div className="space-y-6">
                  {/* Personal Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaUser className="inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaPhone className="inline mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        pattern="[0-9]{10}"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={shippingInfo.street}
                      onChange={handleShippingChange}
                      placeholder="House no., Building name, Street name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        pattern="[0-9]{6}"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>

                  {/* Billing Address Option */}
                  <div className="bg-purple-50 rounded-xl p-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={billingSameAsShipping}
                        onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="ml-3 font-semibold text-gray-700">
                        Billing address same as shipping address
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 font-bold shadow-lg transform hover:scale-105"
                  >
                    Continue to Delivery →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Method */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaShippingFast className="mr-3 text-purple-600" />
                  Select Delivery Method
                </h2>

                <div className="space-y-4">
                  {deliveryOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setDeliveryMethod(option.id)}
                      className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        deliveryMethod === option.id
                          ? 'border-purple-600 bg-purple-50 shadow-lg transform scale-105'
                          : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-4xl">{option.icon}</span>
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">{option.name}</h3>
                            <p className="text-gray-600">{option.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-700">
                            {option.price === 0 ? 'FREE' : `₹${option.price}`}
                          </p>
                          {deliveryMethod === option.id && (
                            <FaCheckCircle className="text-green-600 text-2xl mt-2 ml-auto" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 border-2 border-purple-600 text-purple-700 rounded-xl hover:bg-purple-50 transition-all duration-300 font-bold"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 font-bold shadow-lg transform hover:scale-105"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaCreditCard className="mr-3 text-purple-600" />
                  Select Payment Method
                </h2>

                <div className="space-y-4 mb-6">
                  {paymentOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setPaymentMethod(option.id)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        paymentMethod === option.id
                          ? 'border-purple-600 bg-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{option.icon}</span>
                          <div>
                            <h3 className="font-bold text-gray-800">{option.name}</h3>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                        </div>
                        {paymentMethod === option.id && (
                          <FaCheckCircle className="text-green-600 text-2xl" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Details Form */}
                {paymentMethod === 'card' && (
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">Card Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardDetails.cardNumber}
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={cardDetails.cardName}
                          onChange={handleCardChange}
                          placeholder="JOHN DOE"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 uppercase"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={cardDetails.expiryDate}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={cardDetails.cvv}
                            onChange={handleCardChange}
                            placeholder="123"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 border-2 border-purple-600 text-purple-700 rounded-xl hover:bg-purple-50 transition-all duration-300 font-bold"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              {/* Single Item Checkout Badge */}
              {isSingleItemCheckout && (
                <div className="mb-4 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                  <p className="text-sm font-semibold text-green-800 text-center">
                    🛒 Buying Single Item
                  </p>
                </div>
              )}

              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {checkoutItems?.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <img
                      src={item.productId.imageURL}
                      alt={item.productId.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate text-sm">
                        {item.productId.name}
                      </p>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-purple-700">
                      ₹{(item.productId.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ₹{(isSingleItemCheckout 
                      ? singleItem.productId.price * singleItem.quantity 
                      : getCartSubtotal()).toLocaleString('en-IN')}
                  </span>
                </div>

                {!isSingleItemCheckout && getDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">−₹{getDiscount().toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Delivery Charge</span>
                  <span className="font-semibold">
                    {deliveryOptions.find(d => d.id === deliveryMethod)?.price === 0 
                      ? 'FREE' 
                      : `₹${deliveryOptions.find(d => d.id === deliveryMethod)?.price}`}
                  </span>
                </div>

                <div className="border-t-2 border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total</span>
                    <span className="text-3xl font-extrabold text-purple-700">
                      ₹{(isSingleItemCheckout 
                        ? (singleItem.productId.price * singleItem.quantity + (deliveryOptions.find(d => d.id === deliveryMethod)?.price || 0))
                        : (getCartTotal() + (deliveryOptions.find(d => d.id === deliveryMethod)?.price || 0))
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {!isSingleItemCheckout && getAppliedCoupon() && (
                  <div className="bg-green-100 border border-green-200 rounded-xl p-3 mt-3">
                    <p className="text-sm text-green-800 font-semibold text-center">
                      🎉 Coupon "{getAppliedCoupon().code}" Applied!
                    </p>
                  </div>
                )}

                {isSingleItemCheckout && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-3">
                    <p className="text-xs text-blue-700 text-center">
                      ℹ️ Coupons not available for single item purchase
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
