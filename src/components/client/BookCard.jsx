import React from 'react';
import { BookOpen, CheckCircle, Clock, Heart } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import StarRating from '../common/StarRating';

export default function BookCard({ book, onSelect, onPurchase }) {
  const { getAverageRating, getBookReviews, toggleWishlist, isInWishlist } = useLibrary();
  const isAvailable = book.available > 0;
  const bookId = book._id || book.id;
  const avgRating = getAverageRating(bookId);
  const reviewCount = getBookReviews(bookId).length;
  const wishlisted = isInWishlist(bookId);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Book Visual Thumbnail */}
        <div 
          onClick={() => onSelect(book)}
          className="h-52 w-full bg-slate-100 rounded-2xl mb-4 flex items-center justify-center cursor-pointer group-hover:scale-[1.02] transition-transform relative overflow-hidden shadow-inner border border-slate-100"
        >
          {book.coverImages && book.coverImages.length > 0 ? (
            <img
              src={book.coverImages[0]}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-slate-200 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-amber-400 opacity-60" />
            </div>
          )}

          {/* Category badge */}
          <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-slate-700 shadow-sm">
            {book.category}
          </span>
          
          {/* Discount badge */}
          {book.discount > 0 && (
            <span className="absolute top-3 right-3 text-xs font-black px-2.5 py-1 bg-rose-500 text-white rounded-full shadow-md shadow-rose-500/30">
              Discount
              -{book.discount}%
            </span>
          )}

          {/* NEW badge */}
          {book.isNewRelease && (
            <span className={`absolute ${book.discount > 0 ? 'top-11' : 'top-3'} right-3 text-[10px] font-extrabold px-2 py-0.5 bg-[#00a86b] text-white rounded-full shadow-md uppercase`}>
              NEW
            </span>
          )}

          {/* Wishlist heart */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(bookId); }}
            className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md shadow-sm transition-all cursor-pointer ${
              wishlisted 
                ? 'bg-rose-500 text-white' 
                : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
            }`}
          >
            <Heart className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Book Details */}
        <h3 
          onClick={() => onSelect(book)}
          className="font-bold text-slate-800 text-lg group-hover:text-amber-600 cursor-pointer line-clamp-1 transition-colors"
        >
          {book.title}
        </h3>
        <p className="text-xs text-slate-400 font-medium mb-1">By {book.author}</p>

        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-1">
            <StarRating rating={avgRating} size="sm" />
            <span className="text-xs text-slate-400">({reviewCount})</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-amber-600">
            Rs. {((book.price || 0) * (1 - (book.discount || 0) / 100)).toLocaleString()}
          </p>
          {book.discount > 0 && (
            <p className="text-xs font-medium text-slate-400 line-through">
              Rs. {(book.price || 0).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
        {/* Availability Badge */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {isAvailable ? (
            <span className="text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" /> {book.available} In Stock
            </span>
          ) : (
            <span className="text-rose-600 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" /> Out of Stock
            </span>
          )}
        </div>

        {/* View Details Button */}
        <button
          onClick={() => onSelect(book)}
          className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-amber-500 hover:text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          View Details
        </button>
      </div>
    </div>
  );
}