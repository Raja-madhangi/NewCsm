import { Product, Order, Shipment, Payment } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { id: 'COS-001', name: 'Matte Lipstick - Ruby Red', category: 'Lips', batch: 'B-2024-001', mfgDate: '2024-01-15', expiryDate: '2025-01-15', price: 18.99, stock: 250, status: 'In Stock' },
  { id: 'COS-002', name: 'Hydrating Face Serum', category: 'Skincare', batch: 'B-2024-002', mfgDate: '2024-02-10', expiryDate: '2024-08-10', price: 34.50, stock: 12, status: 'Low Stock' },
  { id: 'COS-003', name: 'Volumizing Mascara', category: 'Eyes', batch: 'B-2024-003', mfgDate: '2024-03-01', expiryDate: '2025-09-01', price: 22.00, stock: 180, status: 'In Stock' },
  { id: 'COS-004', name: 'Foundation - Warm Beige', category: 'Face', batch: 'B-2024-004', mfgDate: '2023-11-20', expiryDate: '2024-05-20', price: 28.75, stock: 0, status: 'Out of Stock' },
  { id: 'COS-005', name: 'Rose Petal Perfume', category: 'Fragrance', batch: 'B-2024-005', mfgDate: '2024-04-05', expiryDate: '2026-04-05', price: 65.00, stock: 95, status: 'In Stock' },
  { id: 'COS-006', name: 'Anti-Aging Night Cream', category: 'Skincare', batch: 'B-2024-006', mfgDate: '2024-01-20', expiryDate: '2024-07-20', price: 42.00, stock: 8, status: 'Low Stock' },
  { id: 'COS-007', name: 'Eyeshadow Palette - Sunset', category: 'Eyes', batch: 'B-2024-007', mfgDate: '2024-05-15', expiryDate: '2026-05-15', price: 38.00, stock: 320, status: 'In Stock' },
  { id: 'COS-008', name: 'Lip Gloss - Pink Shimmer', category: 'Lips', batch: 'B-2024-008', mfgDate: '2024-03-25', expiryDate: '2025-03-25', price: 14.50, stock: 5, status: 'Low Stock' },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', product: 'Matte Lipstick - Ruby Red', quantity: 50, orderedBy: 'BeautyMart Retail', from: 'aurascm Manufacturing Unit, Mumbai, Plot No. 47, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra', to: 'BeautyMart Retail Store, Delhi', date: '2024-06-01', total: 949.50, status: 'Delivered', shipmentStatus: 'Tracking Active', role: 'Retailer', paymentStatus: 'Paid' },
  { id: 'ORD-002', product: 'Hydrating Face Serum', quantity: 100, orderedBy: 'GlowUp Distributors', from: 'aurascm Manufacturing Unit, Mumbai, Plot No. 47, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra', to: 'GlowUp Warehouse, Delhi', date: '2024-06-05', total: 3450.00, status: 'Approved', shipmentStatus: 'Tracking Active', role: 'Distributor', paymentStatus: 'Paid' },
  { id: 'ORD-003', product: 'Volumizing Mascara', quantity: 75, orderedBy: 'CosmoChain Retail', from: 'LuxeBeauty Distributor', to: 'CosmoChain Retail Store, Chennai', date: '2024-06-10', total: 1650.00, status: 'Pending', shipmentStatus: 'Tracking Active', role: 'Retailer', paymentStatus: 'Unpaid' },
  { id: 'ORD-004', product: 'Foundation - Warm Beige', quantity: 200, orderedBy: 'LuxeBeauty Distributor', from: 'aurascm Manufacturing Unit, Mumbai, Plot No. 47, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra', to: 'LuxeBeauty Warehouse, Chennai', date: '2024-06-12', total: 5750.00, status: 'Pending', shipmentStatus: 'No shipment', role: 'Distributor', paymentStatus: 'Unpaid' },
  { id: 'ORD-005', product: 'Rose Petal Perfume', quantity: 30, orderedBy: 'EleganceHub', from: 'aurascm Manufacturing Unit, Mumbai, Plot No. 47, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra', to: 'EleganceHub Store, Mumbai', date: '2024-06-15', total: 1950.00, status: 'Approved', shipmentStatus: 'No shipment', role: 'Retailer', paymentStatus: 'Paid' },
  { id: 'ORD-006', product: 'Anti-Aging Night Cream', quantity: 10, orderedBy: 'aurascm Admin', from: 'aurascm Manufacturing Unit, Mumbai, Plot No. 47, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra', to: 'Retailer Hub, Bangalore', date: '2024-06-20', total: 420.00, status: 'Pending', shipmentStatus: 'Tracking Active', role: 'Admin', paymentStatus: 'Paid' },
];

