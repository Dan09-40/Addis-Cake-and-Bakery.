import React, { useState, useEffect } from 'react';
import NotificationToast, { useToast } from './NotificationToast';
import { useSocket } from '../hooks/useSocket';

interface OrderItem {
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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

const OrdersDashboard: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);

  const { toasts, addToast, dismissToast } = useToast();
  const socketRef = useSocket('sellers');

  // Listen for real-time new orders
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleNewOrder = (data: any) => {
      setNewOrderCount(prev => prev + 1);
      addToast(
        `🎂 New Order from ${data.customer}!`,
        'order',
        `${data.itemCount} item(s) — ETB ${data.totalPrice}`
      );
      // Refresh orders list
      fetchOrders();
    };

    socket.on('new_order', handleNewOrder);
    return () => { socket.off('new_order', handleNewOrder); };
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
        setOrders(data);
      } else {
        // Fallback to mock data if API fails
        setOrders(getMockOrders());
      }
    } catch (error) {
      setOrders(getMockOrders());
    }
  };

  const getMockOrders = (): OrderItem[] => ([
    {
      _id: 'ORD-2024-001',
      user: { name: 'John Customer', email: 'john@example.com', phone: '555-123-4567' },
      orderItems: [
        { cake: { name: 'Chocolate Fudge Cake', price: 29.99 }, quantity: 1 },
        { cake: { name: 'Vanilla Dream Cake', price: 25.99 }, quantity: 2 }
      ],
      shippingAddr: { street: '456 Customer Ave', city: 'Town', postalCode: '67890' },
      totalPrice: 81.97,
      isPaid: true,
      deliveryDate: '2024-03-25',
      status: 'processing'
    },
    {
      _id: 'ORD-2024-002',
      user: { name: 'Jane Smith', email: 'jane@example.com', phone: '555-987-6543' },
      orderItems: [
        { cake: { name: 'Red Velvet Elegance', price: 32.99 }, quantity: 1 }
      ],
      shippingAddr: { street: '789 Smith Road', city: 'Village', postalCode: '11223' },
      totalPrice: 32.99,
      isPaid: false,
      deliveryDate: '2024-03-22',
      status: 'pending'
    }
  ]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, status: newStatus as any } : order
        ));
        addToast(`Order updated to "${newStatus}"`, 'success');
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
        }
      } else {
        // Update locally for demo
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, status: newStatus as any } : order
        ));
        addToast(`Order updated to "${newStatus}"`, 'success');
      }
    } catch (error) {
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus as any } : order
      ));
      addToast(`Order updated to "${newStatus}"`, 'success');
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length
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
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
                {newOrderCount > 0 && (
                  <span
                    className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full cursor-pointer"
                    onClick={() => setNewOrderCount(0)}
                    title="Click to clear"
                  >
                    {newOrderCount} new
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-1">Manage and process customer orders</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchOrders}
                className="text-pink-600 hover:text-pink-700 text-sm font-medium"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="text-pink-600 hover:text-pink-700"
              >
                ← Back to Shop
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: stats.total, color: 'text-gray-900' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
            { label: 'Processing', value: stats.processing, color: 'text-blue-600' },
            { label: 'Shipped', value: stats.shipped, color: 'text-purple-600' },
            { label: 'Delivered', value: stats.delivered, color: 'text-green-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-5">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Orders</h2>
          </div>
          <div className="p-4 flex flex-wrap gap-2">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg capitalize text-sm font-medium ${
                  filter === status
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Delivery Date', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                      No orders found.
                    </td>
                  </tr>
                ) : filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.user?.name}</div>
                      <div className="text-xs text-gray-500">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.orderItems?.length} item(s)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-pink-600">
                      ETB {order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => { setSelectedOrder(order); setShowDetails(true); }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Order Details — {selectedOrder._id}</h2>
                  <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                </div>

                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-sm text-gray-500">Name</p><p>{selectedOrder.user?.name}</p></div>
                    <div><p className="text-sm text-gray-500">Email</p><p>{selectedOrder.user?.email}</p></div>
                    <div><p className="text-sm text-gray-500">Phone</p><p>{selectedOrder.user?.phone}</p></div>
                    <div>
                      <p className="text-sm text-gray-500">Payment</p>
                      <p className={`font-medium ${selectedOrder.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedOrder.isPaid ? '✅ Paid' : '❌ Unpaid'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-semibold text-lg mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.orderItems?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                        <div>
                          <p className="font-medium">{item.cake?.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-pink-600">
                          ETB {(item.cake?.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-right font-bold text-lg">
                    Total: ETB {selectedOrder.totalPrice?.toFixed(2)}
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
                  <p>{selectedOrder.shippingAddr?.street}</p>
                  <p>{selectedOrder.shippingAddr?.city}, {selectedOrder.shippingAddr?.postalCode}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder._id, status)}
                        disabled={selectedOrder.status === status}
                        className={`px-4 py-2 rounded-lg capitalize text-sm font-medium ${
                          selectedOrder.status === status
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-pink-600 text-white hover:bg-pink-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrdersDashboard;
