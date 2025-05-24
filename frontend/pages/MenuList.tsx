import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  preparationTime: number;
  isVeg: boolean;
  isSpicy: boolean;
}

interface Vendor {
  _id: string;
  name: string;
  description: string;
  location: string;
  isOpen: boolean;
}

const MenuList: React.FC = () => {
  const { id: vendorId } = useParams<{ id: string }>();
  const { addToCart, cart } = useCart();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchVendorAndMenu = async () => {
      try {
        const [vendorResponse, menuResponse] = await Promise.all([
          api.get(`/vendors/${vendorId}`),
          api.get(`/menu/vendor/${vendorId}`)
        ]);

        setVendor(vendorResponse.data);
        setMenuItems(menuResponse.data);
      } catch (err) {
        setError('Failed to fetch menu items');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorAndMenu();
  }, [vendorId]);

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    if (!vendor) return;

    if (!item.isAvailable) {
      toast.error('This item is currently unavailable');
      return;
    }

    if (!vendor.isOpen) {
      toast.error('This vendor is currently closed');
      return;
    }

    addToCart({
      menuItemId: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      vendorId: vendorId!,
      vendorName: vendor.name
    });

    toast.success('Item added to cart');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error || 'Vendor not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Vendor Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
              <p className="mt-2 text-gray-600">{vendor.description}</p>
              <p className="mt-2 text-gray-500">{vendor.location}</p>
            </div>
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

        {/* Category Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                !item.isAvailable && 'opacity-60'
              }`}
            >
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={item.image || 'https://via.placeholder.com/400x300?text=Food'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-medium">Currently Unavailable</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 space-x-2">
                  {item.isVeg && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Veg
                    </span>
                  )}
                  {item.isSpicy && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      Spicy
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    ৳{item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.isAvailable || !vendor.isOpen}
                    className={`flex items-center px-4 py-2 rounded ${
                      item.isAvailable && vendor.isOpen
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Plus size={20} className="mr-1" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Items Available</h3>
            <p className="text-gray-600">
              There are currently no items available in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuList;