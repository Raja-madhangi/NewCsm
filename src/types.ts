export type UserRole = 'Admin' | 'Manufacturer' | 'Distributor' | 'Retailer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  batch: string;
  mfgDate: string;
  expiryDate: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Order {
  id: string;
  product: string;
  quantity: number;
  orderedBy: string;
  from: string;
  to: string;
  recipient: string;
  date: string;
  total: number;
  status: 'Pending' | 'Approved' | 'Delivered' | 'Cancelled' | 'Pending Payment';
  shipmentStatus: 'No shipment' | 'Tracking Active';
  role: UserRole;
  paymentStatus: 'Paid' | 'Unpaid' | 'Processing';
}

export interface Shipment {
  id: string;
  product: string;
  from: string;
  to: string;
  recipient: string;
  liveLocation: string;
  coordinates: { lat: number; lng: number };
  progress: number;
  status: 'In Transit' | 'Delivered';
  role?: UserRole;
  trackingHistory: {
    status: string;
    location: string;
    time: string;
    completed: boolean;
  }[];
}

export interface Payment {
  id: string;
  orderId: string;
  from: string;
  to: string;
  amount: number;
  date: string;
  method: string;
  status: 'Paid' | 'Processing' | 'Unpaid';
  role: UserRole;
}

export interface Notification {
  id: string;
  userId?: string;
  role?: UserRole;
  message: string;
  type: 'Order' | 'Payment' | 'System';
  date: string;
  read: boolean;
  orderId?: string;
}
