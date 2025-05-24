import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const PageNotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center mt-6 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Home size={20} className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;