import React, { useState } from 'react';
import { Mail, Trash2, ShieldAlert, UserCheck, AlertTriangle, X } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';

export default function UserManagement() {
  const { customers, searchQuery, toggleCustomerStatus, deleteCustomer } = useLibrary();
  const { currentUser } = useAuth();
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const filteredCustomers = customers.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tier || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        await deleteCustomer(customerToDelete._id || customerToDelete.id);
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Customer Directory</h2>
          <p className="text-xs text-slate-400">Manage registered customers, tiers & account status</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
          Total Customers: {filteredCustomers.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer._id || customer.id}
            className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3 relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  {customer.name}
                  {customer.role === 'admin' && customer.adminType === 'permanent' && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Main Admin</span>
                  )}
                </h3>
                <span className="text-xs font-mono text-slate-400">{(customer._id || customer.id)?.slice(-6)}</span>
              </div>

              <div className="flex items-center gap-2">
                {customer.role !== 'admin' && (
                  <button
                    type="button"
                    onClick={() => toggleCustomerStatus(customer._id || customer.id)}
                    title={customer.status === 'Pending' ? 'Click to Approve' : 'Click to toggle status'}
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold cursor-pointer transition-all ${
                      customer.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        : customer.status === 'Pending'
                        ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 ring-1 ring-amber-400/50'
                        : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    }`}
                  >
                    {customer.status === 'Pending' ? 'Approve' : customer.status}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500" /> {customer.email}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex justify-between items-center text-xs">
              <div className="flex gap-2">
                <span className="text-slate-500 font-medium px-2 py-0.5 bg-slate-200/60 rounded-md">
                  {customer.tier || 'Standard'}
                </span>
                {customer.membershipNumber && (
                  <span className="text-amber-600 font-bold px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-md shadow-sm">
                    👑 {customer.membershipNumber}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {customer.role !== 'admin' && (
                  <span className="font-semibold text-slate-700">{customer.activeOrders || 0} Active Orders</span>
                )}
                {currentUser?.adminType === 'permanent' && customer.role !== 'admin' && (
                  <button
                    type="button"
                    onClick={() => setCustomerToDelete(customer)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove Customer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Customer Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-slate-100 space-y-4">
            <button
              onClick={() => setCustomerToDelete(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-50 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Remove Customer</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-800">"{customerToDelete.name}"</strong> ({customerToDelete.email}) from the directory?
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCustomerToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}