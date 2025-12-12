"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, ShoppingCart, Users, DollarSign, MessageSquare, AlertTriangle, ShoppingBag, TrendingUp, Activity } from "lucide-react";
import * as dashboardAPI from "@/lib/api/admin/dashboard";

const COLORS = ['#310101', '#CFAE56', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#310101]/20 border-t-[#310101] mx-auto"></div>
            <Activity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-[#310101] animate-pulse" />
          </div>
          <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading dashboard...</p>
        </div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Welcome Section - Animated */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#310101] via-[#500202] to-[#310101] rounded-2xl shadow-2xl p-8 mb-8 text-white animate-[slideDown_0.6s_ease-out]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_infinite]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-8 w-8 animate-pulse" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-red-100">Welcome back, {user?.name}! Here's your store analytics.</p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Key Metrics Overview - Staggered Animation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: formatCurrency(overviewStats?.totalRevenue || 0), icon: DollarSign, color: "from-purple-500 to-purple-600", delay: "0s" },
          { label: "Total Orders", value: overviewStats?.totalOrders || 0, icon: ShoppingCart, color: "from-green-500 to-green-600", delay: "0.1s" },
          { label: "Products", value: overviewStats?.totalProducts || 0, icon: Package, color: "from-blue-500 to-blue-600", delay: "0.2s" },
          { label: "Users", value: overviewStats?.totalUsers || 0, icon: Users, color: "from-orange-500 to-orange-600", delay: "0.3s" }
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-[fadeInUp_0.6s_ease-out] group"
            style={{ animationDelay: stat.delay }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 animate-[countUp_1s_ease-out]">{stat.value}</p>
              </div>
              <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Items - Pulse Animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "New Orders Today", value: overviewStats?.newOrdersToday || 0, icon: ShoppingBag, color: "green", delay: "0.4s" },
          { label: "Unread Messages", value: overviewStats?.unreadMessages || 0, icon: MessageSquare, color: "blue", delay: "0.5s" },
          { label: "Low Stock Items", value: overviewStats?.lowStockItems || 0, icon: AlertTriangle, color: "red", delay: "0.6s" }
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center gap-4 animate-[fadeInUp_0.6s_ease-out] group cursor-pointer"
            style={{ animationDelay: item.delay }}
          >
            <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
              <item.icon className={`w-6 h-6 text-${item.color}-600`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{item.label}</p>
              <p className="text-xl font-bold text-gray-900">{item.value}</p>
            </div>
            {item.value > 0 && (
              <div className="ml-auto">
                <span className={`inline-block w-2 h-2 bg-${item.color}-500 rounded-full animate-ping`}></span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts Section - Slide In Animation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Line Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-[slideInLeft_0.8s_ease-out] border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-[#310101]" />
            <h3 className="text-lg font-bold text-gray-900">Revenue Trend (Last 14 Days)</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#310101', border: 'none', borderRadius: '12px', color: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}
                formatter={(value: any) => formatCurrency(value)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#310101"
                strokeWidth={3}
                dot={{ fill: '#CFAE56', r: 6, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 3 }}
                name="Revenue (ETB)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-[slideInRight_0.8s_ease-out] border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-[#310101]" />
            <h3 className="text-lg font-bold text-gray-900">Order Status Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {orderPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#310101', border: 'none', borderRadius: '12px', color: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Sales Bar Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 hover:shadow-xl transition-all duration-300 animate-[fadeInUp_0.8s_ease-out] border border-gray-100" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-[#310101]" />
          <h3 className="text-lg font-bold text-gray-900">Top Products Performance</h3>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={productBarData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
            <YAxis yAxisId="left" orientation="left" stroke="#310101" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" stroke="#CFAE56" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#310101', border: 'none', borderRadius: '12px', color: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}
              formatter={(value: any, name: string) => [name === 'revenue' ? formatCurrency(value) : value, name === 'revenue' ? 'Revenue' : 'Sales']}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="sales" fill="#310101" name="Units Sold" radius={[8, 8, 0, 0]} animationDuration={1000} />
            <Bar yAxisId="right" dataKey="revenue" fill="#CFAE56" name="Revenue (ETB)" radius={[8, 8, 0, 0]} animationDuration={1000} animationBegin={200} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-[fadeInUp_0.8s_ease-out] border border-gray-100" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="h-5 w-5 text-[#310101]" />
          <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order #</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-[#310101]/5 hover:to-transparent transition-all duration-200 animate-[fadeIn_0.5s_ease-out]"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <td className="py-3 px-4 font-medium text-gray-900">#{order.orderNumber}</td>
                  <td className="py-3 px-4 text-gray-600">{order.customerName}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                      }`}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
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

      {/* Add keyframe animations to globals.css */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes countUp {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
