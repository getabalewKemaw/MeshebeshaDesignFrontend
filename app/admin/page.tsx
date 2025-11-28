"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, ShoppingCart, Users, Star, DollarSign, MessageSquare, AlertTriangle, ShoppingBag } from "lucide-react";
import * as dashboardAPI from "@/lib/api/admin/dashboard";

const COLORS = ['#1E2A55', '#CFAE56', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminDashboard() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [overviewStats, setOverviewStats] = useState<dashboardAPI.OverviewStats | null>(null);
  const [revenueData, setRevenueData] = useState<dashboardAPI.RevenueDataPoint[]>([]);
  const [orderStats, setOrderStats] = useState<{ total: number; breakdown: dashboardAPI.OrderStatusBreakdown[] } | null>(null);
  const [topProducts, setTopProducts] = useState<dashboardAPI.TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<dashboardAPI.RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [overview, revenue, orders, products, recent] = await Promise.all([
          dashboardAPI.getOverviewStats(),
          dashboardAPI.getRevenueStats(30),
          dashboardAPI.getOrderStats(),
          dashboardAPI.getTopProducts(5),
          dashboardAPI.getRecentOrders(5),
        ]);

        if (overview.success && overview.data) setOverviewStats(overview.data);
        if (revenue.success && revenue.data) setRevenueData(revenue.data);
        if (orders.success && orders.data) setOrderStats(orders.data);
        if (products.success && products.data) setTopProducts(products.data);
        if (recent.success && recent.data) setRecentOrders(recent.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E2A55]"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const formatCurrency = (amount: number) => `ETB ${amount.toFixed(0)}`;

  // Prepare data for charts
  const revenueChartData = revenueData.slice(-14).map(point => ({
    date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: point.revenue,
    orders: point.orders,
  }));

  const orderPieData = orderStats?.breakdown.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
  })) || [];

  const productBarData = topProducts.map(product => ({
    name: product.title.length > 20 ? product.title.substring(0, 20) + '...' : product.title,
    sales: product.totalSales,
    revenue: product.totalRevenue,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#1E2A55] to-[#2A3A65] rounded-2xl shadow-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard 📊</h1>
        <p className="text-blue-100">Welcome back, {user?.name}! Here's your store analytics.</p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(overviewStats?.totalRevenue || 0)}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{overviewStats?.totalOrders || 0}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Products</p>
              <p className="text-2xl font-bold text-gray-900">{overviewStats?.totalProducts || 0}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Users</p>
              <p className="text-2xl font-bold text-gray-900">{overviewStats?.totalUsers || 0}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">New Orders Today</p>
            <p className="text-xl font-bold text-gray-900">{overviewStats?.newOrdersToday || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Unread Messages</p>
            <p className="text-xl font-bold text-gray-900">{overviewStats?.unreadMessages || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Low Stock Items</p>
            <p className="text-xl font-bold text-gray-900">{overviewStats?.lowStockItems || 0}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Line Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E2A55', border: 'none', borderRadius: '8px', color: 'white' }}
                formatter={(value: any) => formatCurrency(value)}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#1E2A55" strokeWidth={3} dot={{ fill: '#CFAE56', r: 5 }} name="Revenue (ETB)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent!* 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {orderPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Sales Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Top Products Performance</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={productBarData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
            <YAxis yAxisId="left" orientation="left" stroke="#1E2A55" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" stroke="#CFAE56" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1E2A55', border: 'none', borderRadius: '8px', color: 'white' }}
              formatter={(value: any, name: string) => [name === 'revenue' ? formatCurrency(value) : value, name === 'revenue' ? 'Revenue' : 'Sales']}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="sales" fill="#1E2A55" name="Units Sold" radius={[8, 8, 0, 0]} />
            <Bar yAxisId="right" dataKey="revenue" fill="#CFAE56" name="Revenue (ETB)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order #</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">#{order.orderNumber}</td>
                  <td className="py-3 px-4 text-gray-600">{order.customerName}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                      }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">{formatCurrency(order.total)}</td>
                  <td className="py-3 px-4 text-right text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
