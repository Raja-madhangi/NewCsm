import React, { useState, useEffect } from 'react';
import { useData } from './DataContext';
import { useAuth } from './AuthContext';
import { Search, Plus, Filter, MapPin, CheckCircle2, Clock, XCircle, X, Navigation } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from './types';

export default function OrderManagement() {
  const { orders, products, addOrder, cancelOrder, updateOrderStatus } = useData();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newOrder, setNewOrder] = useState({
    product: '',
    quantity: 1,
    orderedBy: '',
    to: '',
    total: 0,
    role: 'Retailer' as UserRole
  });

  useEffect(() => {
    if (user) {
      const initialRole = (user.role === 'Distributor' || user.role === 'Retailer') 
        ? user.role 
        : 'Retailer';
      
      setNewOrder(prev => ({ ...prev, role: initialRole }));
      if (user.role !== 'Admin') {
        setNewOrder(prev => ({ ...prev, orderedBy: user.name }));
      }
    }
  }, [user]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.to.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (!user || user.role === 'Admin') return true;

    if (user.role === 'Manufacturer') {
      // Manufacturer processes distributor orders
      return order.role === 'Distributor';
    }
    if (user.role === 'Distributor') {
      // Distributor only sees orders from retailers (their customers)
      return order.role === 'Retailer';
    }
    if (user.role === 'Retailer') {
      // Retailer orders products AND sees admin orders
      return order.role === 'Retailer' || order.role === 'Admin';
    }
    return false;
  });

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.name === newOrder.product);
    const total = product ? product.price * newOrder.quantity : 0;
    addOrder({ ...newOrder, total });
    setIsModalOpen(false);
    const initialRole = (user?.role === 'Distributor' || user?.role === 'Retailer') 
      ? user.role 
      : 'Retailer';

    setNewOrder({ 
      product: '', 
      quantity: 1, 
      orderedBy: user?.role === 'Admin' ? '' : (user?.name || ''), 
      to: '', 
      total: 0, 
      role: initialRole
    });
  };

  const handleCancelClick = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order? This will revert stock changes.')) {
      cancelOrder(orderId);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 text-sm">Place, track, and manage orders across the supply chain</p>
        </div>
        {user?.role !== 'Manufacturer' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Place New Order
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[10px] uppercase font-bold tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Ordered By</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">FROM</th>
                <th className="px-6 py-4">To (Delivery)</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Shipment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">{order.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.product}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.orderedBy}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{order.role}</td>
                  <td className="px-6 py-4 text-[10px] text-gray-500 leading-tight min-w-[200px]">{order.from}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 max-w-[150px] truncate">{order.to}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      order.status === 'Delivered' ? "bg-green-100 text-green-700" :
                      order.status === 'Approved' ? "bg-blue-100 text-blue-700" :
                      order.status === 'Cancelled' ? "bg-red-100 text-red-700" :
                      order.status === 'Pending Payment' ? "bg-purple-100 text-purple-700" :
                      "bg-orange-100 text-orange-700"
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-blue-600">
                      <MapPin className="w-3 h-3" />
                      {order.shipmentStatus}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === 'Pending Payment' && (
                        <div className="flex items-center gap-2">
                          <span className="text-purple-600 text-[10px] font-bold uppercase italic">On Hold</span>
                          {user?.role === 'Admin' && (
                            <button 
                              onClick={() => handleCancelClick(order.id)}
                              className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition-all flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" /> Cancel
                            </button>
                          )}
                        </div>
                      )}
                      {order.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'Approved')}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleCancelClick(order.id)}
                            className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition-all flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" /> Cancel
                          </button>
                        </>
                      )}
                      {order.status === 'Approved' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'Delivered')}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-all"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {order.status === 'Delivered' && (
                        <span className="text-gray-400 text-xs font-bold">Completed</span>
                      )}
                      {order.status === 'Cancelled' && (
                        <span className="text-red-400 text-xs font-bold">Cancelled</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Place New Order</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handlePlaceOrder} className="p-6 space-y-4">
                <div className="space-y-4">
                  <div>
                    <select 
                      required
                      value={newOrder.product}
                      onChange={(e) => setNewOrder({...newOrder, product: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-sm font-medium"
                    >
                      <option value="">Select a product</option>
                      {products.map(p => (
                        <option key={p.id} value={p.name}>{p.name} ({p.category})</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-blue-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Ships From:</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">aurascm Manufacturing Unit, Mumbai</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">Plot No. 47, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Quantity</label>
                    <input 
                      type="number" 
                      min="1"
                      required
                      value={newOrder.quantity || ''}
                      onChange={(e) => setNewOrder({...newOrder, quantity: e.target.value === '' ? 0 : parseInt(e.target.value)})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                      {user?.role === 'Retailer' ? 'Ordered By (Name)' : 'Ordered By (Company Name)'}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={newOrder.orderedBy}
                      onChange={(e) => setNewOrder({...newOrder, orderedBy: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                      placeholder={user?.role === 'Retailer' ? "e.g., John Doe" : "e.g., GlamStore Pvt Ltd"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Delivery Address (Full Address with Pincode)</label>
                    <textarea 
                      required
                      value={newOrder.to}
                      onChange={(e) => setNewOrder({...newOrder, to: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none text-sm"
                      placeholder="e.g., Shop No. 5, Anna Salai, T. Nagar, Chennai - 600017, Tamil Nadu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Role</label>
                    <select 
                      value={newOrder.role}
                      onChange={(e) => setNewOrder({...newOrder, role: e.target.value as UserRole})}
                      className={cn(
                        "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-sm",
                        user?.role !== 'Admin' && "bg-gray-50 cursor-not-allowed"
                      )}
                      disabled={user?.role !== 'Admin'}
                    >
                      <option value="Retailer">Retailer</option>
                      <option value="Distributor">Distributor</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-2.5 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4 rotate-90" /> Place Order & Create Shipment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
