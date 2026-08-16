import React, { useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import BookCard from './BookCard';

export default function Recommendation({ currentUser, onSelectBook, onPurchaseBook }) {
  const { books, history, wishlist } = useLibrary();

  const recommendedBooks = useMemo(() => {
    // 1. Exclude religious section from general recommendations
    const generalBooks = books.filter(b => b.category !== 'Religious/ धार्मिक');

    // 2. Identify user preferences
    const purchasedBookIds = new Set();
    const userCategories = {};
    const userAuthors = {};

    history.forEach(order => {
      if (order.status === 'Purchased' || order.status === 'Pending Refund') {
        purchasedBookIds.add(order.bookId);
        
        // Find the book to get category and author
        const book = books.find(b => (b._id || b.id) === order.bookId);
        if (book) {
          userCategories[book.category] = (userCategories[book.category] || 0) + 1;
          userAuthors[book.author] = (userAuthors[book.author] || 0) + 1;
        }
      }
    });

    wishlist.forEach(item => {
      const book = item.bookId || item; // Depends on how wishlist is populated
      if (book && book.category) {
        userCategories[book.category] = (userCategories[book.category] || 0) + 2; 
        userAuthors[book.author] = (userAuthors[book.author] || 0) + 2;
      }
    });

    // 3. Score each book
    const scoredBooks = generalBooks.map(book => {
      const bookId = book._id || book.id;
      
      // Do not recommend already purchased books
      if (purchasedBookIds.has(bookId)) {
        return { book, score: -1 }; 
      }

      let score = 0;

      // Category match
      if (userCategories[book.category]) {
        score += userCategories[book.category] * 2;
      }

      // Author match
      if (userAuthors[book.author]) {
        score += userAuthors[book.author] * 2;
      }

      // Wishlist match (direct match)
      const inWishlist = wishlist.some(item => {
        const id = item.bookId?._id || item.bookId || item._id;
        return id === bookId;
      });
      if (inWishlist) {
        score += 10;
      }
      
      // Stock bonus
      if (book.available > 0) {
         score += 1;
      }

      // Add a tiny random factor to break ties and keep things fresh
      score += Math.random() * 0.5;

      return { book, score };
    });

    // 4. Filter out negative scores, sort by score desc, pick top 8
    return scoredBooks
      .filter(item => item.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.book);
  }, [books, history, wishlist]);

  if (recommendedBooks.length === 0) return null;

  return (
    <div className="w-full bg-[#fcfaf7] py-20 border-t border-[#eadac2]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-16 gap-4 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#f9f4ec] border border-[#eadac2] shadow-sm mb-2">
            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shadow-sm text-[#a0683a]">★</span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-sans pr-2 text-[#a0683a]">Curated</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#3e2723] tracking-tight font-bold">
            Recommended for <span className="italic text-[#a0683a] font-medium">You</span>
          </h2>
          <p className="text-[#6d5b53] font-serif text-lg max-w-2xl mx-auto mt-2">
            Handpicked titles based on your reading history and wishlist.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendedBooks.map((book) => (
            <BookCard
              key={book._id || book.id}
              book={book}
              onSelect={onSelectBook}
              onPurchase={onPurchaseBook}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
