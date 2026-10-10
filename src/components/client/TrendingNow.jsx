import React, { useMemo, useRef, useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import BookCard from './BookCard';
import { Flame, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

export default function TrendingNow({ onSelectBook, onPurchaseBook }) {
  const { books, history } = useLibrary();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const trendingBooks = useMemo(() => {
    // Count purchases per book from transaction history
    const purchaseCounts = {};
    history.forEach(tx => {
      if (tx.status === 'Purchased' || tx.status === 'Pending Refund') {
        const bId = tx.bookId;
        purchaseCounts[bId] = (purchaseCounts[bId] || 0) + (tx.quantity || 1);
      }
    });

    // Map to books and sort by purchase count
    const scored = books
      .filter(b => b.category !== 'Religious/ धार्मिक')
      .map(book => ({
        book,
        count: purchaseCounts[book._id || book.id] || 0,
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return scored;
  }, [books, history]);

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

  if (trendingBooks.length < 2) return null;

  return (
    <div className="w-full bg-gradient-to-b from-[#1a0f0a] via-[#2c1810] to-[#1a0f0a] py-20 border-t border-amber-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-14 gap-4 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-sm mb-2 backdrop-blur-sm">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase font-sans text-amber-300">Trending Now</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif text-white tracking-tight font-bold">
            Most <span className="italic text-amber-400 font-medium">Popular</span> Books
          </h2>
          <p className="text-amber-200/50 font-serif text-lg max-w-2xl mx-auto mt-1">
            Discover what everyone is reading — our bestsellers based on real purchases.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative group/carousel">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/90 hover:bg-white text-[#3e2723] rounded-full shadow-xl flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer backdrop-blur-sm border border-amber-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/90 hover:bg-white text-[#3e2723] rounded-full shadow-xl flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer backdrop-blur-sm border border-amber-100"
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
            {trendingBooks.map(({ book, count }, index) => (
              <div key={book._id || book.id} className="min-w-[280px] max-w-[280px] flex-shrink-0 relative">
                {/* Rank Badge */}
                <div className="absolute -top-3 -left-2 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-500/30">
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">#{index + 1}</span>
                </div>
                {/* Purchase Count Badge */}
                <div className="absolute -top-3 -right-2 z-10 px-2.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-md border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-700">{count} sold</span>
                </div>
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
