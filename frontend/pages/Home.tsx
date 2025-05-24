import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ShoppingBag, Clock, MapPin } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface Vendor {
  _id: string;
  name: string;
  description: string;
  location: string;
  logo: string;
  isOpen: boolean;
  rating: number;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get('/vendors');
        setVendors(response.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendors();
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Campus Food Ordering Made Easy
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Browse menus, place orders, and enjoy delicious food from your favorite campus vendors.
          </p>
          {user ? (
            <Link
              to={user.role === 'student' ? '/dashboard' : '/vendor/dashboard'}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
              >
                Register as Student
              </Link>
              <Link
                to="/vendor/register"
                className="bg-white hover:bg-blue-50 text-blue-600 font-bold py-3 px-8 rounded-lg text-lg transition-colors"
              >
                Register as Vendor
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full inline-block">
                  <Utensils className="text-blue-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Browse Vendors</h3>
              <p className="text-gray-600">
                Explore a variety of food options from different campus vendors.
              </p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full inline-block">
                  <ShoppingBag className="text-blue-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Place Your Order</h3>
              <p className="text-gray-600">
                Select your favorite items, add to cart, and place your order online.
              </p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full inline-block">
                  <Clock className="text-blue-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Pick Up & Enjoy</h3>
              <p className="text-gray-600">
                Get notified when your food is ready and pick it up at your convenience.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Vendors Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Our Vendors</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover a variety of food options from trusted campus vendors.
          </p>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading vendors...</p>
            </div>
          ) : vendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <div key={vendor._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="h-40 bg-blue-100 flex items-center justify-center">
                    <img 
                      src={vendor.logo || 'https://via.placeholder.com/300x200?text=Vendor'} 
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{vendor.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        vendor.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {vendor.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{vendor.description}</p>
                    
                    <div className="flex items-center text-gray-500 mb-4">
                      <MapPin size={16} className="mr-1" />
                      <span className="text-sm">{vendor.location}</span>
                    </div>
                    
                    <Link
                      to={user && user.role === 'student' ? `/vendor/${vendor._id}` : '/login'}
                      className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
                    >
                      View Menu
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-blue-50 rounded-lg">
              <p className="text-gray-600">No vendors available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;