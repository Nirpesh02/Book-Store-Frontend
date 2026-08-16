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
    <div className="bg-white rounded-[1.5rem] border border-[#eadac2]/60 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Book Visual Thumbnail */}
        <div 
          onClick={() => onSelect(book)}
          className="h-56 w-full bg-[#f9f4ec] rounded-2xl mb-5 flex items-center justify-center cursor-pointer group-hover:scale-[1.02] transition-transform relative overflow-hidden shadow-inner border border-[#eadac2]/40"
        >
          {book.coverImages && book.coverImages.length > 0 ? (
            <img
              src={book.coverImages[0]}
              alt={book.title}
              className="w-[85%] h-[90%] object-cover shadow-xl rounded-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#f4ebd9] to-[#eadac2] flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-[#c28453] opacity-50" />
            </div>
          )}

          {/* Category badge */}
          <span className="absolute top-3 left-3 text-[10px] font-bold px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[#6d5b53] shadow-sm uppercase tracking-wider border border-[#eadac2]/50">
            {book.category}
          </span>
          
          {/* Discount badge */}
          {book.discount > 0 && (
            <span className="absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 bg-[#d32f2f] text-white rounded-full shadow-md uppercase tracking-wide">
              -{book.discount}%
            </span>
          )}

          {/* NEW badge */}
          {book.isNewRelease && (
            <span className={`absolute ${book.discount > 0 ? 'top-11' : 'top-3'} right-3 text-[10px] font-extrabold px-3 py-1 bg-[#3e2723] text-white rounded-full shadow-md uppercase tracking-wider`}>
              NEW
            </span>
          )}

          {/* Wishlist heart */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(bookId); }}
            className={`absolute bottom-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-sm transition-all cursor-pointer border border-[#eadac2]/50 ${
              wishlisted 
                ? 'bg-[#d32f2f] text-white border-transparent' 
                : 'bg-white/90 text-[#6d5b53] hover:text-[#d32f2f] hover:bg-white'
            }`}
          >
            <Heart className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Book Details */}
        <h3 
          onClick={() => onSelect(book)}
          className="font-bold font-serif text-[#3e2723] text-lg group-hover:text-[#c28453] cursor-pointer line-clamp-1 transition-colors"
        >
          {book.title}
        </h3>
        <p className="text-xs text-[#a0683a] font-medium mb-1.5 uppercase tracking-wider line-clamp-1">By {book.author}</p>

        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <StarRating rating={avgRating} size="sm" />
            <span className="text-[10px] text-[#6d5b53] font-bold">({reviewCount})</span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-1">
          <p className="text-lg font-bold text-[#c28453]">
            Rs. {((book.price || 0) * (1 - (book.discount || 0) / 100)).toLocaleString()}
          </p>
          {book.discount > 0 && (
            <p className="text-xs font-semibold text-[#8a5a44] line-through opacity-60">
              Rs. {(book.price || 0).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-[#eadac2]/40 flex items-center justify-between mt-4">
        {/* Availability Badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide">
          {isAvailable ? (
            <span className="text-[#388e3c] flex items-center gap-1 bg-[#e8f5e9] px-2.5 py-1.5 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" /> {book.available} In Stock
            </span>
          ) : (
            <span className="text-[#d32f2f] flex items-center gap-1 bg-[#ffebee] px-2.5 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5" /> Out of Stock
            </span>
          )}
        </div>

        {/* View Details Button */}
        <button
          onClick={() => onSelect(book)}
          className="px-4 py-2 bg-white border border-[#eadac2] text-[#3e2723] hover:bg-[#3e2723] hover:text-white hover:border-[#3e2723] rounded-full text-[10px] uppercase font-bold tracking-widest shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center whitespace-nowrap"
        >
          Details
        </button>
      </div>
    </div>
  );
}