import React, { useState, useEffect } from 'react';
import { settingsAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useLibrary } from '../../context/LibraryContext';
import { Settings, Save, Percent, Search } from 'lucide-react';

export default function StoreSettings() {
  const [discount, setDiscount] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [selectedBookIds, setSelectedBookIds] = useState([]);
  const [bookSearch, setBookSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const { books } = useLibrary();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsAPI.getSettings();
        setDiscount(data.membershipDiscountPercentage || 0);
        setAuthorName(data.authorSpotlightName || '');
        setAuthorBio(data.authorSpotlightBio || '');
        setSelectedBookIds(data.authorSpotlightBookIds || []);
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
      await settingsAPI.updateSettings({ 
        membershipDiscountPercentage: Number(discount),
        authorSpotlightName: authorName,
        authorSpotlightBio: authorBio,
        authorSpotlightBookIds: selectedBookIds
      });
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
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
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

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-8">
        <div className="border-b border-slate-100 p-6 bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            Home Page Configuration
          </h3>
          <p className="text-sm text-slate-500 mt-1">Configure sections displayed on the home page.</p>
        </div>
        
        <form onSubmit={handleSave} className="p-6">
          <div className="max-w-2xl space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Author Spotlight Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Enter the author's name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Author Spotlight Bio
              </label>
              <textarea
                value={authorBio}
                onChange={(e) => setAuthorBio(e.target.value)}
                placeholder="Enter a captivating bio for the featured author..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-700 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Select Books to Display (Max 3)
              </label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  placeholder="Search books by title or author..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm text-slate-700"
                />
              </div>
              <div className="h-64 overflow-y-auto border border-slate-200 rounded-xl bg-slate-50 p-2 space-y-1">
                {books
                  .filter(b => b.category !== 'Religious/ धार्मिक' && (b.title.toLowerCase().includes(bookSearch.toLowerCase()) || b.author.toLowerCase().includes(bookSearch.toLowerCase())))
                  .map(book => {
                    const bookId = book._id || book.id;
                    const isSelected = selectedBookIds.includes(bookId);
                    return (
                      <label 
                        key={bookId} 
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-white border border-transparent'}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (selectedBookIds.length >= 3) {
                                addToast('You can only select up to 3 books', 'error');
                                return;
                              }
                              setSelectedBookIds([...selectedBookIds, bookId]);
                            } else {
                              setSelectedBookIds(selectedBookIds.filter(id => id !== bookId));
                            }
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-slate-800 truncate">{book.title}</span>
                          <span className="text-xs text-slate-500 truncate">{book.author}</span>
                        </div>
                      </label>
                    );
                  })}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {selectedBookIds.length} / 3 books selected.
              </p>
            </div>
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
