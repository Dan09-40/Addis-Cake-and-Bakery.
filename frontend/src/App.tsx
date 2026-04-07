import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import OrdersDashboard from './components/OrdersDashboard';
import DeliveryDashboard from './components/DeliveryDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Home from './components/Home';
import About from './components/About';
import Cakes from './components/Cakes';
import Contact from './components/Contact';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (token: string, userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/cakes" element={<Cakes />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register />} />

      {/* Admin only */}
      <Route
        path="/admin-dashboard"
        element={isAuthenticated && user?.isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/analytics-dashboard"
        element={isAuthenticated && user?.isAdmin ? <AnalyticsDashboard /> : <Navigate to="/login" />}
      />

      {/* Seller Dashboard — Admin only */}
      <Route
        path="/orders-dashboard"
        element={isAuthenticated && user?.isAdmin ? <OrdersDashboard /> : <Navigate to="/login" />}
      />

      {/* Delivery Dashboard — Drivers only */}
      <Route
        path="/delivery-dashboard"
        element={isAuthenticated && (user?.isDriver || user?.isAdmin) ? <DeliveryDashboard /> : <Navigate to="/login" />}
      />

      {/* Customer Dashboard */}
      <Route
        path="/customer-dashboard"
        element={isAuthenticated ? <CustomerDashboard /> : <Navigate to="/login" />}
      />

      {/* Default */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
