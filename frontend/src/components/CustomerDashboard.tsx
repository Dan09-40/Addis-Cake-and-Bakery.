import React, { useState, useEffect } from 'react';
import NotificationToast, { useToast } from './NotificationToast';
import { useSocket } from '../hooks/useSocket';

interface Order {
  _id: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: Array<{
    cake: { name: string; price: number };
    quantity: number;
  }>;
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
}

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User>({
    name: 'John Customer',
    email: 'john@example.com',
    phone: '555-123-4567',
    address: '456 Customer Ave, Town, State 67890'
  });
  
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState<User>(user);

  const { toasts, addToast, dismissToast } = useToast();

  // Get logged-in user ID for personalized socket room
  const loggedInUser = localStorage.getItem('user');
  const userId = loggedInUser ? JSON.parse(loggedInUser)._id || JSON.parse(loggedInUser).id : '';
  const socketRef = useSocket(`customer_${userId}`);

  // Listen for order delivered notification
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    const handleDelivered = (data: any) => {
      addToast('🎉 Your order has been delivered!', 'success', `Order #${String(data.orderId).slice(-6)}`);
    };
    socket.on('order_delivered', handleDelivered);
    return () => { socket.off('order_delivered', handleDelivered); };
  }, [socketRef.current]);

  // Mock orders data (in real app, fetch from API)
  useEffect(() => {
    // Simulate API call
    const mockOrders: Order[] = [
      {
        _id: 'ORD001',
        orderDate: '2024-01-15',
        status: 'Delivered',
        totalAmount: 81.97,
        items: [
          { cake: { name: 'Chocolate Fudge Cake', price: 29.99 }, quantity: 1 },
          { cake: { name: 'Vanilla Dream Cake', price: 25.99 }, quantity: 2 }
        ],
        deliveryAddress: {
          street: '456 Customer Ave',
          city: 'Town',
          postalCode: '67890'
        }
      },
      {
        _id: 'ORD002',
        orderDate: '2024-02-20',
        status: 'Processing',
        totalAmount: 45.99,
        items: [
          { cake: { name: 'Custom Birthday Cake', price: 45.99 }, quantity: 1 }
        ],
        deliveryAddress: {
          street: '456 Customer Ave',
          city: 'Town',
          postalCode: '67890'
        }
      }
    ];
    setOrders(mockOrders);
  }, []);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(formData);
    setEditingProfile(false);
    alert('Profile updated successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toast Notifications */}
      <NotificationToast notifications={toasts} onDismiss={dismissToast} />
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="text-pink-600 hover:text-pink-700"
            >
              ← Back to Shop
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('orders')}
                className={`${
                  activeTab === 'orders'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              >
                My Orders
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`${
                  activeTab === 'profile'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              >
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`${
                  activeTab === 'addresses'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              >
                Addresses
              </button>
            </nav>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">No orders yet. Start shopping!</p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
                >
                  Browse Cakes
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order._id}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Placed on {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                      <ul className="space-y-2">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.cake.name} × {item.quantity}
                            </span>
                            <span className="text-gray-900 font-medium">
                              ${(item.cake.price * item.quantity).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Delivery Address:</p>
                        <p className="text-sm text-gray-700">
                          {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.postalCode}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-pink-600">${order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-4">
                      <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                        Track Order
                      </button>
                      <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                        Reorder
                      </button>
                      {order.status === 'Delivered' && (
                        <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                          Write Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
              {!editingProfile && (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="text-pink-600 hover:text-pink-700"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {editingProfile ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2 border"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2 border"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2 border"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2 border"
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProfile(false);
                      setFormData(user);
                    }}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-lg text-gray-900">{user.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-lg text-gray-900">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-lg text-gray-900">{user.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-lg text-gray-900">{user.address}</dd>
                </div>
              </dl>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
              <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700">
                Add New Address
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Default Address */}
              <div className="bg-white rounded-lg shadow p-6 relative">
                <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Default
                </span>
                <h3 className="font-semibold text-gray-900 mb-2">Home</h3>
                <p className="text-gray-700 text-sm mb-4">
                  456 Customer Ave<br />
                  Town, State 67890<br />
                  United States
                </p>
                <div className="flex space-x-4">
                  <button className="text-pink-600 hover:text-pink-700 text-sm">Edit</button>
                  <button className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                </div>
              </div>

              {/* Add New Address Card */}
              <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-pink-400 transition-colors">
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-gray-600 font-medium">Add New Address</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
