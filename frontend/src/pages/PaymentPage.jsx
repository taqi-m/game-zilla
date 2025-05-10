import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [formData, setFormData] = useState({
    // Credit Card
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    // PayPal
    paypalEmail: '',
    // UPI
    upiId: '',
    // Common fields
    billingAddress: '',
    shippingAddress: ''
  });

  const { cart_id, subtotal, tax, shipping, total } = location.state || {};

  // Redirect if no cart data
  if (!cart_id) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let paymentDetails = {
        user_id: currentUser.user_id,
        cart_id,
        amount: total,
        payment_method: paymentMethod,
        shipping_address: formData.shippingAddress,
        billing_address: formData.billingAddress
      };

      // Add payment method specific details
      switch(paymentMethod) {
        case 'credit_card':
          paymentDetails.card_last4 = formData.cardNumber.slice(-4);
          break;
        case 'paypal':
          paymentDetails.paypal_email = formData.paypalEmail;
          break;
        case 'upi':
          paymentDetails.upi_id = formData.upiId;
          break;
        default:
          throw new Error('Invalid payment method selected.');
      }

      const paymentResponse = await api.post('/orders/payment', paymentDetails);

      if (paymentResponse.data.success) {
        await api.post('/orders', {
          user_id: currentUser.user_id,
          cart_id,
          payment_id: paymentResponse.data.payment_id,
          shipping_address: formData.shippingAddress,
          billing_address: formData.billingAddress,
        });

        navigate(`/orders`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
      
    }
  };

  const renderPaymentForm = () => {
    switch(paymentMethod) {
      case 'credit_card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="text"
                  name="cardExpiry"
                  placeholder="MM/YY"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  name="cardCvv"
                  value={formData.cardCvv}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 'paypal':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700">PayPal Email</label>
            <input
              type="email"
              name="paypalEmail"
              value={formData.paypalEmail}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
        );

      case 'upi':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700">UPI ID</label>
            <input
              type="text"
              name="upiId"
              value={formData.upiId}
              onChange={handleInputChange}
              placeholder="example@upi"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
        );

        default:
        return <p className="text-red-500">Invalid payment method selected.</p>;
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8"> {/* Fixed width container */}
      <h1 className="text-2xl font-bold mb-6">Payment Information</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shipping?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span>${total?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setPaymentMethod('credit_card')}
              className={`p-4 border rounded-lg text-center ${
                paymentMethod === 'credit_card' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
              }`}
            >
              Credit Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className={`p-4 border rounded-lg text-center ${
                paymentMethod === 'paypal' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
              }`}
            >
              PayPal
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 border rounded-lg text-center ${
                paymentMethod === 'upi' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
              }`}
            >
              UPI
            </button>
          </div>

          {renderPaymentForm()}

          <div>
            <label className="block text-sm font-medium text-gray-700">Billing Address</label>
            <textarea
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 resize-none" // Non-resizable
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 resize-none" // Non-resizable
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Pay $${total?.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
