import React, { useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Quote, Star } from 'lucide-react';
import StarRating from '../common/StarRating';

export default function ClientReviewsWall({ onSelectBook }) {
  const { reviews, books } = useLibrary();

  const topReviews = useMemo(() => {
    // Get the most recent 5-star or 4-star reviews with text comments
    const goodReviews = reviews.filter(r => r.rating >= 4 && r.comment && r.comment.length > 10);
    
    // Sort by newest first (assuming _id implies creation order)
    const sortedReviews = goodReviews.sort((a, b) => {
        const idA = a._id || a.id || '';
        const idB = b._id || b.id || '';
        return idB.toString().localeCompare(idA.toString());
    });

    // Map the book to each review, taking at most 6
    const reviewsWithBooks = [];
    for (const review of sortedReviews) {
      const book = books.find(b => (b._id || b.id) === review.bookId);
      if (book && book.category !== 'Religious/ धार्मिक') {
        reviewsWithBooks.push({ ...review, book });
      }
      if (reviewsWithBooks.length >= 6) break;
    }
    
    return reviewsWithBooks;
  }, [reviews, books]);

  if (topReviews.length === 0) return null;

  return (
    <div className="w-full bg-[#f4ebd9]/30 py-24 border-y border-[#eadac2]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16 gap-3">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-[#eadac2] shadow-sm mb-2">
            <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-sans text-[#a0683a]">Trusted by Readers</span>
            <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#3e2723] tracking-tight font-bold">
            What Our Readers <span className="italic text-[#c28453] font-medium">Say</span>
          </h2>
          <p className="text-[#6d5b53] font-serif text-lg max-w-2xl mx-auto mt-2">
            Discover why thousands of book lovers choose किताबघर for their reading journey.
          </p>
        </div>

        {/* Reviews Grid (Masonry-ish layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topReviews.map((review, index) => (
            <div 
              key={review._id || review.id || index}
              className={`bg-white rounded-3xl p-8 shadow-sm border border-[#eadac2]/50 hover:shadow-md hover:border-[#eadac2] transition-all duration-300 relative group flex flex-col ${index === 1 || index === 4 ? 'md:translate-y-6' : ''}`}
            >
              <div className="absolute top-6 right-6 opacity-5 text-[#c28453] group-hover:scale-110 group-hover:opacity-10 transition-all duration-300">
                <Quote size={80} />
              </div>
              
              <div className="mb-6 z-10">
                <StarRating rating={review.rating} size="sm" />
              </div>

              <p className="text-[#3e2723] font-serif text-lg leading-relaxed flex-grow z-10 italic">
                "{review.comment}"
              </p>

              <div className="mt-8 pt-6 border-t border-[#eadac2]/30 flex items-center justify-between z-10">
                <div>
                  <p className="text-sm font-bold text-[#3e2723] uppercase tracking-wider">{review.customerName || 'Anonymous Reader'}</p>
                  <p className="text-xs text-[#8a5a44] mt-1">Verified Buyer</p>
                </div>
                
                {review.book && (
                  <div 
                    onClick={() => onSelectBook(review.book)}
                    className="flex items-center gap-3 bg-[#fcfaf7] pl-3 pr-4 py-2 rounded-full border border-[#eadac2]/50 cursor-pointer hover:bg-[#f9f4ec] transition-colors group/book"
                  >
                    {review.book.coverImages?.[0] ? (
                      <img 
                        src={review.book.coverImages[0]} 
                        alt={review.book.title} 
                        className="w-8 h-10 object-cover rounded shadow-sm group-hover/book:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-8 h-10 bg-[#eadac2] rounded flex items-center justify-center shadow-sm">
                        <span className="text-[8px] font-serif text-[#6d5b53]">{review.book.title.substring(0, 1)}</span>
                      </div>
                    )}
                    <div className="flex flex-col w-20 sm:w-28">
                      <span className="text-[10px] font-bold text-[#3e2723] truncate leading-tight">{review.book.title}</span>
                      <span className="text-[9px] text-[#8a5a44] truncate">{review.book.author}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
