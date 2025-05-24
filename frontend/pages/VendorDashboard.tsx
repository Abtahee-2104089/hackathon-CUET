import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import api from '../../utils/api';

interface Order {
  _id: string;
  user: {
    name: string;
  };
  items: Array<{
    name: string;
    quantity: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  averageOrderValue: number;
  recentOrders: Order[];
}

const VendorDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch orders
        const ordersResponse = await api.get('/orders/vendor-orders');
        const orders = ordersResponse.data;

        // Calculate stats
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce(
          (sum: number, order: Order) => sum + order.totalAmount,
          0
        );
        const uniqueCustomers = new Set(orders.map((order: Order) => order.user._id));
        const totalCustomers = uniqueCustomers.size;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Get recent orders
        const recentOrders = orders
          .sort(
            (a: Order, b: Order) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        setStats({
          totalOrders,
          totalRevenue,
          totalCustomers,
          averageOrderValue,
          recentOrders
        });
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
            <span className="text-green-500 flex items-center">
              <ArrowUpRight size={20} />
              12%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <span className="text-green-500 flex items-center">
              <ArrowUpRight size={20} />
              8%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">
            ৳{stats.totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="text-purple-600" size={24} />
            </div>
            <span className="text-red-500 flex items-center">
              <ArrowDownRight size={20} />
              3%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Total Customers</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <span className="text-green-500 flex items-center">
              <ArrowUpRight size={20} />
              5%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Average Order Value</h3>
          <p className="text-2xl font-bold text-gray-900">
            ৳{stats.averageOrderValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              to="/vendor/orders"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.items
                      .map((item) => `${item.quantity}x ${item.name}`)
                      .join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ৳{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {stats.recentOrders.length === 0 && (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600">Start receiving orders by adding menu items.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;