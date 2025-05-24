import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, vendorName, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // Create order
      const orderResponse = await api.post('/orders', {
        vendorId: cart[0].vendorId,
        items: cart.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity
        })),
        specialInstructions
      });

      // Initialize payment
      const paymentResponse = await api.post(
        `/payments/process/${orderResponse.data.order.id}`
      );

      // Redirect to payment gateway
      window.location.href = paymentResponse.data.url;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process order');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Cart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
            <p className="text-gray-600">Order from {vendorName}</p>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.menuItemId} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.quantity}x</span>{' '}
                      <span>{item.name}</span>
                    </div>
                    <span className="text-gray-900">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="specialInstructions"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Special Instructions (Optional)
              </label>
              <textarea
                id="specialInstructions"
                rows={3}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests for your order?"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center text-blue-800 mb-2">
                  <Clock size={20} className="mr-2" />
                  <span className="font-medium">Pickup Information</span>
                </div>
                <p className="text-blue-600 text-sm">
                  Your order will be ready for pickup in approximately 15-20 minutes after
                  payment confirmation.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-6">
                <span>Total Amount</span>
                <span>৳{totalAmount.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;