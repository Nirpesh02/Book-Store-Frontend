import React from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { useToast } from '../../context/ToastContext';
import BookCard from './BookCard';
import { Heart } from 'lucide-react';

export default function Wishlist({ currentUser, onSelectBook }) {
  const { books, wishlist, purchaseBook } = useLibrary();
  const { addToast } = useToast();

  const wishlistBooks = books.filter((b) => wishlist.includes(b._id || b.id));

  const handlePurchase = async (bookId) => {
    const book = books.find((b) => (b._id || b.id) === bookId);
    const result = await purchaseBook(bookId, currentUser?.name || 'Customer');
    if (result.success && book) {
      addToast(`"${book.title}" purchased successfully!`, 'success', 10000);
    } else if (!result.success) {
      addToast(result.message || 'Checkout failed. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500" fill="currentColor" />
          My Wishlist
        </h2>
        <p className="text-xs text-slate-400">{wishlistBooks.length} books saved for later</p>
      </div>

      {wishlistBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistBooks.map((book) => (
            <BookCard
              key={book._id || book.id}
              book={book}
              onSelect={onSelectBook}
              onPurchase={handlePurchase}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
          <Heart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-medium text-lg">Your wishlist is empty</p>
          <p className="text-slate-400 text-xs mt-1">Browse our store and click the heart icon to save books you love!</p>
        </div>
      )}
    </div>
  );
}
