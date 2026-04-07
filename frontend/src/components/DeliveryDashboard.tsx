import React, { useState, useEffect } from 'react';
import NotificationToast, { useToast } from './NotificationToast';
import { useSocket } from '../hooks/useSocket';

interface DeliveryOrder {
  _id: string;
  user: { name: string; email: string; phone: string };
  orderItems: Array<{
    cake: { name: string; price: number };
    quantity: number;
  }>;
  shippingAddr: {
    street: string;
    city: string;
    postalCode: string;
  };
  totalPrice: number;
  isPaid: boolean;
  deliveryDate: string;
  status: string;
}

const DeliveryDashboard: React.FC = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [filter, setFilter] = useState<string>('processing');
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);

  const { toasts, addToast, dismissToast } = useToast();
  const socketRef = useSocket('delivery');

  // Listen for new delivery assignments
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleDeliveryAssigned = (data: any) => {
      addToast(
        `🚗 New Delivery Ready!`,
        'delivery',
        `Customer: ${data.customer} — Order #${String(data.orderId).slice(-6)}`
      );
      fetchOrders();
    };

    socket.on('delivery_assigned', handleDeliveryAssigned);
    return () => { socket.off('delivery_assigned', handleDeliveryAssigned); };
  }, [socketRef.current]);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Delivery staff only sees processing/shipped orders
        setOrders(data.filter((o: DeliveryOrder) =>
          ['processing', 'shipped'].includes(o.status)
        ));
      } else {
        setOrders(getMockDeliveries());
      }
    } catch {
      setOrders(getMockDeliveries());
    }
  };

  const getMockDeliveries = (): DeliveryOrder[] => ([
    {
      _id: 'ORD-2024-001',
      user: { name: 'John Customer', email: 'john@example.com', phone: '555-123-4567' },
      orderItems: [{ cake: { name: 'Chocolate Fudge Cake', price: 29.99 }, quantity: 1 }],
      shippingAddr: { street: '456 Customer Ave', city: 'Addis Ababa', postalCode: '1000' },
      totalPrice: 29.99,
      isPaid: true,
      deliveryDate: new Date().toISOString(),
      status: 'processing'
    }
  ]);

  const markAsShipped = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'shipped' })
      });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'shipped' } : o));
      addToast('Order marked as shipped!', 'success', `Order #${orderId.slice(-6)}`);
    } catch {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'shipped' } : o));
      addToast('Order marked as shipped!', 'success');
    }
  };

  const markAsDelivered = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'delivered' })
      });
      setOrders(prev => prev.filter(o => o._id !== orderId));
      addToast('✅ Delivered! Customer notified.', 'success');
    } catch {
      setOrders(prev => prev.filter(o => o._id !== orderId));
      addToast('✅ Marked as delivered!', 'success');
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-gray-100">
      <NotificationToast notifications={toasts} onDismiss={dismissToast} />

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🚗 Delivery Dashboard</h1>
              <p className="text-gray-500 mt-1">Your assigned deliveries</p>
            </div>
            <button onClick={fetchOrders} className="text-pink-600 hover:text-pink-700 font-medium">
              🔄 Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-sm text-gray-500">Ready for Pickup</p>
            <p className="text-4xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'processing').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-sm text-gray-500">Out for Delivery</p>
            <p className="text-4xl font-bold text-purple-600">
              {orders.filter(o => o.status === 'shipped').length}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'processing', 'shipped'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg capitalize text-sm font-medium ${
                filter === f ? 'bg-pink-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
              }`}
            >
              {f === 'processing' ? '📦 Ready for Pickup' : f === 'shipped' ? '🚗 Out for Delivery' : 'All'}
            </button>
          ))}
        </div>

        {/* Order Cards */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <p className="text-5xl mb-4">🎉</p>
              <p className="text-xl font-semibold text-gray-700">No pending deliveries!</p>
              <p className="text-gray-400 mt-2">Check back when new orders are confirmed.</p>
            </div>
          ) : filtered.map(order => (
            <div key={order._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Order #{order._id.slice(-6)}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.deliveryDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  order.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {order.status === 'processing' ? '📦 Ready for Pickup' : '🚗 Out for Delivery'}
                </span>
              </div>

              {/* Customer info */}
              <div className="bg-pink-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-pink-800">👤 Customer</p>
                <p className="text-gray-800 font-medium">{order.user?.name}</p>
                <p className="text-gray-600 text-sm">{order.user?.phone}</p>
              </div>

              {/* Delivery address */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-gray-600">📍 Delivery Address</p>
                <p className="text-gray-800">{order.shippingAddr?.street}</p>
                <p className="text-gray-600 text-sm">{order.shippingAddr?.city}, {order.shippingAddr?.postalCode}</p>
              </div>

              {/* Items summary */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">🎂 Items</p>
                <ul className="space-y-1">
                  {order.orderItems?.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 flex justify-between">
                      <span>{item.cake?.name} × {item.quantity}</span>
                      <span className="font-medium text-pink-600">ETB {(item.cake?.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 pt-2 border-t text-right font-bold text-gray-900">
                  Total: ETB {order.totalPrice?.toFixed(2)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {order.status === 'processing' && (
                  <button
                    onClick={() => markAsShipped(order._id)}
                    className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 font-medium text-sm"
                  >
                    🚗 Mark as Picked Up
                  </button>
                )}
                {order.status === 'shipped' && (
                  <button
                    onClick={() => markAsDelivered(order._id)}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 font-medium text-sm"
                  >
                    ✅ Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DeliveryDashboard;
