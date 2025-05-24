import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  ChefHat,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Phone,
  MapPin
} from 'lucide-react';
import api from '../../utils/api';

interface OrderItem {
  menuItem: {
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  subtotal: number;
}

interface Order {
  _id: string;
  vendor: {
    name: string;
    location: string;
    contactPhone: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  specialInstructions: string;
  createdAt: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
  }>;
}

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to fetch order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={24} />;
      case 'preparing':
        return <ChefHat className="text-blue-500" size={24} />;
      case 'completed':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={24} />;
      default:
        return <Clock className="text-gray-500" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error || 'Order not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/orders"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Order Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-600 mt-1">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
          </div>

          {/* Vendor Information */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{order.vendor.name}</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center">
                <MapPin size={16} className="mr-2" />
                {order.vendor.location}
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2" />
                {order.vendor.contactPhone}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center">
                  <img
                    src={item.menuItem.image || 'https://via.placeholder.com/80'}
                    alt={item.menuItem.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="text-gray-900 font-medium">{item.menuItem.name}</h4>
                    <p className="text-gray-600">
                      {item.quantity} x ৳{item.menuItem.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-gray-900 font-medium">
                    ৳{item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="space-y-4">
              {order.specialInstructions && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Special Instructions
                  </h4>
                  <p className="mt-1 text-gray-600">{order.specialInstructions}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-900">Order Timeline</h4>
                <div className="mt-2 space-y-4">
                  {order.statusHistory.map((status, index) => (
                    <div key={index} className="flex items-center">
                      {getStatusIcon(status.status)}
                      <div className="ml-4">
                        <p className="text-gray-900 font-medium">
                          {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(status.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center text-lg font-bold text-gray-900">
              <span>Total Amount</span>
              <span>৳{order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Payment Status:{' '}
              <span
                className={`font-medium ${
                  order.paymentStatus === 'paid'
                    ? 'text-green-600'
                    : order.paymentStatus === 'failed'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;