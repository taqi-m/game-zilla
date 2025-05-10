import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/orders');
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on status
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status?.toLowerCase() === filter.toLowerCase());

  // Order status badge
  const StatusBadge = ({ status }) => {
    let bgColor = "";
    let textColor = "";
    
    switch(status?.toLowerCase()) {
      case 'delivered':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'shipped':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'processing':
      case 'completed':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'cancelled':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }
    
    return (
      <span className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-xs font-medium`}>
        {status}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
        <Link to="/admin/dashboard" className="btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
        >
          All Orders
        </button>
        <button 
          onClick={() => setFilter('processing')}
          className={`px-4 py-2 rounded-md ${filter === 'processing' ? 'bg-yellow-500 text-white' : 'bg-yellow-100'}`}
        >
          Processing
        </button>
        <button 
          onClick={() => setFilter('shipped')}
          className={`px-4 py-2 rounded-md ${filter === 'shipped' ? 'bg-blue-500 text-white' : 'bg-blue-100'}`}
        >
          Shipped
        </button>
        <button 
          onClick={() => setFilter('delivered')}
          className={`px-4 py-2 rounded-md ${filter === 'delivered' ? 'bg-green-500 text-white' : 'bg-green-100'}`}
        >
          Delivered
        </button>
        <button 
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded-md ${filter === 'cancelled' ? 'bg-red-500 text-white' : 'bg-red-100'}`}
        >
          Cancelled
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <tr key={order.order_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.order_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.username || `User #${order.user_id}`}
                    <div className="text-xs text-gray-400">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.order_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${order.total_amount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link 
                      to={`/admin/orders/${order.order_id}`}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
