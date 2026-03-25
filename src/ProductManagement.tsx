import React, { useState } from 'react';
import { useData } from './DataContext';
import { useAuth } from './AuthContext';
import { Search, Plus, Filter, Edit2, Trash2, X, AlertTriangle, CheckCircle2, Package, BarChart3 } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from './types';

export default function ProductManagement() {
  const { products, addProduct } = useData();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'Skincare',
    batch: '',
    mfgDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    price: 0,
    stock: 0,
    status: 'In Stock'
  });

  const canAddProduct = user?.role === 'Admin' || user?.role === 'Manufacturer';

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAddProduct) return;
    addProduct(newProduct);
    setIsModalOpen(false);
    setNewProduct({
      name: '',
      category: 'Skincare',
      batch: '',
      mfgDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      price: 0,
      stock: 0,
      status: 'In Stock'
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
            <Package className="w-3 h-3" />
            Inventory Control
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Product Catalog</h1>
          <p className="text-gray-500 font-medium">Manage your premium cosmetic portfolio with precision.</p>
        </div>
        
        <div className="flex gap-3">
          {canAddProduct && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between bg-gray-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, ID or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select className="px-5 py-3 border border-gray-200 rounded-2xl text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700">
              <option>All Categories</option>
              <option>Skincare</option>
              <option>Lips</option>
              <option>Eyes</option>
              <option>Face</option>
              <option>Fragrance</option>
            </select>
            <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-colors text-gray-700">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-[10px] uppercase font-black tracking-[0.15em] border-b border-gray-50">
                <th className="px-8 py-6">Product Details</th>
                <th className="px-8 py-6">Batch & Dates</th>
                <th className="px-8 py-6">Pricing</th>
                <th className="px-8 py-6">Inventory</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                        {product.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">{product.name}</p>
                        <p className="text-[10px] font-mono text-gray-400 uppercase">{product.id}</p>
                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-700">Batch: {product.batch}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                        <span>MFG: {product.mfgDate}</span>
                        <span className="text-gray-200">|</span>
                        <span>EXP: {product.expiryDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-gray-900">${product.price.toFixed(2)}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Unit Price</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full",
                            product.stock > 100 ? "bg-emerald-500" : product.stock > 20 ? "bg-amber-500" : "bg-rose-500"
                          )}
                          style={{ width: `${Math.min(100, (product.stock / 200) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-black text-gray-900">{product.stock}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      product.status === 'In Stock' ? "bg-emerald-100 text-emerald-700" :
                      product.status === 'Low Stock' ? "bg-amber-100 text-amber-700" :
                      "bg-rose-100 text-rose-700"
                    )}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {canAddProduct && (
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button className="p-2.5 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">New Product Entry</h2>
                  <p className="text-sm text-gray-400 font-medium">Add a new SKU to the AuraChain network.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleAddProduct} className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Product Name</label>
                    <input 
                      type="text" 
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold"
                      placeholder="e.g. Velvet Matte Foundation"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Category</label>
                    <select 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold appearance-none"
                    >
                      <option>Skincare</option>
                      <option>Lips</option>
                      <option>Eyes</option>
                      <option>Face</option>
                      <option>Fragrance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Batch ID</label>
                    <input 
                      type="text" 
                      required
                      value={newProduct.batch}
                      onChange={(e) => setNewProduct({...newProduct, batch: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold"
                      placeholder="B-2024-XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Unit Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={newProduct.price || ''}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value === '' ? 0 : parseFloat(e.target.value)})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Initial Stock</label>
                    <input 
                      type="number" 
                      required
                      value={newProduct.stock || ''}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value === '' ? 0 : parseInt(e.target.value)})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Manufacturing Date</label>
                    <input 
                      type="date" 
                      required
                      value={newProduct.mfgDate}
                      onChange={(e) => setNewProduct({...newProduct, mfgDate: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Expiry Date</label>
                    <input 
                      type="date" 
                      required
                      value={newProduct.expiryDate}
                      onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold"
                    />
                  </div>
                </div>
                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 border-2 border-gray-100 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-gray-400 hover:bg-gray-50 transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                  >
                    Register Product
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
