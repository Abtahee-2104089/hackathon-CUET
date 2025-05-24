import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

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

interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  preparationTime: number;
  isVeg: boolean;
  isSpicy: boolean;
}

const initialFormData: MenuItemFormData = {
  name: '',
  description: '',
  price: 0,
  image: '',
  category: '',
  preparationTime: 15,
  isVeg: false,
  isSpicy: false
};

const VendorMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<MenuItemFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/menu/my-menu');
      setMenuItems(response.data);
    } catch (err) {
      setError('Failed to fetch menu items');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/menu/${editingId}`, formData);
        toast.success('Menu item updated successfully');
      } else {
        await api.post('/menu', formData);
        toast.success('Menu item added successfully');
      }
      setIsModalOpen(false);
      setFormData(initialFormData);
      setEditingId(null);
      fetchMenuItems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save menu item');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      preparationTime: item.preparationTime,
      isVeg: item.isVeg,
      isSpicy: item.isSpicy
    });
    setEditingId(item._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.delete(`/menu/${id}`);
      toast.success('Menu item deleted successfully');
      fetchMenuItems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/menu/toggle-availability/${id}`);
      toast.success(
        `Item is now ${currentStatus ? 'unavailable' : 'available'}`
      );
      fetchMenuItems();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Failed to update item availability'
      );
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
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <button
          onClick={() => {
            setFormData(initialFormData);
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <Plus size={20} className="mr-2" />
          Add Menu Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className={`bg-white rounded-lg shadow overflow-hidden ${
              !item.isAvailable && 'opacity-60'
            }`}
          >
            <div className="h-48 bg-gray-200 relative">
              <img
                src={item.image || 'https://via.placeholder.com/400x300?text=Food'}
                alt={item.name}
                className="w-full h-full object-cover"
              />
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
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <span className="text-xl font-bold text-gray-900">
                  ৳{item.price.toFixed(2)}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  Preparation: {item.preparationTime} mins
                </span>
                <span className="text-sm text-gray-600">
                  Category: {item.category}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <button
                  onClick={() => handleToggleAvailability(item._id, item.isAvailable)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    item.isAvailable
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Plus size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Menu Items</h3>
          <p className="text-gray-600">Start by adding your first menu item.</p>
        </div>
      )}

      {/* Add/Edit Menu Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFormData(initialFormData);
                  setEditingId(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price (৳)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Image URL
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label
                  htmlFor="preparationTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Preparation Time (minutes)
                </label>
                <input
                  type="number"
                  id="preparationTime"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isVeg"
                    checked={formData.isVeg}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Vegetarian</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isSpicy"
                    checked={formData.isSpicy}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Spicy</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData(initialFormData);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {editingId ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorMenu;