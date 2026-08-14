import React from 'react';
import { X, Search, Filter, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

export default function FilterDrawer({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  inStockOnly,
  setInStockOnly,
  sortOption,
  setSortOption,
  categories,
  resultsCount
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 animate-[slideInRight_0.3s_ease-out]">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-white shadow-2xl rounded-l-3xl border-l border-slate-100 overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Filter & Sort</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              
              {/* Search */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" /> Search
                </h3>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or author..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" /> Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                          : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800">Sort By</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'newest', label: 'Newest First' },
                    { id: 'popular', label: 'Most Popular' },
                    { id: 'az', label: 'Title (A-Z)' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSortOption(option.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                        sortOption === option.id
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {option.label}
                      {sortOption === option.id && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800">Availability</h3>
                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-medium text-slate-700">In-Stock Only</span>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${inStockOnly ? 'bg-amber-500' : 'bg-slate-200'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${inStockOnly ? 'translate-x-4' : ''}`}></div>
                  </div>
                </label>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-white">
              <button 
                onClick={onClose}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-slate-900/20 active:scale-95 cursor-pointer"
              >
                Show {resultsCount} {resultsCount === 1 ? 'Result' : 'Results'}
              </button>
            </div>

          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />
    </div>
  );
}
