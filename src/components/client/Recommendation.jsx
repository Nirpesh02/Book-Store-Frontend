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
    <div className="mt-20 pt-12 border-t border-stone-200/60">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-[10px] font-bold text-[#c28453] tracking-widest uppercase">Curated</span>
        <div className="w-8 h-[1px] bg-[#c28453]/40"></div>
        <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight">
          Recommended for You
        </h2>
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
  );
}
