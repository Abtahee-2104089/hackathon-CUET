import React, { useState, useEffect } from 'react';
import { Package, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    menuItem: {
      name: string;
      price: number;
    };
    quantity: number;
    subtotal: number;
  }>;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  specialInstructions?: string;
  createdAt: string;
}

const statusOptions = ['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'];

const VendorOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(
        `/orders/vendor-orders${selectedStatus !== 'all' ? `?status=${selectedStatus}` : ''}`
      );
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/orders/update-status/${orderId}`, { status: newStatus });
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
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

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-500" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-600">
            {selectedStatus === 'all'
              ? "You haven't received any orders yet."
              : `No ${selectedStatus} orders at the moment.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : order.paymentStatus === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.paymentStatus.charAt(0).toUpperCase() +
                        order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-b border-gray-200 py-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Customer Details</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{order.user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{order.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{order.user.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="font-medium">{item.quantity}x</span>
                          <span className="ml-2">{item.menuItem.name}</span>
                        </div>
                        <span className="text-gray-900">
                          ৳{item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.specialInstructions && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Special Instructions
                    </h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded">
                      {order.specialInstructions}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-lg font-bold text-gray-900">
                    Total: ৳{order.totalAmount.toFixed(2)}
                  </div>

                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <div className="flex items-center space-x-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'preparing')}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'ready')}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Mark as Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'completed')}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Complete Order
                        </button>
                      )}
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;