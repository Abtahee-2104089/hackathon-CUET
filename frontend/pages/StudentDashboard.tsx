import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Clock, MapPin } from 'lucide-react';
import api from '../../utils/api';

interface Vendor {
  _id: string;
  name: string;
  description: string;
  location: string;
  logo: string;
  isOpen: boolean;
  rating: number;
}

const StudentDashboard: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get('/vendors');
        setVendors(response.data);
      } catch (err) {
        setError('Failed to fetch vendors');
        console.error('Error fetching vendors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to CUET Campus Eats</h1>
          <p className="mt-2 text-gray-600">Order food from your favorite campus vendors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={vendor.logo || 'https://via.placeholder.com/400x300?text=Vendor'}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vendor.isOpen
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {vendor.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{vendor.name}</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-gray-600">{vendor.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{vendor.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-500">
                    <MapPin size={16} className="mr-2" />
                    <span>{vendor.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock size={16} className="mr-2" />
                    <span>15-20 mins</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Store size={16} className="mr-2" />
                    <span>Pickup Only</span>
                  </div>
                </div>

                <Link
                  to={`/vendor/${vendor._id}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
                >
                  View Menu
                </Link>
              </div>
            </div>
          ))}
        </div>

        {vendors.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Store size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Vendors Available</h3>
            <p className="text-gray-600">
              There are currently no vendors available. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;