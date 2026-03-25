import React from 'react';
import { useData } from './DataContext';
import { useAuth } from './AuthContext';
import { Boxes, AlertTriangle, Clock, Search, Filter, MoreVertical, Layout } from 'lucide-react';
import { cn } from './lib/utils';

export default function InventoryManagement() {
  const { products } = useData();
  const { user } = useAuth();

  const lowStockCount = products.filter(p => p.status === 'Low Stock').length;
  const outOfStockCount = products.filter(p => p.status === 'Out of Stock').length;
  const expiringSoonCount = products.filter(p => new Date(p.expiryDate) < new Date('2024-12-31')).length;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 text-sm">Monitor stock levels and expiry warnings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Low Stock Items', value: lowStockCount.toString(), icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
          { label: 'Out of Stock', value: outOfStockCount.toString(), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
          { label: 'Expiring Within 90 Days', value: expiringSoonCount.toString(), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className={stat.bg + " p-4 rounded-lg"}>
              <stat.icon className={"w-8 h-8 " + stat.color} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[10px] uppercase font-bold tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Product ID</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Alerts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">{product.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500">{product.batch}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{product.expiryDate}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      product.status === 'In Stock' ? "bg-green-100 text-green-700" :
                      product.status === 'Low Stock' ? "bg-orange-100 text-orange-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {product.status === 'Out of Stock' && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase tracking-wider">
                          <AlertTriangle className="w-3 h-3" /> Out of Stock
                        </div>
                      )}
                      {product.status === 'Low Stock' && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </div>
                      )}
                      {new Date(product.expiryDate) < new Date('2024-12-31') && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-wider">
                          <Clock className="w-3 h-3" /> Expiring Soon
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
