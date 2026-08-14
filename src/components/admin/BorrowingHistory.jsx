import React, { useState, useRef } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Check, X, MessageSquare, Eye, Printer, Package, CreditCard, MapPin, Phone, User, Calendar, Hash, BookOpen, Truck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function BorrowingHistory() {
  const { history, books, customers, approveRefund, rejectRefund, markDelivered, searchQuery } = useLibrary();
  const { addToast } = useToast();
  
  const [commentModal, setCommentModal] = useState({ isOpen: false, type: null, transaction: null, comment: '' });
  const [viewModal, setViewModal] = useState({ isOpen: false, transaction: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const printRef = useRef(null);

  const filteredHistory = history.filter(
    (h) =>
      h.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (type, transaction) => {
    setCommentModal({ isOpen: true, type, transaction, comment: '' });
  };

  const handleAction = async () => {
    setIsProcessing(true);
    const { type, transaction, comment } = commentModal;
    
    let success = false;
    if (type === 'approve') {
      success = await approveRefund(transaction.bookId, transaction._id || transaction.id, comment);
      if (success) addToast('Refund approved successfully and email sent.', 'success');
    } else {
      success = await rejectRefund(transaction._id || transaction.id, comment);
      if (success) addToast('Refund rejected and email sent.', 'success');
    }
    
    if (!success) addToast('An error occurred.', 'error');
    
    setIsProcessing(false);
    setCommentModal({ isOpen: false, type: null, transaction: null, comment: '' });
  };

  const handlePrint = (t, book, customerEmail) => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    const statusColor = t.status === 'Purchased' ? '#2563eb' : t.status === 'Refunded' ? '#059669' : t.status === 'Pending Refund' ? '#d97706' : '#e11d48';
    const deliveryChargeDisplay = t.deliveryCharge === 0 ? 'FREE' : `Rs. ${t.deliveryCharge}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - #${(t._id || t.id)?.slice(-6)}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; color: #1e293b; padding: 40px; background: #fff; }
          .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #f1f5f9; }
          .store-name { font-size: 22px; font-weight: 800; color: #1e293b; }
          .store-tagline { font-size: 11px; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }
          .invoice-label { font-size: 28px; font-weight: 700; color: #f59e0b; text-align: right; }
          .invoice-id { font-size: 12px; color: #64748b; font-family: monospace; text-align: right; margin-top: 4px; }
          .invoice-date { font-size: 12px; color: #94a3b8; text-align: right; margin-top: 2px; }
          .status-badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: white; background: ${statusColor}; margin-top: 8px; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #f1f5f9; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .info-card { background: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0; }
          .info-card-label { font-size: 10px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
          .info-card-value { font-size: 14px; font-weight: 600; color: #1e293b; }
          .info-card-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
          .book-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          .book-table th { text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; padding: 10px 14px; background: #f8fafc; border-radius: 8px; }
          .book-table td { padding: 14px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
          .book-table .book-title { font-weight: 700; color: #1e293b; }
          .book-table .book-cat { font-size: 11px; color: #94a3b8; }
          .total-section { background: linear-gradient(135deg, #fffbeb, #fef3c7); border-radius: 16px; padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-top: 24px; border: 1px solid #fde68a; }
          .total-label { font-size: 14px; font-weight: 700; color: #92400e; }
          .total-amount { font-size: 28px; font-weight: 800; color: #b45309; }
          .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; padding-top: 20px; border-top: 1px solid #f1f5f9; }
          .membership-badge { display: inline-block; background: #fffbeb; color: #b45309; border: 1px solid #fde68a; padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-top: 4px; }
          .delivery-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; }
          .delivery-box .label { font-size: 10px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
          .delivery-box .zone { font-size: 14px; font-weight: 700; color: #1e293b; }
          .delivery-box .address { font-size: 12px; color: #64748b; margin-top: 4px; }
          .delivery-box .phone { font-size: 12px; color: #64748b; margin-top: 2px; }
          .delivery-charge { display: inline-block; background: #fffbeb; border: 1px solid #fde68a; color: #b45309; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-top: 8px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div>
            <div class="store-name">📚 नेपाली किताब घर</div>
            <div class="store-tagline">Nepali Kitab Ghar • Gauradaha, Jhapa</div>
          </div>
          <div>
            <div class="invoice-label">INVOICE</div>
            <div class="invoice-id">#${(t._id || t.id)?.slice(-8).toUpperCase()}</div>
            <div class="invoice-date">${new Date(t.createdAt || t.orderDate).toLocaleString()}</div>
            <div class="status-badge">${t.status}</div>
          </div>
        </div>

        <div class="info-grid section">
          <div class="info-card">
            <div class="info-card-label">👤 Customer</div>
            <div class="info-card-value">${t.customerName}</div>
            <div class="info-card-sub">${customerEmail}</div>
            ${t.membershipIdUsed ? `<div class="membership-badge">👑 Member ID: <strong style="font-size:13px;">${t.membershipIdUsed}</strong></div>` : ''}
          </div>
          <div class="info-card">
            <div class="info-card-label">💳 Payment</div>
            <div class="info-card-value">${t.paymentMethod || 'Cash'}</div>
            <div class="info-card-sub" style="color: ${t.paymentStatus === 'Completed' ? '#059669' : t.paymentStatus === 'Failed' ? '#e11d48' : '#d97706'}; font-weight: 600; text-transform: uppercase;">${t.paymentStatus || 'Completed'}</div>
            ${t.paymentId && t.paymentMethod !== 'Cash' ? `<div class="info-card-sub">ID: ${t.paymentId}</div>` : ''}
            ${t.transactionUuid ? `<div class="info-card-sub" style="font-family: monospace; font-size: 10px; word-break: break-all;">Txn: ${t.transactionUuid}</div>` : ''}
          </div>
        </div>

        ${t.deliveryZone && t.deliveryZone !== 'Store Pickup' ? `
          <div class="section">
            <div class="section-title">🚚 Delivery Information</div>
            <div class="delivery-box">
              <div class="zone">${t.deliveryZone}</div>
              <div class="address">📍 ${t.deliveryAddressDetail || 'N/A'}</div>
              <div class="phone">📞 ${t.deliveryPhone || 'N/A'}</div>
              <div class="delivery-charge">Delivery Charge: ${deliveryChargeDisplay}</div>
            </div>
          </div>
        ` : ''}

        <div class="section">
          <div class="section-title">📦 Order Items</div>
          <table class="book-table">
            <thead><tr><th>Book</th><th>Category</th><th>Qty</th><th style="text-align:right">Discount</th></tr></thead>
            <tbody>
              <tr>
                <td><span class="book-title">${t.bookTitle}</span></td>
                <td><span class="book-cat">${book?.category || 'N/A'}</span></td>
                <td>${t.quantity || 1}</td>
                <td style="text-align:right">${t.discountApplied > 0 ? t.discountApplied + '% OFF' : '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        ${t.adminComment ? `
          <div class="section">
            <div class="section-title">💬 Admin Comment</div>
            <div class="info-card" style="font-style: italic; font-size: 13px;">"${t.adminComment}"</div>
          </div>
        ` : ''}

        <div class="total-section">
          <div class="total-label">Total Amount Paid</div>
          <div class="total-amount">Rs. ${(t.totalAmount || ((book?.price || 0) * (t.quantity || 1))).toLocaleString()}</div>
        </div>

        <div class="footer">
          Thank you for your order! • नेपाली किताब घर • Gauradaha, Jhapa, Nepal<br/>
          Generated on ${new Date().toLocaleString()}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Order History</h2>
        <p className="text-xs text-slate-400">Complete order records & refund processing</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-400 font-medium text-xs uppercase">
            <tr>
              <th className="py-3 px-4 rounded-l-xl">Order ID</th>
              <th className="py-3 px-4">Book Title</th>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Order Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredHistory.map((item) => (
              <tr key={item._id || item.id} className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{(item._id || item.id)?.slice(-6)}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">
                  {item.bookTitle} {item.quantity > 1 && <span className="text-xs text-amber-600 font-bold ml-1">(x{item.quantity})</span>}
                </td>
                <td className="py-3.5 px-4">{item.customerName}</td>
                <td className="py-3.5 px-4 text-xs font-mono">{item.orderDate}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.status === 'Refunded' 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : item.status === 'Purchased' 
                      ? 'bg-blue-50 text-blue-600' 
                      : item.status === 'Pending Refund'
                      ? 'bg-amber-50 text-amber-600'
                      : item.status === 'Pending Payment'
                      ? 'bg-orange-50 text-orange-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setViewModal({ isOpen: true, transaction: item })}
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {item.status === 'Pending Refund' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal('approve', item)}
                          className="px-2 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                          title="Approve Refund"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => openModal('reject', item)}
                          className="px-2 py-1 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                          title="Reject Refund"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    ) : item.status === 'Purchased' ? (
                      item.deliveryStatus === 'Pending' ? (
                        <button
                          onClick={async () => {
                            const success = await markDelivered(item._id || item.id);
                            if (success) addToast('Order marked as delivered', 'success');
                          }}
                          className="px-2 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 min-w-max"
                          title="Mark as Delivered"
                        >
                          <Truck className="w-3 h-3" /> Deliver
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic min-w-[70px]">No request</span>
                      )
                    ) : item.status === 'Refund Rejected' ? (
                      <span className="text-xs text-rose-400 italic min-w-[70px]">Rejected</span>
                    ) : item.status === 'Pending Payment' ? (
                      <span className="text-xs text-orange-400 italic min-w-[70px]">Awaiting Payment</span>
                    ) : item.status === 'Payment Failed' ? (
                      <span className="text-xs text-rose-400 italic min-w-[70px]">Failed</span>
                    ) : (
                      <span className="text-xs text-emerald-400 italic min-w-[70px]">Completed</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comment Modal */}
      {commentModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-slate-100">
            <button 
              onClick={() => setCommentModal({ isOpen: false, type: null, transaction: null, comment: '' })} 
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-2xl ${commentModal.type === 'approve' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {commentModal.type === 'approve' ? 'Approve Refund' : 'Reject Refund'}
                </h2>
                <p className="text-xs text-slate-400">Send a comment to the customer</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-4">
              You are about to {commentModal.type} the refund for <strong>{commentModal.transaction?.bookTitle}</strong>. 
              The customer ({commentModal.transaction?.customerName}) will receive an email notification.
            </p>

            <textarea
              rows={4}
              placeholder="Add an optional comment/reason..."
              value={commentModal.comment}
              onChange={(e) => setCommentModal({ ...commentModal, comment: e.target.value })}
              className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 mb-4 resize-none"
            ></textarea>

            <button
              onClick={handleAction}
              disabled={isProcessing}
              className={`w-full py-3.5 text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-60 ${
                commentModal.type === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {isProcessing ? 'Processing & Sending Email...' : `Confirm & Send Email`}
            </button>
          </div>
        </div>
      )}

      {/* View Details Modal — Premium Invoice Style */}
      {viewModal.isOpen && viewModal.transaction && (() => {
        const t = viewModal.transaction;
        const book = books.find(b => (b._id || b.id) === t.bookId);
        const customer = customers.find(c => (c._id || c.id) === (t.userId?._id || t.userId));
        const customerEmail = t.userId?.email || customer?.email || 'Unknown Email';
        const statusStyle = t.status === 'Purchased' ? 'bg-blue-50 text-blue-600 border-blue-200' :
          t.status === 'Refunded' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
          t.status === 'Pending Refund' ? 'bg-amber-50 text-amber-600 border-amber-200' :
          'bg-rose-50 text-rose-600 border-rose-200';
        const deliveryChargeDisplay = (t.deliveryCharge === 0 || !t.deliveryCharge) ? 'FREE' : `Rs. ${t.deliveryCharge}`;
        
        return (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div ref={printRef} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
              
              {/* Header */}
              <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white p-6 rounded-t-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <button onClick={() => setViewModal({ isOpen: false, transaction: null })} className="absolute right-4 top-4 p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors z-20">
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-amber-400 text-[10px] font-bold uppercase tracking-[3px] mb-1">Invoice</p>
                    <h2 className="text-xl font-bold">📚 किताब घर</h2>
                    <p className="text-white/40 text-[10px] mt-0.5 tracking-wide">Gauradaha, Jhapa, Nepal</p>
                  </div>
                  <div className="text-right pr-6 mt-1">
                    <p className="text-white/50 text-[10px] font-mono">#{(t._id || t.id)?.slice(-8).toUpperCase()}</p>
                    <p className="text-white/60 text-xs mt-1">{new Date(t.createdAt || t.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    <p className="text-white/40 text-[10px]">{new Date(t.createdAt || t.orderDate).toLocaleTimeString()}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyle}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">

                {/* Customer & Payment Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center gap-1.5 mb-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{t.customerName}</p>
                    <p className="text-[11px] text-slate-500 break-all">{customerEmail}</p>
                    {t.membershipIdUsed && (
                      <div className="mt-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">👑 Member</p>
                        <p className="text-sm font-bold text-amber-700 mt-0.5">{t.membershipIdUsed}</p>
                      </div>
                    )}
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center gap-1.5 mb-2">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{t.paymentMethod || 'Cash'}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${
                      t.paymentStatus === 'Completed' ? 'text-emerald-500' :
                      t.paymentStatus === 'Failed' ? 'text-rose-500' : 'text-amber-500'
                    }`}>{t.paymentStatus || 'Completed'}</p>
                    {t.paymentId && t.paymentMethod !== 'Cash' && (
                      <p className="text-[10px] text-slate-400 font-mono break-all">ID: {t.paymentId}</p>
                    )}
                  </div>
                </div>

                {/* Delivery Card */}
                {t.deliveryZone && t.deliveryZone !== 'Store Pickup' && (
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2.5">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Delivery Information</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold mb-0.5">Zone</p>
                        <p className="text-sm font-bold text-slate-800">{t.deliveryZone}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold mb-0.5">Charge</p>
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${t.deliveryCharge === 0 || !t.deliveryCharge ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {deliveryChargeDisplay}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-slate-600 break-words">{t.deliveryAddressDetail}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <p className="text-xs text-slate-600 font-semibold">{t.deliveryPhone}</p>
                    </div>
                  </div>
                )}

                {/* Book Item */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order Item</span>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-14 h-20 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {book?.coverImages && book.coverImages.length > 0 ? (
                        <img src={book.coverImages[0]} alt={t.bookTitle} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-amber-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{t.bookTitle}</p>
                      <p className="text-[11px] text-slate-400">{book?.category || 'Unknown Category'}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">Qty: {t.quantity || 1}</span>
                        {t.discountApplied > 0 && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                            {t.discountApplied}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction ID */}
                {t.transactionUuid && (
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                    <Hash className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    <p className="text-[10px] font-mono text-slate-400 truncate">{t.transactionUuid}</p>
                  </div>
                )}

                {/* Admin Comment */}
                {t.adminComment && (
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1.5">Admin Comment</p>
                    <p className="text-xs text-slate-600 italic">"{t.adminComment}"</p>
                  </div>
                )}

                {/* Total */}
                <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-5 rounded-2xl border border-amber-200/60 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-amber-700/60 uppercase tracking-wider">Total Amount</p>
                    <p className="text-xs text-amber-600/60 mt-0.5">Including all charges & discounts</p>
                  </div>
                  <p className="text-2xl font-black text-amber-600">Rs. {(t.totalAmount || ((book?.price || 0) * (t.quantity || 1))).toLocaleString()}</p>
                </div>

                {/* Print Button */}
                <button
                  onClick={() => handlePrint(t, book, customerEmail)}
                  className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl shadow-lg shadow-slate-800/20 transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}