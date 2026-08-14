import React, { useState, useEffect } from 'react';
import { settingsAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Settings, Save, Percent } from 'lucide-react';

export default function StoreSettings() {
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsAPI.getSettings();
        setDiscount(data.membershipDiscountPercentage || 0);
      } catch (error) {
        addToast(error.message || 'Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [addToast]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsAPI.updateSettings({ membershipDiscountPercentage: Number(discount) });
      addToast('Store settings updated successfully', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-500" />
          Store Settings
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-500" />
          Store Settings
        </h2>
        <p className="text-slate-500 mt-1">Configure global settings for the Kitabghar application.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-6 bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Percent className="w-5 h-5 text-amber-500" />
            Membership Configuration
          </h3>
          <p className="text-sm text-slate-500 mt-1">Set the global discount applied to all Premium Members.</p>
        </div>
        
        <form onSubmit={handleSave} className="p-6">
          <div className="max-w-md">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Global Membership Discount (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-semibold text-slate-700"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 font-bold">
                %
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              This discount will be automatically applied to the subtotal of any user with an approved Membership Number during checkout.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
