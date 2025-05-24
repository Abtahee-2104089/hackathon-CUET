import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CUET Campus Eats</h3>
            <p className="text-blue-200 mb-4">
              Order food from your favorite campus vendors with ease.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-200 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-blue-200 hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-blue-200 hover:text-white transition">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">For Vendors</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/vendor/register" className="text-blue-200 hover:text-white transition">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link to="/vendor/login" className="text-blue-200 hover:text-white transition">
                  Vendor Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-blue-200 mb-2">
              Chittagong University of Engineering & Technology
            </p>
            <p className="text-blue-200 mb-2">
              Chittagong, Bangladesh
            </p>
            <p className="text-blue-200">
              Email: support@cuetcampuseats.com
            </p>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-8 pt-6 text-center">
          <p className="text-blue-300">
            &copy; {new Date().getFullYear()} CUET Campus Eats. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;