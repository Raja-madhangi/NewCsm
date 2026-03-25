import React, { useState } from 'react';
import { useData } from './DataContext';
import { useAuth } from './AuthContext';
import { CreditCard, DollarSign, Clock, CheckCircle2, Search, Filter, X, AlertCircle, BellRing } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Payment } from './types';

export default function PaymentGateway() {
  const { payments, processPayment, remindPayment } = useData();
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [remindedPayments, setRemindedPayments] = useState<string[]>([]);
  const [paymentForm, setPaymentForm] = useState({
    gateway: 'Stripe',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleRemind = (paymentId: string) => {
    remindPayment(paymentId);
    setRemindedPayments([...remindedPayments, paymentId]);
    setTimeout(() => {
      setRemindedPayments(prev => prev.filter(id => id !== paymentId));
    }, 3000);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.to.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (!user) return false;
    if (user.role === 'Admin') return true;

    // Retailers see their own payments (to distributors)
    if (user.role === 'Retailer') return payment.role === 'Retailer';
    // Distributors see their own payments (to manufacturers) AND payments from retailers
    if (user.role === 'Distributor') return payment.role === 'Distributor' || payment.role === 'Retailer';
    // Manufacturers see payments from distributors
    if (user.role === 'Manufacturer') return payment.role === 'Distributor';

    return false;
  });

  const totalReceived = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments
    .filter(p => p.status !== 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;
    
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      processPayment(selectedPayment.id, paymentForm.gateway);
      setIsProcessing(false);
      setSelectedPayment(null);
      setPaymentForm({ gateway: 'Stripe', cardNumber: '', expiry: '', cvc: '' });
    }, 1500);
  };

  const canPay = (payment: Payment) => {
    if (!user) return false;
    if (user.role === 'Admin') return false; // Admin only monitors
    if (user.role === 'Retailer' && payment.role === 'Retailer') return true;
    if (user.role === 'Distributor' && payment.role === 'Distributor') return true;
    return false;
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Gateway</h1>
          <p className="text-gray-500 text-sm">
            {user?.role === 'Admin' ? 'Monitoring all supply chain transactions' : `Manage your ${user?.role} payments`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Received', value: `$${totalReceived.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Pending Payments', value: `$${pendingPayments.toFixed(2)}`, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
          { label: 'Total Transactions', value: payments.length.toString(), icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-100' },
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
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
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
                <th className="px-6 py-4">TXN ID</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">From</th>
                <th className="px-6 py-4">To</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">{payment.id}</td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">{payment.orderId}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{payment.from}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.to}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">${payment.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{payment.date}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      payment.status === 'Paid' ? "bg-green-100 text-green-700" :
                      payment.status === 'Processing' ? "bg-blue-100 text-blue-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {payment.status !== 'Paid' && canPay(payment) && (
                      <button 
                        onClick={() => setSelectedPayment(payment)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ml-auto",
                          payment.status === 'Unpaid' ? "bg-blue-600 text-white hover:bg-blue-700" :
                          "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        )}
                      >
                        <CreditCard className="w-3 h-3" /> Pay Now
                      </button>
                    )}
                    {payment.status !== 'Paid' && !canPay(payment) && user?.role === 'Admin' && (
                      <button 
                        onClick={() => handleRemind(payment.id)}
                        disabled={remindedPayments.includes(payment.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ml-auto",
                          remindedPayments.includes(payment.id) 
                            ? "bg-green-100 text-green-600 cursor-default" 
                            : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                        )}
                      >
                        {remindedPayments.includes(payment.id) ? (
                          <><CheckCircle2 className="w-3 h-3" /> Reminded</>
                        ) : (
                          <><BellRing className="w-3 h-3" /> Take Action</>
                        )}
                      </button>
                    )}
                    {payment.status !== 'Paid' && !canPay(payment) && user?.role !== 'Admin' && (
                      <div className="flex items-center gap-2 text-gray-400 text-xs font-bold justify-end">
                        <Clock className="w-3 h-3" /> Pending
                      </div>
                    )}
                    {payment.status === 'Paid' && (
                      <div className="flex items-center gap-2 text-green-600 text-xs font-bold justify-end">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {user?.role === 'Admin' && pendingPayments > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-900">Payment Monitoring Alert</h4>
            <p className="text-xs text-red-700 mt-1">
              There are {payments.filter(p => p.status !== 'Paid').length} pending transactions. 
              Orders associated with these payments are currently marked as 'Pending Payment' and placed on hold.
            </p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Process Payment</h2>
                  <p className="text-sm text-gray-400 font-medium">{selectedPayment.id} — ${selectedPayment.amount.toFixed(2)}</p>
                </div>
                <button onClick={() => setSelectedPayment(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-y-3 gap-x-8">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Order: <span className="text-gray-900 font-bold">{selectedPayment.orderId}</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Amount: <span className="text-gray-900 font-bold">${selectedPayment.amount.toFixed(2)}</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">From: <span className="text-gray-900 font-medium">{selectedPayment.from}</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">To: <span className="text-gray-900 font-medium">{selectedPayment.to}</span></p>
                  </div>
                </div>

                <form onSubmit={handlePayNow} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Payment Gateway</label>
                    <select 
                      value={paymentForm.gateway}
                      onChange={(e) => setPaymentForm({...paymentForm, gateway: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-sm"
                    >
                      <option>Stripe</option>
                      <option>PayPal</option>
                      <option>Bank Transfer</option>
                      <option>Razorpay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4242 4242 4242 4242"
                      required
                      value={paymentForm.cardNumber}
                      onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Expiry</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        required
                        value={paymentForm.expiry}
                        onChange={(e) => setPaymentForm({...paymentForm, expiry: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">CVC</label>
                      <input 
                        type="text" 
                        placeholder="123"
                        required
                        value={paymentForm.cvc}
                        onChange={(e) => setPaymentForm({...paymentForm, cvc: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setSelectedPayment(null)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4" /> Pay ${selectedPayment.amount.toFixed(2)}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
