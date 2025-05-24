import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Clock } from 'lucide-react';
import api from '../../utils/api';

interface VendorProfile {
  name: string;
  description: string;
  location: string;
  logo: string;
  contactPhone: string;
  contactEmail: string;
  isOpen: boolean;
  schedule: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
}

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

const VendorProfile: React.FC = () => {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<VendorProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/vendors/profile/me');
      setProfile(response.data);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to fetch profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleScheduleChange = (
    day: string,
    type: 'open' | 'close',
    value: string
  ) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            schedule: {
              ...prev.schedule,
              [day]: {
                ...prev.schedule[day],
                [type]: value
              }
            }
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      await api.put('/vendors/profile', formData);
      setProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleToggleAvailability = async () => {
    try {
      await api.patch('/vendors/toggle-availability');
      fetchProfile();
      toast.success(
        `Your store is now ${profile?.isOpen ? 'closed' : 'open'}`
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Failed to update availability'
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

  if (error || !profile || !formData) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error || 'Profile not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Vendor Profile</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleToggleAvailability}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    profile.isOpen
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {profile.isOpen ? 'Open' : 'Closed'}
                </button>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vendor Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="contactPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="logo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Logo URL
                </label>
                <input
                  type="url"
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div className="md:col-span-2">
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
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Clock size={20} className="mr-2" />
                Business Hours
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {days.map((day) => (
                  <div key={day} className="flex items-center space-x-4">
                    <span className="w-24 text-gray-700 capitalize">{day}</span>
                    <input
                      type="time"
                      value={formData.schedule[day]?.open || ''}
                      onChange={(e) =>
                        handleScheduleChange(day, 'open', e.target.value)
                      }
                      disabled={!isEditing}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={formData.schedule[day]?.close || ''}
                      onChange={(e) =>
                        handleScheduleChange(day, 'close', e.target.value)
                      }
                      disabled={!isEditing}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                ))}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(profile);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;