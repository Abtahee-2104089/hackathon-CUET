import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Menu as MenuIcon, 
  X 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VendorLayout: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    { path: '/vendor/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/vendor/menu', label: 'Menu Management', icon: <Utensils size={20} /> },
    { path: '/vendor/orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { path: '/vendor/profile', label: 'Profile', icon: <Settings size={20} /> },
  ];
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-blue-800 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-blue-700">
          <h1 className="text-xl font-bold">Vendor Dashboard</h1>
        </div>
        
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="mb-2">
                <Link
                  to={item.path}
                  className={`flex items-center px-5 py-3 transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-200 hover:bg-blue-700'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
            
            <li className="mt-6">
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-5 py-3 text-blue-200 hover:bg-blue-700 transition-colors"
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Overlay to close sidebar on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* Main content */}
      <div className="flex-1 md:ml-64 p-5">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;