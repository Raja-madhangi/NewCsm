import React, { useState } from 'react';
import { useData } from './DataContext';
import { useAuth } from './AuthContext';
import { MapPin, Navigation, Package, CheckCircle2, Clock, MoreVertical, Search, Filter, X, ArrowRight } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Shipment } from './types';

export default function ShipmentTracking() {
  const { shipments } = useData();
  const { user } = useAuth();
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const filteredShipments = shipments.filter(s => {
    if (user?.role === 'Admin') {
      return s.role === 'Distributor' || s.role === 'Retailer' || s.role === 'Admin';
    }
    return true;
  });

  const stats = [
    { label: 'Total Shipments', value: filteredShipments.length.toString(), icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Delivered', value: filteredShipments.filter(s => s.status === 'Delivered').length.toString(), icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'In Transit', value: filteredShipments.filter(s => s.status === 'In Transit').length.toString(), icon: Navigation, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Processing', value: filteredShipments.filter(s => s.progress < 10).length.toString(), icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipment Tracking</h1>
          <p className="text-gray-500 text-sm">Real-time, location-based tracking of product shipments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={stat.bg + " p-3 rounded-lg"}>
              <stat.icon className={"w-5 h-5 " + stat.color} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" /> Live Location Map
          </h2>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Live Tracking</span>
          </div>
        </div>
        <div className="h-[300px] bg-blue-50 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="w-full h-full border-2 border-dashed border-blue-200" />
          </div>
          <div className="text-center space-y-2 z-10">
            <MapPin className="w-12 h-12 text-blue-400 mx-auto animate-bounce" />
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">India - Supply Chain Network</p>
          </div>
          {filteredShipments.map((shipment, idx) => (
            <div 
              key={shipment.id}
              className="absolute p-2 bg-white rounded-full shadow-lg border-2 border-blue-500 z-20 cursor-pointer hover:scale-110 transition-transform"
              style={{ 
                left: `${20 + (idx % 4) * 20}%`, 
                top: `${30 + (idx % 3) * 20}%` 
              }}
              onClick={() => setSelectedShipment(shipment)}
            >
              <div className={cn(
                "w-4 h-4 rounded-full",
                shipment.status === 'Delivered' ? "bg-green-500" : "bg-blue-500"
              )} />
            </div>
          ))}
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md border border-gray-100 text-[10px] font-bold uppercase tracking-widest space-y-2">
            <p className="text-gray-400">Legend</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-gray-600">In Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-600">Delivered</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[10px] uppercase font-bold tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">FROM</th>
                <th className="px-6 py-4">To (Delivery Address)</th>
                {user?.role === 'Admin' && <th className="px-6 py-4">Role</th>}
                <th className="px-6 py-4">Live Location</th>
                <th className="px-6 py-4">Coordinates</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">{shipment.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{shipment.product}</td>
                  <td className="px-6 py-4 text-[10px] text-gray-500 leading-tight min-w-[200px]">{shipment.from}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 max-w-[150px] truncate">{shipment.to}</td>
                  {user?.role === 'Admin' && <td className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{shipment.role}</td>}
                  <td className="px-6 py-4 text-xs font-medium text-blue-600">{shipment.liveLocation}</td>
                  <td className="px-6 py-4 text-xs text-gray-400 font-mono">{shipment.coordinates.lat}°N, {shipment.coordinates.lng}°E</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000",
                            shipment.progress === 100 ? "bg-green-500" : "bg-blue-500"
                          )}
                          style={{ width: `${shipment.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-600">{shipment.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedShipment(shipment)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all ml-auto"
                    >
                      <Navigation className="w-3 h-3" /> Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedShipment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Shipment Details</h2>
                  <p className="text-sm text-gray-400 font-medium">Tracking ID: {selectedShipment.id}</p>
                </div>
                <button onClick={() => setSelectedShipment(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Product</p>
                        <p className="text-sm font-bold text-gray-900">{selectedShipment.product}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Live Location</p>
                        <p className="text-sm font-bold text-gray-900">{selectedShipment.liveLocation}</p>
                        <p className="text-xs text-gray-500">{selectedShipment.coordinates.lat}°N, {selectedShipment.coordinates.lng}°E</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <ArrowRight className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Route</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-gray-600">{selectedShipment.from}</span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="text-xs font-medium text-gray-600">{selectedShipment.to}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Overall Progress</p>
                        <p className="text-sm font-bold text-gray-900">{selectedShipment.progress}% Completed</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Tracking Timeline</h3>
                  <div className="relative space-y-8 before:absolute before:inset-0 before:left-[11px] before:w-0.5 before:bg-gray-100">
                    {selectedShipment.trackingHistory.map((step, idx) => (
                      <div key={idx} className="relative flex gap-6 items-start">
                        <div className={cn(
                          "w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 flex items-center justify-center",
                          step.completed ? "bg-blue-600" : "bg-gray-200"
                        )}>
                          {step.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className={cn(
                              "text-sm font-bold",
                              step.completed ? "text-gray-900" : "text-gray-400"
                            )}>
                              {step.status}
                            </p>
                            <span className="text-xs text-gray-400 font-medium">{step.time}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {step.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setSelectedShipment(null)}
                  className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
