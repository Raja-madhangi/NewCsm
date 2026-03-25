import React, { useState } from 'react';
import { useData } from '../DataContext';
import { useAuth } from '../AuthContext';
import { Bell, X, Check, Info, CreditCard, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function NotificationCenter() {
  const { notifications, markNotificationRead } = useData();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const userNotifications = notifications.filter(n => {
    if (!user) return false;
    
    // If the notification is targeted to a specific role or user ID
    if (n.role || n.userId) {
      return n.role === user.role || n.userId === user.id;
    }
    
    // General system notifications (no target role/userId) are visible to Admin
    return user.role === 'Admin';
  });

  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {unreadCount} New
                </span>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {userNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bell className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {userNotifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className={cn(
                          "p-4 hover:bg-gray-50 transition-colors relative group",
                          !notif.read && "bg-blue-50/30"
                        )}
                      >
                        <div className="flex gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            notif.type === 'Order' ? "bg-orange-100 text-orange-600" :
                            notif.type === 'Payment' ? "bg-green-100 text-green-600" :
                            "bg-blue-100 text-blue-600"
                          )}>
                            {notif.type === 'Order' ? <ShoppingBag className="w-4 h-4" /> :
                             notif.type === 'Payment' ? <CreditCard className="w-4 h-4" /> :
                             <Info className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 font-medium leading-tight">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1 font-medium">
                              {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {!notif.read && (
                            <button 
                              onClick={() => markNotificationRead(notif.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-100 rounded text-blue-600 transition-all"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {userNotifications.length > 0 && (
                <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                  <button className="text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">
                    View All Activity
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
