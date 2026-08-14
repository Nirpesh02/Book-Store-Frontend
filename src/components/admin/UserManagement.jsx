import React, { useState } from 'react';
import { Mail, Trash2, ShieldAlert, UserCheck, AlertTriangle, X, UserX, Crown } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function UserManagement() {
  const { customers, searchQuery, toggleCustomerStatus, deleteCustomer, removeMembership } = useLibrary();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  // State: null = closed, customer object = open action picker
  const [actionTarget, setActionTarget] = useState(null);
  // 'account' or 'membership' — which confirmation is active
  const [confirmType, setConfirmType] = useState(null);
  const [processing, setProcessing] = useState(false);

  const filteredCustomers = customers.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tier || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteAccount = async () => {
    if (!actionTarget) return;
    setProcessing(true);
    try {
      await deleteCustomer(actionTarget._id || actionTarget.id);
      addToast(`Account "${actionTarget.name}" deleted successfully.`, 'success');
    } catch (error) {
      addToast(error.message || 'Failed to delete account', 'error');
    }
    setProcessing(false);
    setConfirmType(null);
    setActionTarget(null);
  };

  const handleRemoveMembership = async () => {
    if (!actionTarget) return;
    setProcessing(true);
    try {
      await removeMembership(actionTarget._id || actionTarget.id);
      addToast(`Membership removed for "${actionTarget.name}". Account is still active.`, 'success');
    } catch (error) {
      addToast(error.message || 'Failed to remove membership', 'error');
    }
    setProcessing(false);
    setConfirmType(null);
    setActionTarget(null);
  };

  const closeModal = () => {
    if (processing) return;
    setConfirmType(null);
    setActionTarget(null);
  };

  const hasMembership = actionTarget?.membershipNumber || actionTarget?.membershipRequestStatus === 'Pending' || actionTarget?.membershipRequestStatus === 'Approved';

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
                    onClick={() => setActionTarget(customer)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Manage Customer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Picker Modal */}
      {actionTarget && !confirmType && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-slate-100 space-y-5">
            <button
              onClick={closeModal}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">Manage Customer</h3>
              <p className="text-xs text-slate-500">
                Choose an action for <strong className="text-slate-700">"{actionTarget.name}"</strong>
              </p>
            </div>

            <div className="space-y-3">
              {/* Delete Account Option */}
              <button
                type="button"
                onClick={() => setConfirmType('account')}
                className="w-full flex items-center gap-4 p-4 border-2 border-slate-100 rounded-2xl hover:border-rose-200 hover:bg-rose-50/50 transition-all cursor-pointer group/btn text-left"
              >
                <div className="p-3 bg-rose-50 group-hover/btn:bg-rose-100 rounded-xl transition-colors shrink-0">
                  <UserX className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 group-hover/btn:text-rose-700 transition-colors">Delete Account</p>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Permanently remove this customer's entire account, including all data and order history.
                  </p>
                </div>
              </button>

              {/* Remove Membership Option */}
              <button
                type="button"
                onClick={() => setConfirmType('membership')}
                disabled={!hasMembership}
                className={`w-full flex items-center gap-4 p-4 border-2 rounded-2xl transition-all text-left ${
                  hasMembership
                    ? 'border-slate-100 hover:border-amber-200 hover:bg-amber-50/50 cursor-pointer group/btn'
                    : 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors shrink-0 ${hasMembership ? 'bg-amber-50 group-hover/btn:bg-amber-100' : 'bg-slate-100'}`}>
                  <Crown className={`w-5 h-5 ${hasMembership ? 'text-amber-600' : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className={`text-sm font-bold transition-colors ${hasMembership ? 'text-slate-800 group-hover/btn:text-amber-700' : 'text-slate-400'}`}>Remove Membership</p>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    {hasMembership
                      ? 'Revoke the premium membership only. The account will remain active with Standard tier.'
                      : 'This customer does not have an active membership.'}
                  </p>
                </div>
              </button>
            </div>

            <button
              onClick={closeModal}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Confirm Delete Account Modal */}
      {actionTarget && confirmType === 'account' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-slate-100 space-y-4">
            <button
              onClick={closeModal}
              disabled={processing}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-50 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Delete Account</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to <strong className="text-rose-600">permanently delete</strong> the account of <strong className="text-slate-800">"{actionTarget.name}"</strong> ({actionTarget.email})? This action cannot be undone.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmType(null)}
                disabled={processing}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={processing}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {processing ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Remove Membership Modal */}
      {actionTarget && confirmType === 'membership' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-slate-100 space-y-4">
            <button
              onClick={closeModal}
              disabled={processing}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-3 bg-amber-50 rounded-2xl">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Remove Membership</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              This will <strong className="text-amber-600">revoke the premium membership</strong> of <strong className="text-slate-800">"{actionTarget.name}"</strong> ({actionTarget.email}). Their account will remain active but the tier will be reset to Standard.
            </p>

            {actionTarget.membershipNumber && (
              <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="text-xs text-amber-700 font-medium">Current ID:</span>
                <span className="text-xs font-bold text-amber-800">👑 {actionTarget.membershipNumber}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmType(null)}
                disabled={processing}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={handleRemoveMembership}
                disabled={processing}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {processing ? 'Removing...' : 'Yes, Remove Membership'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}