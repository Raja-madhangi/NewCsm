import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { cn } from './lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Boxes, 
  MapPin, 
  BarChart3, 
  CreditCard, 
  LogOut,
  Layout
} from 'lucide-react';
import NotificationCenter from './components/NotificationCenter';

const NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Products', icon: Package, path: '/products' },
  { name: 'Orders', icon: ShoppingCart, path: '/orders' },
  { name: 'Inventory', icon: Boxes, path: '/inventory' },
  { name: 'Shipment Tracking', icon: MapPin, path: '/shipments' },
  { name: 'Reports', icon: BarChart3, path: '/reports' },
  { name: 'Payments', icon: CreditCard, path: '/payments' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    
    switch (user.role) {
      case 'Manufacturer':
        return ['Dashboard', 'Products', 'Inventory', 'Orders'].includes(item.name);
      case 'Distributor':
        return ['Dashboard', 'Orders', 'Inventory'].includes(item.name);
      case 'Retailer':
        return ['Dashboard', 'Orders', 'Reports', 'Payments'].includes(item.name);
      default:
        return item.name === 'Dashboard';
    }
  });

  return (
    <aside className="w-64 bg-[#1a1c23] text-gray-400 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <Layout className="w-8 h-8 text-blue-500" />
        <div className="flex-1">
          <h1 className="text-white font-bold text-lg leading-tight">aurascm</h1>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Supply Chain System</p>
        </div>
        <NotificationCenter />
      </div>

      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
          {user?.name?.[0] || 'U'}
        </div>
        <div>
          <p className="text-white font-medium text-sm">{user?.name || 'User'}</p>
          <p className="text-xs text-blue-400">{user?.role || 'Role'}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <p className="px-2 text-[10px] uppercase font-bold tracking-widest text-gray-600 mb-2">Navigation</p>
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group",
              isActive 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "hover:bg-gray-800 hover:text-white"
            )}
          >
            <item.icon className={cn("w-5 h-5", "group-hover:scale-110 transition-transform")} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-all text-sm w-full group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  );
}
