import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Order Successful!
          </h2>
          <p className="mt-2 text-gray-600">
            Your order has been placed successfully. You can track your order status below.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">Order ID:</p>
            <p className="font-mono text-gray-900">{orderId}</p>
          </div>

          <Link
            to={`/order/${orderId}`}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Track Order
          </Link>

          <Link
            to="/dashboard"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;