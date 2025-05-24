import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import VendorLayout from './layouts/VendorLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VendorRegister from './pages/VendorRegister';
import VendorMenu from './pages/vendor/VendorMenu.tsx';
import VendorOrders from './pages/vendor/VendorOrders.tsx';
import VendorProfile from './pages/vendor/VendorProfile.tsx';
import VendorDashboard from './pages/vendor/VendorDashboard.tsx';
import StudentDashboard from './pages/student/StudentDashboard';
import MenuList from './pages/student/MenuList';
import Cart from './pages/student/Cart';
import Checkout from './pages/student/Checkout';
import OrderSuccess from './pages/student/OrderSuccess';
import StudentOrders from './pages/student/StudentOrders';
import OrderDetails from './pages/student/OrderDetails';
import PageNotFound from './pages/PageNotFound';

// Protected Route Components
const StudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  
  if (!user || user.role !== 'student') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const VendorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  
  if (!user || user.role !== 'vendor') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={!user ? <Login /> : (user.role === 'student' ? <Navigate to="/dashboard" replace /> : <Navigate to="/vendor/dashboard" replace />)} />
        <Route path="register" element={!user ? <Register /> : (user.role === 'student' ? <Navigate to="/dashboard" replace /> : <Navigate to="/vendor/dashboard" replace />)} />
        <Route path="vendor/register" element={!user ? <VendorRegister /> : (user.role === 'vendor' ? <Navigate to="/vendor/dashboard" replace /> : <Navigate to="/dashboard" replace />)} />
      </Route>
      
      {/* Student Routes */}
      <Route path="/" element={
        <StudentRoute>
          <MainLayout />
        </StudentRoute>
      }>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="vendor/:id" element={<MenuList />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="payment/success/:orderId" element={<OrderSuccess />} />
        <Route path="orders" element={<StudentOrders />} />
        <Route path="order/:id" element={<OrderDetails />} />
      </Route>
      
      {/* Vendor Routes */}
      <Route path="/vendor" element={
        <VendorRoute>
          <VendorLayout />
        </VendorRoute>
      }>
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="menu" element={<VendorMenu />} />
        <Route path="orders" element={<VendorOrders />} />
        <Route path="profile" element={<VendorProfile />} />
      </Route>
      
      {/* 404 Page */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;