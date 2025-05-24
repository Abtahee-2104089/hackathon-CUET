import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold flex items-center">
            CUET Campus Eats
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200 transition">
              Home
            </Link>
            
            {user ? (
              <>
                {user.role === 'student' && (
                  <>
                    <Link to="/dashboard" className="hover:text-blue-200 transition">
                      Dashboard
                    </Link>
                    <Link to="/orders" className="hover:text-blue-200 transition">
                      My Orders
                    </Link>
                    <Link to="/cart" className="hover:text-blue-200 transition relative">
                      <ShoppingCart size={20} />
                      {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-1 hover:text-blue-200 transition">
                    <User size={20} />
                    <span>{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {user.role === 'vendor' && (
                      <Link
                        to="/vendor/dashboard"
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                      >
                        Vendor Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-blue-500">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="hover:bg-blue-700 px-3 py-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {user ? (
                <>
                  {user.role === 'student' && (
                    <>
                      <Link
                        to="/dashboard"
                        className="hover:bg-blue-700 px-3 py-2 rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/orders"
                        className="hover:bg-blue-700 px-3 py-2 rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/cart"
                        className="hover:bg-blue-700 px-3 py-2 rounded flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ShoppingCart size={20} className="mr-2" />
                        Cart
                        {totalItems > 0 && (
                          <span className="ml-2 bg-orange-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                            {totalItems}
                          </span>
                        )}
                      </Link>
                    </>
                  )}
                  
                  {user.role === 'vendor' && (
                    <Link
                      to="/vendor/dashboard"
                      className="hover:bg-blue-700 px-3 py-2 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Vendor Dashboard
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center hover:bg-blue-700 px-3 py-2 rounded text-left"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="bg-white text-blue-600 px-3 py-2 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-orange-500 text-white px-3 py-2 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;