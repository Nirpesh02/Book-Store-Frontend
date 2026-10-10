import React, { useMemo, useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Star, BookOpen, Heart, ShoppingCart, Award, Sparkles } from 'lucide-react';
import StarRating from '../common/StarRating';

export default function BookOfTheWeek({ onSelectBook, onPurchaseBook }) {
  const { books, reviews, getAverageRating, getBookReviews, toggleWishlist, isInWishlist } = useLibrary();
  const [imageError, setImageError] = useState(false);

  const featuredBook = useMemo(() => {
    // Pick the book with the highest average rating (minimum 2 reviews)
    // If no reviewed books, pick the newest with isNewRelease
    const generalBooks = books.filter(b => b.category !== 'Religious/ धार्मिक');

    let best = null;
    let bestScore = -1;

    generalBooks.forEach(book => {
      const bookId = book._id || book.id;
      const bookReviews = reviews.filter(r => r.bookId === bookId);
      if (bookReviews.length >= 2) {
        const avg = bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length;
        const score = avg * bookReviews.length; // weighted score
        if (score > bestScore) {
          bestScore = score;
          best = book;
        }
      }
    });

    // Fallback: newest release with cover image
    if (!best) {
      best = generalBooks
        .filter(b => b.isNewRelease && b.coverImages?.length > 0)
        .sort((a, b) => {
          const idA = a._id || a.id || '';
          const idB = b._id || b.id || '';
          return idB.toString().localeCompare(idA.toString());
        })[0];
    }

    // Final fallback: newest book with cover
    if (!best) {
      best = generalBooks
        .filter(b => b.coverImages?.length > 0)
        .sort((a, b) => {
          const idA = a._id || a.id || '';
          const idB = b._id || b.id || '';
          return idB.toString().localeCompare(idA.toString());
        })[0];
    }

    return best;
  }, [books, reviews]);

  if (!featuredBook) return null;

  const bookId = featuredBook._id || featuredBook.id;
  const avgRating = getAverageRating(bookId);
  const reviewCount = getBookReviews(bookId).length;
  const wishlisted = isInWishlist(bookId);
  const discountedPrice = (featuredBook.price || 0) * (1 - (featuredBook.discount || 0) / 100);

  return (
    <div className="w-full bg-gradient-to-br from-[#fcfaf7] via-[#f9f1e3] to-[#fcfaf7] py-20 border-t border-[#eadac2]/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-14 gap-4 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-[#eadac2] shadow-sm mb-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase font-sans text-[#a0683a]">Editor's Pick</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#3e2723] tracking-tight font-bold">
            Book of the <span className="italic text-[#a0683a] font-medium">Week</span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Book Cover */}
          <div className="flex justify-center">
            <div 
              onClick={() => onSelectBook(featuredBook)}
              className="relative cursor-pointer group"
            >
              {/* Decorative glow behind */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 to-orange-300/30 rounded-3xl blur-2xl scale-110 group-hover:scale-115 transition-transform duration-700"></div>
              
              <div className="relative h-[420px] w-[300px] sm:h-[500px] sm:w-[360px] rounded-2xl overflow-hidden shadow-2xl shadow-amber-900/20 border border-[#eadac2]/60 group-hover:shadow-amber-700/30 group-hover:-translate-y-2 transition-all duration-500 bg-[#f9f4ec]">
                {featuredBook.coverImages?.length > 0 && !imageError ? (
                  <img
                    src={featuredBook.coverImages[0]}
                    alt={featuredBook.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#f4ebd9] to-[#eadac2] flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-[#c28453] opacity-40" />
                  </div>
                )}

                {/* Overlay badges */}
                {featuredBook.discount > 0 && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-[#d32f2f] text-white text-xs font-black rounded-full shadow-lg">
                    -{featuredBook.discount}%
                  </div>
                )}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-amber-500 text-white text-[10px] font-black rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Featured
                </div>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-[#f9f4ec] border border-[#eadac2] rounded-full text-[10px] font-bold text-[#a0683a] uppercase tracking-widest">
                {featuredBook.category}
              </span>
              <h3 
                onClick={() => onSelectBook(featuredBook)}
                className="text-3xl sm:text-4xl font-serif text-[#3e2723] font-bold leading-tight cursor-pointer hover:text-[#c28453] transition-colors"
              >
                {featuredBook.title}
              </h3>
              {featuredBook.englishTitle && featuredBook.englishTitle !== featuredBook.title && (
                <p className="text-lg text-[#8a5a44] font-serif italic">{featuredBook.englishTitle}</p>
              )}
              <p className="text-sm text-[#a0683a] font-medium uppercase tracking-wider">By {featuredBook.author}</p>
            </div>

            {/* Rating */}
            {reviewCount > 0 && (
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <StarRating rating={avgRating} size="md" />
                <span className="text-sm text-[#6d5b53] font-bold">
                  {avgRating.toFixed(1)} · {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            )}

            {/* Description */}
            {featuredBook.description && (
              <p className="text-[#6d5b53] font-serif text-base leading-relaxed line-clamp-4">
                {featuredBook.description}
              </p>
            )}

            {/* Editorial Note */}
            <div className="bg-white/70 backdrop-blur-sm border border-[#eadac2]/60 rounded-2xl p-5 relative">
              <div className="absolute -top-3 left-5 px-3 py-1 bg-amber-500 text-white text-[9px] font-black rounded-full uppercase tracking-wider">
                Why We Love It
              </div>
              <p className="text-[#6d5b53] font-serif text-sm leading-relaxed italic mt-2">
                {featuredBook.description 
                  ? `"${featuredBook.description.substring(0, 150)}${featuredBook.description.length > 150 ? '...' : ''}" — A must-read from our curated collection.`
                  : `"A beautifully crafted work by ${featuredBook.author} that captivates readers from the very first page." — किताबघर Team`
                }
              </p>
            </div>

            {/* Price & Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#c28453]">Rs. {discountedPrice.toLocaleString()}</span>
                {featuredBook.discount > 0 && (
                  <span className="text-lg text-[#8a5a44] line-through opacity-50">Rs. {(featuredBook.price || 0).toLocaleString()}</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
              <button
                onClick={() => onSelectBook(featuredBook)}
                className="px-8 py-3.5 bg-[#3e2723] text-white rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#2c1f17] hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-sm cursor-pointer"
              >
                View Details
              </button>
              <button
                onClick={() => toggleWishlist(bookId)}
                className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                  wishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'bg-white border-[#eadac2] text-[#6d5b53] hover:text-rose-500 hover:border-rose-200'
                }`}
              >
                <Heart className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