export const MOCK_SHIPMENTS: Shipment[] = [
  { 
    id: 'ORD-001', 
    product: 'Matte Lipstick - Ruby Red', 
    from: 'aurascm Manufacturing Unit, Mumbai, Plot No. 47, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra', 
    to: 'BeautyMart Retail, Shop 12, Connaught Place, Delhi - 110001', 
    liveLocation: 'BeautyMart Retail, Shop 12, Connaught Place, Delhi - 110001', 
    coordinates: { lat: 28.6139, lng: 77.2090 }, 
    progress: 100, 
    status: 'Delivered',
    role: 'Retailer',
    trackingHistory: [
      { status: 'Order Received', location: 'aurascm Manufacturing Unit, Mumbai, Plot No. 47, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra', time: '2024-06-01 10:00 AM', completed: true },
      { status: 'Order Dispatched', location: 'aurascm Logistics Hub, Sector 18, Vashi, Navi Mumbai - 400703', time: '2024-06-01 02:00 PM', completed: true },
      { status: 'Order in Transit', location: 'Northern Logistics Center, Okhla Phase III, Delhi - 110020', time: '2024-06-02 09:00 AM', completed: true },
      { status: 'Order Delivered', location: 'BeautyMart Retail, Shop 12, Connaught Place, Delhi - 110001', time: '2024-06-02 04:00 PM', completed: true },
    ]
  },
  { 
    id: 'ORD-002', 
    product: 'Hydrating Face Serum', 
    from: 'aurascm Manufacturing Unit, Mumbai, Plot No. 47, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra', 
    to: 'GlowUp Distribution Center, Bijwasan, Delhi - 110061', 
    liveLocation: 'NH-48 Highway, Milestone 420, Near Hubli Bypass, Karnataka - 580024', 
    coordinates: { lat: 15.3647, lng: 75.1240 }, 
    progress: 60, 
    status: 'In Transit',
    role: 'Distributor',
    trackingHistory: [
      { status: 'Order Received', location: 'aurascm Manufacturing Unit, Mumbai, Plot No. 47, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra', time: '2024-06-05 11:00 AM', completed: true },
      { status: 'Order Dispatched', location: 'aurascm Logistics Hub, Sector 18, Vashi, Navi Mumbai - 400703', time: '2024-06-05 03:00 PM', completed: true },
      { status: 'Order in Transit', location: 'NH-48 Highway, Milestone 420, Near Hubli Bypass, Karnataka - 580024', time: '2024-06-06 08:00 AM', completed: true },
      { status: 'Order Delivered', location: 'GlowUp Distribution Center, Bijwasan, Delhi - 110061', time: '-', completed: false },
    ]
  },
  { 
    id: 'ORD-003', 
    product: 'Volumizing Mascara', 
    from: 'LuxeBeauty Wholesale Hub, No. 88, Mount Road, Guindy, Chennai - 600032', 
    to: 'CosmoChain Retail, No. 34, MG Road, Indiranagar, Bangalore - 560038', 
    liveLocation: 'LuxeBeauty Wholesale Hub, No. 88, Mount Road, Guindy, Chennai - 600032', 
    coordinates: { lat: 13.0827, lng: 80.2707 }, 
    progress: 25, 
    status: 'In Transit',
    role: 'Retailer',
    trackingHistory: [
      { status: 'Order Received', location: 'LuxeBeauty Wholesale Hub, No. 88, Mount Road, Guindy, Chennai - 600032', time: '2024-06-10 09:00 AM', completed: true },
      { status: 'Order Dispatched', location: 'LuxeBeauty Wholesale Hub, No. 88, Mount Road, Guindy, Chennai - 600032', time: '-', completed: false },
      { status: 'Order in Transit', location: 'Southern Corridor - NH-44 Highway', time: '-', completed: false },
      { status: 'Order Delivered', location: 'CosmoChain Retail, No. 34, MG Road, Indiranagar, Bangalore - 560038', time: '-', completed: false },
    ]
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'TXN-001', orderId: 'ORD-001', from: 'BeautyMart Retail', to: 'aurascm Mfg.', amount: 949.50, date: '2024-06-01', method: 'Bank Transfer', status: 'Paid', role: 'Retailer' },
  { id: 'TXN-002', orderId: 'ORD-002', from: 'GlowUp Distributors', to: 'aurascm Mfg.', amount: 3450.00, date: '2024-06-05', method: 'Razorpay', status: 'Processing', role: 'Distributor' },
  { id: 'TXN-003', orderId: 'ORD-003', from: 'CosmoChain Retail', to: 'aurascm Mfg.', amount: 1650.00, date: '2024-06-10', method: '-', status: 'Unpaid', role: 'Retailer' },
  { id: 'TXN-004', orderId: 'ORD-004', from: 'LuxeBeauty Distributor', to: 'aurascm Mfg.', amount: 5750.00, date: '2024-06-12', method: '-', status: 'Unpaid', role: 'Distributor' },
  { id: 'TXN-005', orderId: 'ORD-005', from: 'EleganceHub', to: 'aurascm Mfg.', amount: 1950.00, date: '2024-06-15', method: 'Stripe', status: 'Paid', role: 'Retailer' },
];
