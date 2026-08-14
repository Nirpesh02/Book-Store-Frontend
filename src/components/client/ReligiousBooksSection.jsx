import React from 'react';
import { useLibrary } from '../../context/LibraryContext';
import BookCard from './BookCard';
import { BookOpen } from 'lucide-react';

export default function ReligiousBooksSection({ onSelectBook, onPurchaseBook }) {
  const { books } = useLibrary();

  // Filter for religious books (check category or title for keywords)
  const religiousBooks = books.filter(b => {
    const cat = (b.category || '').toLowerCase();
    const title = (b.title || '').toLowerCase();
    return b.category === 'Religious/ धार्मिक' || cat.includes('religious') || cat.includes('spiritual') || title.includes('धार्मिक') || title.includes('gita') || title.includes('mahabharat') || title.includes('ramayan');
  });

  return (
    <div className="mt-20 pt-16 border-t border-stone-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold text-[#c28453] tracking-widest uppercase">02</span>
            <div className="w-8 h-[1px] bg-[#c28453]/40"></div>
            <span className="text-[10px] font-bold text-stone-500 tracking-widest uppercase">Sacred Texts</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 tracking-tight">
            Religious / धार्मिक Books
          </h2>
          <p className="text-sm text-stone-500 mt-2 italic font-serif">
            Discover profound spiritual wisdom and sacred literature.
          </p>
        </div>
      </div>

      {religiousBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {religiousBooks.map((book) => (
            <BookCard
              key={book._id || book.id}
              book={book}
              onSelect={onSelectBook}
              onPurchase={onPurchaseBook}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#fbfaf7] border border-stone-200/60 rounded-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm border border-stone-100">
            <BookOpen className="w-6 h-6 text-[#c28453]" />
          </div>
          <p className="text-xl font-serif text-stone-900">No religious books currently available.</p>
          <p className="text-sm text-stone-500">More sacred texts and spiritual literature will be added to our archives soon.</p>
        </div>
      )}
    </div>
  );
}
