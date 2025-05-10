import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    api.get(`/cart/${currentUser.user_id}`)
      .then(res => {
        setItems(res.data.items || []);
        setTotal(calculateTotal(res.data.items || []));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [currentUser, navigate]);

  const calculateTotal = (cartItems) => {
    return cartItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // Optimistic update (update UI first)
    const updatedItems = items.map(item => {
      if (item.cart_item_id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setItems(updatedItems);
    setTotal(calculateTotal(updatedItems));
    
    // Then send request to server
    api.put('/cart/update', { cart_item_id: itemId, quantity: newQuantity })
      .catch(err => {
        console.error(err);
        // Revert on error - Fix the endpoint to use the user_id
        api.get(`/cart/${currentUser.user_id}`)
          .then(res => {
            setItems(res.data.items || []);
            setTotal(calculateTotal(res.data.items || []));
          });
      });
  };

  const handleRemoveItem = (itemId) => {
    // Optimistic update
    const updatedItems = items.filter(item => item.cart_item_id !== itemId);
    setItems(updatedItems);
    setTotal(calculateTotal(updatedItems));
    
    api.delete(`/cart/remove/${itemId}`)
      .catch(err => {
        console.error(err);
        // Revert on error
        api.get(`/cart/${currentUser.user_id}`)
          .then(res => {
            setItems(res.data.items || []);
            setTotal(calculateTotal(res.data.items || []));
          });
      });
  };

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Get cart details and navigate to payment with necessary info
    api.get(`/cart/${currentUser.user_id}`)
      .then(cartRes => {
        const cartData = cartRes.data;
        
        if (!cartData.cart || !items.length) {
          alert('Your cart is empty');
          return;
        }

        // Navigate to payment with cart and total information
        navigate('/payment', { 
          state: { 
            cart_id: cartData.cart.cart_id,
            subtotal: total,
            tax: (total * 0.08),
            shipping: 5.00,
            total: (total + (total * 0.08) + 5.00)
          }
        });
      })
      .catch(err => {
        console.error('Error retrieving cart:', err);
        alert('Could not retrieve cart information.');
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 className="text-2xl font-semibold mt-4">Your cart is empty</h2>
        <p className="text-gray-500 mt-2 mb-6">Looks like you haven't added any games to your cart yet.</p>
        <Link to="/" className="btn-primary">
          Browse Games
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Cart Items (left side) */}
      <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
        
        <div className="border-b border-gray-200 pb-2 mb-4 hidden sm:grid sm:grid-cols-12 text-sm font-semibold text-gray-500">
          <div className="sm:col-span-6">Product</div>
          <div className="sm:col-span-2 text-center">Price</div>
          <div className="sm:col-span-2 text-center">Quantity</div>
          <div className="sm:col-span-2 text-right">Subtotal</div>
        </div>
        
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.cart_item_id} className="border-b border-gray-200 pb-4">
              <div className="sm:grid sm:grid-cols-12 gap-4">
                {/* Product */}
                <div className="sm:col-span-6 flex items-center">
                  <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 mr-4">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.platform}</p>
                  </div>
                </div>
                
                {/* Price */}
                <div className="sm:col-span-2 text-center flex items-center sm:justify-center mt-2 sm:mt-0">
                  <span className="sm:hidden text-gray-500 mr-2">Price:</span>
                  <span>${item.unit_price}</span>
                </div>
                
                {/* Quantity */}
                <div className="sm:col-span-2 flex items-center justify-start sm:justify-center mt-2 sm:mt-0">
                  <span className="sm:hidden text-gray-500 mr-2">Quantity:</span>
                  <div className="flex items-center">
                    <button 
                      className="bg-gray-200 px-2 rounded-l"
                      onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="px-2 py-1 border-t border-b border-gray-200 w-8 text-center">
                      {item.quantity}
                    </span>
                    <button 
                      className="bg-gray-200 px-2 rounded-r"
                      onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Subtotal */}
                <div className="sm:col-span-2 flex items-center justify-between sm:justify-end mt-2 sm:mt-0">
                  <span className="sm:hidden text-gray-500">Subtotal:</span>
                  <span className="font-semibold">${(item.quantity * item.unit_price).toFixed(2)}</span>
                </div>
              </div>
              
              {/* Remove button */}
              <div className="flex justify-end mt-2">
                <button 
                  className="text-sm text-red-600 hover:text-red-800"
                  onClick={() => handleRemoveItem(item.cart_item_id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Order Summary (right side) */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>${(total * 0.08).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${(total + 5 + (total * 0.08)).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <button 
            className="btn-primary w-full py-3 mt-6"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
          
          <div className="mt-4">
            <Link 
              to="/" 
              className="text-primary-600 hover:text-primary-800 text-sm inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
