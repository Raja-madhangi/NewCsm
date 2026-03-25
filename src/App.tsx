import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { DataProvider } from './DataContext';
import LoginPage from './LoginPage';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import InventoryManagement from './InventoryManagement';
import ShipmentTracking from './ShipmentTracking';
import Reports from './Reports';
import PaymentGateway from './PaymentGateway';
import { Search, Bell, User } from 'lucide-react';

function Header() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-right hidden md:block">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{today}</p>
          <p className="text-xs text-gray-600 font-medium">Logged in as: <span className="text-blue-600 font-bold">{user?.role}</span></p>
        </div>
        <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
          {user?.name?.[0]}
        </div>
      </div>
    </header>
  );
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<AuthenticatedLayout><Dashboard /></AuthenticatedLayout>} />
            <Route path="/products" element={<AuthenticatedLayout><ProductManagement /></AuthenticatedLayout>} />
            <Route path="/orders" element={<AuthenticatedLayout><OrderManagement /></AuthenticatedLayout>} />
            <Route path="/inventory" element={<AuthenticatedLayout><InventoryManagement /></AuthenticatedLayout>} />
            <Route path="/shipments" element={<AuthenticatedLayout><ShipmentTracking /></AuthenticatedLayout>} />
            <Route path="/reports" element={<AuthenticatedLayout><Reports /></AuthenticatedLayout>} />
            <Route path="/payments" element={<AuthenticatedLayout><PaymentGateway /></AuthenticatedLayout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}
