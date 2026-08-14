import React, { useState } from 'react';
import { X, UserPlus, Info } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useToast } from '../../context/ToastContext';

export default function AddPatronModal({ isOpen, onClose }) {
  const { registerCustomer } = useLibrary();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '123',
    tier: 'Standard',
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setIsLoading(true);
    try {
      await registerCustomer(formData);
      addToast(`Customer "${formData.name}" registered successfully!`, 'success');
      onClose();
      setFormData({ name: '', email: '', password: '123', tier: 'Standard' });
    } catch (error) {
      addToast(error.message || 'Failed to register customer', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-slate-100 space-y-4">
        <button onClick={onClose} className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Register New Customer</h2>
            <p className="text-xs text-slate-400">Add a customer to the store directory & login system</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            Registering a customer creates an active directory entry and enables sign-in for the customer portal.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Marcus Vance"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. marcus@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Default Password</label>
            <input
              type="text"
              required
              placeholder="123"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Customer Tier</label>
            <select
              value={formData.tier}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
              className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
            >
              <option value="Standard">Standard</option>
              <option value="Premium Member">Premium Member</option>
              <option value="Student">Student</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-lg transition-all mt-2 cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {isLoading ? 'Registering...' : 'Register Customer'}
          </button>
        </form>
      </div>
    </div>
  );
}