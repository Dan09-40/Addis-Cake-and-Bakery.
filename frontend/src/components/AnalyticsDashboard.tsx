import React, { useState, useEffect } from 'react';

interface SalesData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  cakesSold: number;
}

interface MonthlySales {
  month: string;
  revenue: number;
  orders: number;
}

interface PopularCake {
  name: string;
  sold: number;
  revenue: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    cakesSold: 0
  });

  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([
    { month: 'Jan', revenue: 1250, orders: 45 },
    { month: 'Feb', revenue: 1580, orders: 52 },
    { month: 'Mar', revenue: 2100, orders: 68 },
    { month: 'Apr', revenue: 1890, orders: 61 },
    { month: 'May', revenue: 2350, orders: 75 },
    { month: 'Jun', revenue: 2800, orders: 89 }
  ]);

  const [popularCakes, setPopularCakes] = useState<PopularCake[]>([
    { name: 'Chocolate Fudge Cake', sold: 145, revenue: 4348.55 },
    { name: 'Vanilla Dream Cake', sold: 132, revenue: 3430.68 },
    { name: 'Red Velvet Elegance', sold: 98, revenue: 3233.02 },
    { name: 'Custom Birthday Cake', sold: 76, revenue: 3495.24 },
    { name: 'Strawberry Delight', sold: 65, revenue: 1819.35 }
  ]);

  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Mock data fetch
  useEffect(() => {
    // In real app, fetch from API with date range
    const mockData: SalesData = {
      totalRevenue: 12970,
      totalOrders: 390,
      averageOrderValue: 33.26,
      cakesSold: 516
    };
    setSalesData(mockData);
  }, [timeRange]);

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const maxRevenue = Math.max(...monthlySales.map(m => m.revenue));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your business performance</p>
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
        {/* Time Range Selector */}
        <div className="mb-8 flex justify-end">
          <div className="bg-white rounded-lg shadow p-2 inline-flex">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-4 py-2 rounded capitalize ${
                  timeRange === range
                    ? 'bg-pink-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${salesData.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  ↑ {calculateGrowth(salesData.totalRevenue, 11500)}% from last period
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{salesData.totalOrders}</p>
                <p className="text-sm text-green-600 mt-2">
                  ↑ {calculateGrowth(salesData.totalOrders, 350)}% from last period
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${salesData.averageOrderValue.toFixed(2)}
                </p>
                <p className="text-sm text-red-600 mt-2">
                  ↓ {calculateGrowth(salesData.averageOrderValue, 35)}% from last period
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cakes Sold</p>
                <p className="text-3xl font-bold text-gray-900">{salesData.cakesSold}</p>
                <p className="text-sm text-green-600 mt-2">
                  ↑ {calculateGrowth(salesData.cakesSold, 480)}% from last period
                </p>
              </div>
              <div className="bg-pink-100 rounded-full p-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Sales Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Sales Trend</h2>
            <div className="space-y-4">
              {monthlySales.map((month, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{month.month}</span>
                    <span className="text-gray-600">${month.revenue.toLocaleString()} ({month.orders} orders)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(month.revenue / maxRevenue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Cakes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Selling Cakes</h2>
            <div className="space-y-4">
              {popularCakes.map((cake, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-pink-100 text-pink-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{cake.name}</p>
                      <p className="text-sm text-gray-600">{cake.sold} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-600">${cake.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Customer Insights */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Insights</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Customers</span>
                <span className="font-bold text-gray-900">245</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Returning Customers</span>
                <span className="font-bold text-gray-900">145</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customer Retention</span>
                <span className="font-bold text-green-600">59.2%</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Rating</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-lg mr-2">★★★★★</span>
                    <span className="font-bold text-gray-900">4.8/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Inventory Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Available Cakes</span>
                  <span className="text-sm font-medium text-gray-900">42/50</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Low Stock Items</span>
                  <span className="text-sm font-medium text-orange-600">5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Out of Stock</span>
                  <span className="text-sm font-medium text-red-600">3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '6%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Goals */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Goals</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Revenue Target</span>
                  <span className="text-sm font-medium text-gray-900">$12,970 / $15,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '86.5%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">86.5% achieved</p>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Orders Target</span>
                  <span className="text-sm font-medium text-gray-900">390 / 500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">78% achieved</p>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Customer Satisfaction</span>
                  <span className="text-sm font-medium text-gray-900">4.8 / 5.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">96% achieved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: 'New order received', time: '5 minutes ago', type: 'order' },
              { action: 'Payment confirmed - Order #2024-045', time: '15 minutes ago', type: 'payment' },
              { action: 'Order #2024-043 shipped', time: '1 hour ago', type: 'shipping' },
              { action: 'New customer registered', time: '2 hours ago', type: 'customer' },
              { action: 'Product review received', time: '3 hours ago', type: 'review' }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border-l-4 border-pink-500 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'order' ? 'bg-blue-500' :
                    activity.type === 'payment' ? 'bg-green-500' :
                    activity.type === 'shipping' ? 'bg-purple-500' :
                    activity.type === 'customer' ? 'bg-pink-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-gray-900">{activity.action}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
