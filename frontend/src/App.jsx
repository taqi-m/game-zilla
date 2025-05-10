import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/orders/details/${id}`)
      .then(res => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
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

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-2xl font-bold mb-4">Order #{order.order.order_id}</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Order Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Order Date</p>
            <p>{new Date(order.order.order_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p>{order.order.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Subtotal</p>
            <p>${order.order.subtotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tax</p>
            <p>${order.order.tax_amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Shipping</p>
            <p>${order.order.shipping_cost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p>${order.order.total_amount.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Items</h2>
        <div className="space-y-4">
          {order.items.map(item => (
            <div key={item.item_id} className="border-b border-gray-200 pb-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.platform}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-600">Price: ${item.unit_price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Subtotal: ${(item.quantity * item.unit_price).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}