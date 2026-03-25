import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, Shipment, Payment, Notification, UserRole } from './types';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_SHIPMENTS, MOCK_PAYMENTS } from './mockData';

interface DataContextType {
  products: Product[];
  orders: Order[];
  shipments: Shipment[];
  payments: Payment[];
  notifications: Notification[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  addOrder: (order: Omit<Order, 'id' | 'from' | 'date' | 'status' | 'shipmentStatus' | 'paymentStatus'>) => void;
  cancelOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  processPayment: (paymentId: string, method?: string) => void;
  remindPayment: (paymentId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `NOTIF-${Date.now()}`,
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = `COS-${String(products.length + 1).padStart(3, '0')}`;
    setProducts([...products, { ...newProduct, id }]);
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'from' | 'date' | 'status' | 'shipmentStatus' | 'paymentStatus'>) => {
    const id = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
    const isByAdmin = orderData.role === 'Admin';
    
    const newOrder: Order = {
      ...orderData,
      id,
      from: (orderData.role === 'Distributor' || isByAdmin) ? 'aurascm Manufacturing Unit, Mumbai, Plot No. 47, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra' : 'Regional Distribution Center',
      date: new Date().toISOString().split('T')[0],
      status: isByAdmin ? 'Approved' : 'Pending Payment',
      shipmentStatus: isByAdmin ? 'Tracking Active' : 'No shipment',
      paymentStatus: isByAdmin ? 'Paid' : 'Unpaid',
    };
    setOrders([newOrder, ...orders]);

    // Create Shipment for Admin orders immediately
    if (isByAdmin) {
      const newShipment: Shipment = {
        id: `SHP-${String(shipments.length + 1).padStart(3, '0')}`,
        product: newOrder.product,
        from: newOrder.from,
        to: newOrder.to,
        liveLocation: 'Processing at Facility',
        coordinates: { lat: 19.0760, lng: 72.8777 },
        progress: 5,
        status: 'In Transit',
        role: 'Admin',
        trackingHistory: [
          { status: 'Order Approved', location: newOrder.from, time: 'Just Now', completed: true },
          { status: 'Processing', location: newOrder.from, time: 'Pending', completed: false },
        ]
      };
      setShipments(prev => [newShipment, ...prev]);
    }

    // Notify relevant role
    if (orderData.role === 'Retailer') {
      addNotification({
        role: 'Distributor',
        message: `New order ${id} placed by ${orderData.orderedBy}`,
        type: 'Order',
        orderId: id
      });
    } else if (orderData.role === 'Distributor') {
      addNotification({
        role: 'Manufacturer',
        message: `New order ${id} placed by Distributor ${orderData.orderedBy}`,
        type: 'Order',
        orderId: id
      });
    }

    // Create corresponding Payment
    const newPayment: Payment = {
      id: `TXN-${String(payments.length + 1).padStart(3, '0')}`,
      orderId: id,
      from: orderData.orderedBy,
      to: orderData.role === 'Retailer' ? 'Regional Distributor' : 'aurascm Mfg.',
      amount: orderData.total,
      date: new Date().toISOString().split('T')[0],
      method: 'Pending',
      status: 'Unpaid',
      role: orderData.role
    };
    setPayments([newPayment, ...payments]);

    // Update stock
    setProducts(prev => prev.map(p => {
      if (p.name === orderData.product) {
        const newStock = Math.max(0, p.stock - orderData.quantity);
        return {
          ...p,
          stock: newStock,
          status: newStock === 0 ? 'Out of Stock' : newStock < 20 ? 'Low Stock' : 'In Stock'
        };
      }
      return p;
    }));
  };

  const cancelOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));

    // Notify
    addNotification({
      role: order.role,
      message: `Order ${orderId} has been cancelled by Admin`,
      type: 'Order',
      orderId
    });

    // Revert stock
    setProducts(prev => prev.map(p => {
      if (p.name === order.product) {
        const newStock = p.stock + order.quantity;
        return {
          ...p,
          stock: newStock,
          status: newStock === 0 ? 'Out of Stock' : newStock < 20 ? 'Low Stock' : 'In Stock'
        };
      }
      return p;
    }));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

    // Notify
    let targetRole: UserRole | undefined;
    if (order.role === 'Retailer') targetRole = 'Retailer';
    if (order.role === 'Distributor') targetRole = 'Distributor';

    if (targetRole) {
      addNotification({
        role: targetRole,
        message: `Order ${orderId} status updated to ${status}`,
        type: 'Order',
        orderId
      });
    }

    if (status === 'Approved') {
      // Create corresponding Shipment
      const newShipment: Shipment = {
        id: `SHP-${String(shipments.length + 1).padStart(3, '0')}`,
        product: order.product,
        from: order.from,
        to: order.to,
        liveLocation: 'Processing at Facility',
        coordinates: { lat: 19.0760, lng: 72.8777 },
        progress: 5,
        status: 'In Transit',
        role: order.role,
        trackingHistory: [
          { status: 'Order Approved', location: order.from, time: 'Just Now', completed: true },
          { status: 'Processing', location: order.from, time: 'Pending', completed: false },
        ]
      };
      setShipments([newShipment, ...shipments]);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, shipmentStatus: 'Tracking Active' } : o));
    }
  };

  const processPayment = (paymentId: string, method: string = 'Online Payment') => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    setPayments(prev => prev.map(p => 
      p.id === paymentId ? { ...p, status: 'Paid', method } : p
    ));

    setOrders(prev => prev.map(o => 
      o.id === payment.orderId ? { ...o, paymentStatus: 'Paid', status: 'Pending' } : o
    ));

    // Notify
    let targetRole: UserRole | undefined;
    if (payment.role === 'Retailer') targetRole = 'Distributor';
    if (payment.role === 'Distributor') targetRole = 'Manufacturer';

    if (targetRole) {
      addNotification({
        role: targetRole,
        message: `Payment received for order ${payment.orderId} from ${payment.from}`,
        type: 'Payment',
        orderId: payment.orderId
      });
    }
  };

  const remindPayment = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    addNotification({
      role: payment.role,
      message: `Admin Reminder: Please complete payment ${paymentId} for order ${payment.orderId}`,
      type: 'Payment',
      orderId: payment.orderId
    });
  };

  return (
    <DataContext.Provider value={{ 
      products, 
      orders, 
      shipments, 
      payments, 
      notifications,
      addProduct, 
      addOrder, 
      cancelOrder, 
      updateOrderStatus,
      processPayment,
      remindPayment,
      markNotificationRead,
      addNotification
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
