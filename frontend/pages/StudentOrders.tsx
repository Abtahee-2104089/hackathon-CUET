import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Package, CheckCircle, XCircle } from 'lucide-react';
import api from '../../utils/api';

interface Order {
  _id: string;
  vendor: {
    name: string;
    location: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const OrderStatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return <Clock className="text-yellow-500" size={24} />;
    case 'preparing':
      return <Package className="text-blue-500" size={24} />;
    case 'completed':
      return <CheckCircle className="text-green-500" size={24} />;
    case 'cancelled':
      return <XCircle className="text-red-500" size={24} />;
    default:
      return <Clock className="text-gray-500" size={24} />;
  }
};

const OrderStatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const StudentOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Vendors
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/order/${order._id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <OrderStatusIcon status={order.status} />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {order.vendor.name}
                        </h3>
                        <p className="text-gray-600">{order.vendor.location}</p>
                      </div>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        ৳{order.totalAmount.toFixed(2)}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      {order.items
                        .map((item) => `${item.quantity}x ${item.name}`)
                        .join(', ')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentOrders;