import React, { useMemo, useRef, useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import BookCard from './BookCard';
import { Tag, Percent, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

export default function HotDeals({ onSelectBook, onPurchaseBook }) {
  const { books } = useLibrary();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const discountedBooks = useMemo(() => {
    return books
      .filter(b => b.discount > 0 && b.category !== 'Religious/ धार्मिक')
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 10);
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

  if (discountedBooks.length === 0) return null;

  // Calculate max discount for headline
  const maxDiscount = Math.max(...discountedBooks.map(b => b.discount));

  return (
    <div className="w-full bg-gradient-to-br from-[#fff8f0] via-[#fff1e0] to-[#fff8f0] py-20 border-t border-orange-200/50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 right-10 w-60 h-60 bg-orange-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-red-300/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-14 gap-4 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-orange-500/20 mb-2">
            <Zap className="w-4 h-4 text-white" fill="white" />
            <span className="text-[10px] font-black tracking-[0.25em] uppercase font-sans text-white">Hot Deals</span>
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#3e2723] tracking-tight font-bold">
            Save Up To <span className="italic text-[#d32f2f] font-black">{maxDiscount}%</span> Off
          </h2>
          <p className="text-[#6d5b53] font-serif text-lg max-w-2xl mx-auto mt-1">
            Grab these amazing deals before they're gone. Limited time discounts on your favorite reads!
          </p>
        </div>

        {/* Carousel */}
        <div className="relative group/carousel">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white hover:bg-orange-50 text-[#d32f2f] rounded-full shadow-xl flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer border border-orange-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white hover:bg-orange-50 text-[#d32f2f] rounded-full shadow-xl flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer border border-orange-200"
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
            {discountedBooks.map((book) => (
              <div key={book._id || book.id} className="min-w-[280px] max-w-[280px] flex-shrink-0 relative">
                {/* Savings Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg shadow-red-500/30 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">
                    Save Rs. {Math.round((book.price || 0) * (book.discount / 100)).toLocaleString()}
                  </span>
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
