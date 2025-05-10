import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/details/${id}`);
        setOrderDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Could not load order details. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, currentUser, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPaymentInfo = () => {
    if (!orderDetails?.payment) return null;

    const payment = orderDetails.payment;
    let paymentDetails = '';

    switch (payment.payment_method) {
      case 'credit_card':
        paymentDetails = `Card ending in ${payment.card_last4}`;
        break;
      case 'paypal':
        paymentDetails = `PayPal (${payment.paypal_email})`;
        break;
      case 'upi':
        paymentDetails = `UPI ID: ${payment.upi_id}`;
        break;
      default:
        paymentDetails = 'Unknown payment method';
        break;
    }

    return (
      <div className="mt-6 border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-gray-600">Payment Method:</div>
          <div className="capitalize">{payment.payment_method.replace('_', ' ')}</div>
          
          <div className="text-gray-600">Payment Details:</div>
          <div>{paymentDetails}</div>
          
          <div className="text-gray-600">Transaction ID:</div>
          <div>{payment.transaction_id}</div>
          
          <div className="text-gray-600">Payment Date:</div>
          <div>{formatDate(payment.payment_date)}</div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
        <p className="mb-2 font-semibold">Error</p>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/orders')}
          className="mt-4 text-primary-600 hover:underline"
        >
          ← Back to Orders
        </button>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600">Order not found</h2>
        <p className="mt-2">We couldn't find the order you're looking for.</p>
        <Link to="/orders" className="mt-4 inline-block text-primary-600 hover:underline">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const { order, items } = orderDetails;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/orders" className="text-primary-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Order Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Order #{order.order_id}</h1>
            <span className={`${getStatusBadgeColor(order.status)} px-3 py-1 rounded-full text-xs font-medium`}>
              {order.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Placed on {formatDate(order.order_date)}
          </p>
        </div>

        {/* Order Items */}
        <div className="px-6 py-4">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map(item => (
                  <tr key={item.item_id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.title} 
                            className="h-10 w-10 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium">{item.title}</div>
                          {item.platform && (
                            <div className="text-xs text-gray-500">{item.platform}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      ${item.unit_price?.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium">
                      ${item.subtotal?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${order.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${order.tax_amount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>${order.shipping_cost?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
              <span>Total</span>
              <span>${order.total_amount?.toFixed(2)}</span>
            </div>
          </div>
          {renderPaymentInfo()}
        </div>

        {/* Customer Support */}
        <div className="bg-blue-50 px-6 py-4 border-t border-blue-100">
          <h3 className="text-sm font-medium text-blue-900">Need help with this order?</h3>
          <p className="text-sm text-blue-700 mt-1">
            Contact our support team at support@gamezilla.com or call us at (555) 123-4567.
          </p>
        </div>
      </div>
    </div>
  );
}
