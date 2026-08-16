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
    <div className="w-full bg-white py-20 border-t border-[#eadac2]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-16 gap-4 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#fcfaf7] border border-[#eadac2] shadow-sm mb-2">
            <span className="w-6 h-6 rounded-full bg-[#f9f4ec] flex items-center justify-center text-[10px] font-bold shadow-inner text-[#a0683a]">02</span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-sans pr-2 text-[#a0683a]">Sacred Texts</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#3e2723] tracking-tight font-bold">
            Religious / <span className="italic text-[#a0683a] font-medium">धार्मिक</span> Books
          </h2>
          <p className="text-[#6d5b53] font-serif text-lg max-w-2xl mx-auto mt-2">
            Discover profound spiritual wisdom and sacred literature.
          </p>
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
          <div className="text-center py-20 bg-[#fcfaf7] border border-[#eadac2] rounded-[2rem] flex flex-col items-center justify-center space-y-5 shadow-sm">
            <div className="w-20 h-20 bg-[#f4ebd9] rounded-full flex items-center justify-center shadow-sm border border-white">
              <BookOpen className="w-8 h-8 text-[#a0683a]" />
            </div>
            <h3 className="text-2xl font-serif text-[#3e2723] font-bold">No religious books currently available.</h3>
            <p className="text-[#6d5b53] font-serif">More sacred texts and spiritual literature will be added to our archives soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
