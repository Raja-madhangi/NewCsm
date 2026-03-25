import React from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import { 
  Package, 
  Boxes, 
  Clock, 
  AlertTriangle, 
  Plus, 
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const { products, orders, payments } = useData();
  const navigate = useNavigate();

  const pendingOrders = orders.filter(o => {
    if (user?.role === 'Manufacturer') return o.status === 'Pending' && o.role === 'Distributor';
    if (user?.role === 'Distributor') return o.status === 'Pending' && (o.role === 'Retailer' || o.role === 'Distributor');
    if (user?.role === 'Retailer') return o.status === 'Pending' && (o.role === 'Retailer' || o.role === 'Admin');
    return o.status === 'Pending';
  }).length;

  const lowStockItems = products.filter(p => p.status === 'Low Stock').length;
  const outOfStockItems = products.filter(p => p.status === 'Out of Stock').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

  const STATS = [
    { label: 'Total Products', value: products.length.toString(), icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'All products', trend: '+12%', trendUp: true },
    { label: 'Stock Available', value: products.reduce((acc, p) => acc + p.stock, 0).toString(), icon: Boxes, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'Units in inventory', trend: '-5%', trendUp: false },
    { label: 'Pending Orders', value: pendingOrders.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Awaiting processing', trend: '+8%', trendUp: true },
    { label: 'Low Stock Items', value: lowStockItems.toString(), icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', sub: 'Need restocking', trend: '+2', trendUp: false },
  ];

  const chartData = [
    { name: 'Jan', orders: 40, revenue: 2400 },
    { name: 'Feb', orders: 30, revenue: 1398 },
    { name: 'Mar', orders: 20, revenue: 9800 },
    { name: 'Apr', orders: 27, revenue: 3908 },
    { name: 'May', orders: 18, revenue: 4800 },
    { name: 'Jun', orders: 23, revenue: 3800 },
  ];

  const stockData = products.slice(0, 5).map(p => ({
    name: p.name.split(' - ')[0],
    stock: p.stock
  }));

  const RECENT_ACTIVITY = orders.slice(0, 5).map((order, idx) => ({
    id: idx,
    text: `Order ${order.id} for ${order.product} is ${order.status}`,
    time: '2h ago'
  }));

  const QUICK_NAV = [
    { name: 'Manage Products', path: '/products', roles: ['Admin', 'Manufacturer'] },
    { name: 'View Orders', path: '/orders', roles: ['Admin', 'Manufacturer', 'Distributor', 'Retailer'] },
    { name: 'Track Shipments', path: '/shipments', roles: ['Admin', 'Manufacturer', 'Distributor', 'Retailer'] },
  ].filter(nav => !nav.roles || nav.roles.includes(user?.role || ''));

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Supply Chain Overview</h1>
          <p className="text-gray-500 mt-1 font-medium">Welcome back, <span className="text-blue-600">{user?.name}</span>. Here's your real-time status.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-700 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={stat.bg + " p-3 rounded-xl group-hover:scale-110 transition-transform"}>
                <stat.icon className={"w-6 h-6 " + stat.color} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 tabular-nums">{stat.value}</h3>
              <p className="text-sm text-gray-500 font-semibold mt-1">{stat.label}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Revenue & Orders Trend</h2>
            <select className="bg-gray-50 border-none rounded-lg text-xs font-bold px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Top Products Stock</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="stock" radius={[0, 4, 4, 0]} barSize={20}>
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563EB' : '#818CF8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> Recent Activity
            </h2>
            <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex justify-between items-center group cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-bold">{activity.text}</p>
                    <p className="text-xs text-gray-400 font-medium">{activity.time}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Quick Navigation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUICK_NAV.map((nav) => (
              <button 
                key={nav.name}
                onClick={() => navigate(nav.path)}
                className="flex flex-col items-start p-5 rounded-2xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
              >
                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-100 mb-3 transition-colors">
                  <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                </div>
                <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{nav.name}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-bold">Access Module</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
