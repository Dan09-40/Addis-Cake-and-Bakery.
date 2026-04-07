import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';

const Header: React.FC = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const isAuthenticated = !!token && !!userStr;
  const user = userStr ? JSON.parse(userStr) : null;

  const [newOrderBadge, setNewOrderBadge] = useState(0);

  // Connect admins/sellers to receive notifications in header badge
  const room = user?.isAdmin ? 'sellers' : user?.isDriver ? 'delivery' : '';
  const socketRef = useSocket(room);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !user?.isAdmin) return;

    const handleNewOrder = () => {
      setNewOrderBadge(prev => prev + 1);
    };

    socket.on('new_order', handleNewOrder);
    return () => { socket.off('new_order', handleNewOrder); };
  }, [socketRef.current, user?.isAdmin]);

  return (
    <header className="bg-pink-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/addis-logo.png"
              alt="Addis Cake and Bakery Logo"
              className="h-14 w-14 object-contain rounded-full shadow-sm bg-white p-1"
            />
            <div>
              <h1 className="text-2xl font-bold">Addis Cake and Bakery</h1>
              <p className="text-xs text-pink-200">አዲስ ኬክ እና ዳቦ ቤት | Addis Keekii fi Baakkarii</p>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-pink-200 transition-colors duration-200 font-medium">Home</Link>
            <Link to="/about" className="hover:text-pink-200 transition-colors duration-200 font-medium">About</Link>
            <Link to="/cakes" className="hover:text-pink-200 transition-colors duration-200 font-medium">Our Cakes</Link>
            <Link to="/contact" className="hover:text-pink-200 transition-colors duration-200 font-medium">Contact</Link>

            {/* Admin Dashboard link */}
            {isAuthenticated && user?.isAdmin && (
              <Link to="/admin-dashboard" className="hover:text-pink-200 transition-colors duration-200 font-medium">
                Admin Dashboard
              </Link>
            )}

            {/* Seller Dashboard — Admin only, with notification badge */}
            {isAuthenticated && user?.isAdmin && (
              <Link
                to="/orders-dashboard"
                className="hover:text-pink-200 transition-colors duration-200 font-medium relative"
                onClick={() => setNewOrderBadge(0)}
              >
                Seller Dashboard
                {newOrderBadge > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {newOrderBadge > 9 ? '9+' : newOrderBadge}
                  </span>
                )}
              </Link>
            )}

            {/* Delivery Dashboard — Drivers only */}
            {isAuthenticated && user?.isDriver && !user?.isAdmin && (
              <Link to="/delivery-dashboard" className="hover:text-pink-200 transition-colors duration-200 font-medium">
                Delivery Dashboard
              </Link>
            )}

            {/* Customer Dashboard — regular users */}
            {isAuthenticated && !user?.isAdmin && !user?.isDriver && (
              <Link to="/customer-dashboard" className="hover:text-pink-200 transition-colors duration-200 font-medium">
                My Account
              </Link>
            )}

            {/* Auth buttons */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-100 transition-colors duration-200 font-semibold"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
                className="bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-100 transition-colors duration-200 font-semibold"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
