import React, { useMemo, useRef, useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import BookCard from './BookCard';
import { Sparkles, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export default function NewArrivals({ onSelectBook, onPurchaseBook }) {
  const { books } = useLibrary();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const newBooks = useMemo(() => {
    const generalBooks = books.filter(b => b.category !== 'Religious/ धार्मिक');

    // First: books marked as isNewRelease
    const markedNew = generalBooks.filter(b => b.isNewRelease);

    // Second: most recently added books (by _id descending as proxy for creation time)
    const recentByDate = [...generalBooks]
      .sort((a, b) => {
        const idA = a._id || a.id || '';
        const idB = b._id || b.id || '';
        return idB.toString().localeCompare(idA.toString());
      });

    // Merge: marked new first, then recent, deduplicate
    const seen = new Set();
    const merged = [];
    for (const book of [...markedNew, ...recentByDate]) {
      const id = book._id || book.id;
      if (!seen.has(id)) {
        seen.add(id);
        merged.push(book);
      }
      if (merged.length >= 8) break;
    }

    return merged;
  }, [books]);

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(updateScrollState, 350);
  };

  if (newBooks.length < 2) return null;

  return (
    <div className="w-full bg-gradient-to-b from-[#f0f7f0] via-[#f5faf5] to-[#fcfaf7] py-20 border-t border-emerald-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-14 gap-4 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase font-sans text-emerald-700">Fresh Arrivals</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#3e2723] tracking-tight font-bold">
            Just <span className="italic text-emerald-700 font-medium">Arrived</span>
          </h2>
          <p className="text-[#6d5b53] font-serif text-lg max-w-2xl mx-auto mt-1">
            Be the first to explore our newest additions — fresh off the shelf!
          </p>
        </div>

        {/* Carousel */}
        <div className="relative group/carousel">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white hover:bg-emerald-50 text-emerald-700 rounded-full shadow-xl flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer border border-emerald-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white hover:bg-emerald-50 text-emerald-700 rounded-full shadow-xl flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer border border-emerald-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-2 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {newBooks.map((book, index) => (
              <div key={book._id || book.id} className="min-w-[280px] max-w-[280px] flex-shrink-0 relative">
                {/* New badge */}
                {book.isNewRelease && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">New Release</span>
                  </div>
                )}
                <BookCard
                  book={book}
                  onSelect={onSelectBook}
                  onPurchase={onPurchaseBook}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
