import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/api';

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/details/${id}`);
        setOrder(response.data);
        setNewStatus(response.data.order.status);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      setStatusUpdating(true);
      await api.put(`/orders/status/${id}`, { status: newStatus });
      
      // Update the local state
      setOrder(prevOrder => ({
        ...prevOrder,
        order: {
          ...prevOrder.order,
          status: newStatus
        }
      }));
      
      setStatusUpdating(false);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
      setStatusUpdating(false);
    }
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
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600">Order not found</h2>
        <p className="mt-2">The order you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

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
      case 'completed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link to="/admin/orders" className="text-primary-600 hover:underline flex items-center">
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
            <h1 className="text-xl font-bold">Order #{order.order.order_id}</h1>
            <span className={`${getStatusBadgeColor(order.order.status)} px-3 py-1 rounded-full text-xs font-medium`}>
              {order.order.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Placed on {formatDate(order.order.order_date)}
          </p>
        </div>

        {/* Admin Actions */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Update Order Status</h2>
          <div className="flex items-center">
            <select
              className="form-select mr-3"
              value={newStatus || ''}
              onChange={(e) => setNewStatus(e.target.value)}
              disabled={statusUpdating}
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button 
              onClick={handleStatusUpdate}
              disabled={statusUpdating || newStatus === order.order.status}
              className={`btn-primary ${
                statusUpdating || newStatus === order.order.status 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
            >
              {statusUpdating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>

        {/* Customer Information */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Customer Information</h2>
              <p><span className="text-gray-600">Customer ID:</span> {order.order.user_id}</p>
              <p><span className="text-gray-600">Shipping Address:</span> {order.order.shipping_address}</p>
              <p><span className="text-gray-600">Billing Address:</span> {order.order.billing_address}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Payment Information</h2>
              {order.payment ? (
                <>
                  <p><span className="text-gray-600">Method:</span> {order.payment.payment_method.replace('_', ' ')}</p>
                  <p><span className="text-gray-600">Transaction ID:</span> {order.payment.transaction_id}</p>
                  <p><span className="text-gray-600">Payment Date:</span> {formatDate(order.payment.payment_date)}</p>
                </>
              ) : (
                <p className="text-gray-500 italic">No payment information available</p>
              )}
            </div>
          </div>
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
                {order.items.map(item => (
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
              <span>${order.order.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${order.order.tax_amount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>${order.order.shipping_cost?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
              <span>Total</span>
              <span>${order.order.total_amount?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
