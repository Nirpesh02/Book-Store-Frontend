import React, { useState, useEffect } from 'react';
import { Mail, Trash2, ShieldAlert, UserPlus, AlertTriangle, X } from 'lucide-react';
import { adminAPI } from '../../api';
import AddSubAdminModal from './AddSubAdminModal';

export default function SubAdminManagement() {
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const fetchSubAdmins = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAll();
      setSubAdmins(data);
    } catch (err) {
      setError('Failed to load sub-admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const confirmDelete = async () => {
    if (adminToDelete) {
      try {
        await adminAPI.delete(adminToDelete._id || adminToDelete.id);
        setSubAdmins(subAdmins.filter((a) => (a._id || a.id) !== (adminToDelete._id || adminToDelete.id)));
      } catch (error) {
        console.error('Error deleting sub-admin:', error);
      }
      setAdminToDelete(null);
    }
  };

  const handleAdded = (newAdmin) => {
    setSubAdmins([newAdmin, ...subAdmins]);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Sub-Admins (Temporary)</h2>
          <p className="text-xs text-slate-400">Manage temporary administrators for your store.</p>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <UserPlus className="w-4 h-4" /> Add Sub-Admin
        </button>
      </div>

      {error && <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-xl">{error}</div>}

      {loading ? (
        <div className="py-10 text-center text-sm font-medium text-slate-500">Loading sub-admins...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subAdmins.length === 0 ? (
            <div className="col-span-full py-10 text-center text-sm font-medium text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              No temporary admins found.
            </div>
          ) : (
            subAdmins.map((admin) => (
              <div
                key={admin._id || admin.id}
                className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3 relative group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{admin.name}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Sub-Admin
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {admin.email}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex justify-end items-center text-xs">
                  <button
                    type="button"
                    onClick={() => setAdminToDelete(admin)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 font-semibold"
                    title="Remove Sub-Admin"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <AddSubAdminModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdded={handleAdded} 
      />

      {/* Delete Confirmation Modal */}
      {adminToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-slate-100 space-y-4">
            <button
              onClick={() => setAdminToDelete(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-50 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Remove Sub-Admin</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-800">"{adminToDelete.name}"</strong>? Their administrative access will be revoked immediately.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setAdminToDelete(null)}
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
