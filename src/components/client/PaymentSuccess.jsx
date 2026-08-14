import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { transactionsAPI } from '../../api';
import { useLibrary } from '../../context/LibraryContext';

export default function PaymentSuccess({ onNavigateHome }) {
  const { refreshBooks } = useLibrary();
  
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your payment securely with eSewa...');

  useEffect(() => {
    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const data = urlParams.get('data');
      if (!data) {
        setStatus('error');
        setMessage('Invalid payment response. No data provided.');
        return;
      }

      try {
        await transactionsAPI.verifyEsewaPayment(data);
        setStatus('success');
        setMessage('Payment successful! Your book has been purchased.');
        await refreshBooks();
      } catch (error) {
        console.error('Payment verification failed:', error);
        setStatus('error');
        setMessage(error.message || 'Payment verification failed. Please contact support.');
        await refreshBooks(); // Refresh to reflect stock reversion
      }
    };

    verifyPayment();
  }, [refreshBooks]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
        
        {status === 'verifying' && (
          <div className="flex flex-col items-center animate-pulse">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Verifying Payment</h2>
            <p className="text-slate-500">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Payment Successful!</h2>
            <p className="text-slate-500 mb-8">{message}</p>
            <button 
              onClick={onNavigateHome}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95 cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Payment Failed</h2>
            <p className="text-slate-500 mb-8">{message}</p>
            <button 
              onClick={onNavigateHome}
              className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 transition-all active:scale-95 cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
