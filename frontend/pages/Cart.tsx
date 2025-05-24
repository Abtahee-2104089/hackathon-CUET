import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Cart: React.FC = () => {
  const { cart, vendorName, updateQuantity, removeFromCart, totalAmount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items to your cart</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft size={20} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
            <p className="text-gray-600">Ordering from {vendorName}</p>
          </div>

          <div className="divide-y divide-gray-200">
            {cart.map((item) => (
              <div key={item.menuItemId} className="p-6">
                <div className="flex items-center">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">৳{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} className="text-gray-600" />
                      </button>
                      <span className="text-gray-900 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus size={16} className="text-gray-600" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.menuItemId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-right text-gray-900 font-medium">
                  ৳{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center text-lg font-bold text-gray-900">
              <span>Total Amount</span>
              <span>৳{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="px-6 py-4">
            <Link
              to="/checkout"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-md hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;