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
        className="absolute inset-0 bg-[#3e2723]/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 animate-[slideInRight_0.3s_ease-out]">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-[#fcfaf7] shadow-[0_0_40px_rgba(62,39,35,0.1)] rounded-l-[2rem] border-l border-[#eadac2] overflow-hidden">
            
            {/* Header */}
            <div className="px-8 py-8 border-b border-[#eadac2]/60 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#f4ebd9] text-[#a0683a] rounded-full flex items-center justify-center border border-[#eadac2]">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#3e2723]">Filter & Sort</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-[#6d5b53] hover:text-[#d32f2f] hover:bg-white border border-transparent hover:border-[#eadac2] rounded-full transition-all cursor-pointer shadow-sm bg-[#f9f4ec]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
              
              {/* Search */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-[#a0683a] uppercase tracking-widest flex items-center gap-2">
                  <Search className="w-4 h-4" /> Search
                </h3>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or author..."
                  className="w-full px-5 py-4 bg-white border border-[#eadac2] rounded-full text-sm font-medium text-[#3e2723] focus:outline-none focus:ring-2 focus:ring-[#c28453]/20 focus:border-[#c28453] transition-all placeholder:text-[#a0683a]/60 shadow-sm"
                />
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-[#a0683a] uppercase tracking-widest flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Categories
                </h3>
                <div className="flex flex-wrap gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#3e2723] text-white shadow-md'
                          : 'bg-white border border-[#eadac2] text-[#6d5b53] hover:border-[#c28453] hover:text-[#c28453]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-[#a0683a] uppercase tracking-widest flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Sort By
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'newest', label: 'Newest First' },
                    { id: 'popular', label: 'Most Popular' },
                    { id: 'az', label: 'Title (A-Z)' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSortOption(option.id)}
                      className={`flex items-center justify-between px-5 py-4 rounded-3xl border text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        sortOption === option.id
                          ? 'border-[#c28453] bg-[#f4ebd9] text-[#a0683a] shadow-inner'
                          : 'border-[#eadac2] bg-white text-[#6d5b53] hover:bg-[#f9f4ec]'
                      }`}
                    >
                      {option.label}
                      {sortOption === option.id && <CheckCircle2 className="w-4 h-4 text-[#c28453]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-[#a0683a] uppercase tracking-widest">Availability</h3>
                <label className="flex items-center justify-between p-5 rounded-3xl border border-[#eadac2] bg-white cursor-pointer hover:bg-[#f9f4ec] transition-colors shadow-sm">
                  <span className="text-xs font-bold text-[#3e2723] uppercase tracking-wider">In-Stock Only</span>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    <div className={`block w-12 h-7 rounded-full transition-colors ${inStockOnly ? 'bg-[#3e2723]' : 'bg-[#eadac2]'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform shadow-sm ${inStockOnly ? 'translate-x-5' : ''}`}></div>
                  </div>
                </label>
              </div>

            </div>

            {/* Footer */}
            <div className="p-8 border-t border-[#eadac2]/60 bg-white">
              <button 
                onClick={onClose}
                className="w-full py-4 bg-[#c28453] hover:bg-[#a0683a] text-white font-bold text-[11px] tracking-[0.2em] uppercase rounded-full transition-all shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer"
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
