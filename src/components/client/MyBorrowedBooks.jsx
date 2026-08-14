import React, { useState, useEffect } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { useToast } from '../../context/ToastContext';
import { ShoppingBag, Calendar, CheckCircle, RotateCcw, Clock, XCircle, Search } from 'lucide-react';

export default function MyBorrowedBooks({ currentUser }) {
  const { history, requestRefund, books } = useLibrary();
  const { addToast } = useToast();
  const [now, setNow] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const userName = (currentUser?.name || '').toLowerCase();

  // Orders for current customer specifically
  const userHistory = history.filter((h) => {
    if (userName && h.customerName.toLowerCase() !== userName) return false;
    
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = h.bookTitle.toLowerCase().includes(searchLower);
    
    // Attempt to match english title from books catalog
    const book = books.find(b => (b._id === h.bookId || b.id === h.bookId));
    const englishTitleMatch = book && book.englishTitle && book.englishTitle.toLowerCase().includes(searchLower);
    const authorMatch = book && book.author && book.author.toLowerCase().includes(searchLower);
    
    return titleMatch || englishTitleMatch || authorMatch;
  });

  const activePurchases = userHistory.filter((h) => h.status === 'Purchased');
  const pastRefunds = userHistory.filter((h) => h.status !== 'Purchased');

  const handleRefund = async (item) => {
    const success = await requestRefund(item._id || item.id);
    if (success) {
      addToast(`Refund requested for "${item.bookTitle}". Pending admin approval.`, 'success');
    } else {
      addToast(`Failed to request refund for "${item.bookTitle}"`, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Orders</h2>
          <p className="text-xs text-slate-400">Your purchase history & returns</p>
        </div>
        <div className="relative w-full sm:w-64 shrink-0">
          <input
            type="text"
            placeholder="Search your orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Active Purchases */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recent Purchases ({activePurchases.length})</h3>

        {activePurchases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePurchases.map((item) => (
              <div key={item._id || item.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">
                      {item.bookTitle} {item.quantity > 1 && <span className="text-amber-600 ml-1 text-sm">(Qty: {item.quantity})</span>}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      Order Date: <span className="font-semibold text-slate-700">{item.orderDate}</span>
                    </p>
                  </div>
                </div>

                {item.createdAt && (now - new Date(item.createdAt).getTime() <= 10000) ? (
                  <button
                    onClick={() => handleRefund(item)}
                    className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Refund ({Math.ceil((10000 - (now - new Date(item.createdAt).getTime())) / 1000)}s)
                  </button>
                ) : (
                  <span className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-not-allowed">
                    <XCircle className="w-3.5 h-3.5" />
                    Refund Time Expired
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 text-sm">
            You have no recent purchases.
          </div>
        )}
      </div>

      {/* Refund History */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Refund History ({pastRefunds.length})</h3>
        {pastRefunds.length > 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 divide-y divide-slate-100">
              {pastRefunds.map((past) => (
                <div key={past._id || past.id} className="py-4 flex justify-between items-start text-sm">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      {past.status === 'Refunded' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      {past.status === 'Pending Refund' && <Clock className="w-4 h-4 text-amber-500" />}
                      {past.status === 'Refund Rejected' && <XCircle className="w-4 h-4 text-rose-500" />}
                      <span className="font-semibold text-slate-800">
                        {past.bookTitle} {past.quantity > 1 && <span className="text-amber-600 ml-1 text-xs">(Qty: {past.quantity})</span>}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        past.status === 'Refunded' ? 'bg-emerald-50 text-emerald-600' :
                        past.status === 'Pending Refund' ? 'bg-amber-50 text-amber-600' :
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {past.status === 'Refund Rejected' ? 'Unable to refund' : past.status}
                      </span>
                    </div>
                    {past.adminComment && (
                      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg ml-7 border border-slate-100">
                        <strong>Admin Note:</strong> {past.adminComment}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono mt-0.5 shrink-0">Ordered: {past.orderDate}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 text-xs">
            No refunded orders in your history.
          </div>
        )}
      </div>
    </div>
  );
}