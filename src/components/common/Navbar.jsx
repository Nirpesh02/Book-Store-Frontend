import React from 'react';
import { Search, Plus } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export default function Navbar({ onOpenAddBook }) {
  const { searchQuery, setSearchQuery } = useLibrary();

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Books, Customers, or Orders..."
          className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <button
          onClick={onOpenAddBook}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-md shadow-amber-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>
    </header>
  );
}