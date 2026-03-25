import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, ShoppingCart, DollarSign, Boxes, BarChart3, Download } from 'lucide-react';
import { motion } from 'motion/react';

const ORDER_STATUS_DATA = [
  { name: 'Delivered', value: 1, color: '#10b981' },
  { name: 'Approved', value: 2, color: '#3b82f6' },
  { name: 'Pending', value: 2, color: '#f59e0b' },
];

const CATEGORY_PERFORMANCE = [
  { name: 'Face', value: 5750 },
  { name: 'Skincare', value: 3450 },
  { name: 'Fragrance', value: 1950 },
  { name: 'Eyes', value: 1650 },
  { name: 'Lips', value: 949.5 },
];

const TOP_SELLING = [
  { name: 'Foundation - Warm Beige', sales: 200, revenue: 5750 },
  { name: 'Hydrating Face Serum', sales: 100, revenue: 3450 },
  { name: 'Rose Petal Perfume', sales: 30, revenue: 1950 },
  { name: 'Volumizing Mascara', sales: 75, revenue: 1650 },
  { name: 'Matte Lipstick - Ruby Red', sales: 50, revenue: 949.5 },
];

const REVENUE_TREND = [
  { name: 'Jan', revenue: 4500, forecast: 4500 },
  { name: 'Feb', revenue: 5200, forecast: 5200 },
  { name: 'Mar', revenue: 4800, forecast: 4800 },
  { name: 'Apr', revenue: 6100, forecast: 6100 },
  { name: 'May', revenue: 5900, forecast: 5900 },
  { name: 'Jun', revenue: 7200, forecast: 7200 },
  { name: 'Jul', forecast: 8100 },
  { name: 'Aug', forecast: 8900 },
  { name: 'Sep', forecast: 9500 },
];

export default function Reports() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analytics & Intelligence</h1>
          <p className="text-gray-500 font-medium">Advanced data visualization and AI-driven forecasting.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$18,749.5', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+24.5%', up: true },
          { label: 'Order Volume', value: '1,240', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50', change: '+12.2%', up: true },
          { label: 'Avg. Order Value', value: '$1,240', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', change: '-2.4%', up: false },
          { label: 'Inventory Value', value: '$42,800', icon: Boxes, color: 'text-amber-600', bg: 'bg-amber-50', change: '+5.1%', up: true },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={stat.bg + " p-3 rounded-xl"}>
                <stat.icon className={"w-6 h-6 " + stat.color} />
              </div>
              <span className={`text-xs font-bold ${stat.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Revenue Forecast (AI Projected)</h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_TREND}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="forecast" stroke="#818CF8" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorForecast)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex items-center gap-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Actual Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-400" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Forecast</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Order Status</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ORDER_STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {ORDER_STATUS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-4">
            {ORDER_STATUS_DATA.map((status) => (
              <div key={status.name} className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-sm font-bold text-gray-700">{status.name}</span>
                </div>
                <span className="text-sm font-black text-gray-900">{status.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Category Performance</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_PERFORMANCE} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} />
                <Bar dataKey="value" fill="#2563EB" radius={[0, 8, 8, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Inventory Health</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Stock', value: '870', sub: 'Units', color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Low Stock', value: '4', sub: 'SKUs', color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Out of Stock', value: '1', sub: 'SKU', color: 'text-rose-600', bg: 'bg-rose-50' },
              { label: 'Expiring Soon', value: '12', sub: 'Units', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            ].map((item) => (
              <div key={item.label} className={`${item.bg} p-6 rounded-2xl border border-transparent hover:border-gray-200 transition-all`}>
                <h4 className={`text-3xl font-black ${item.color}`}>{item.value}</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{item.label}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
