import React, { useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import BookCard from './BookCard';
import { PenTool, ArrowRight } from 'lucide-react';

export default function AuthorSpotlight({ onSelectBook, onPurchaseBook }) {
  const { books, storeSettings } = useLibrary();

  const spotlightData = useMemo(() => {
    // Only render if admin has configured the spotlight
    if (!storeSettings?.authorSpotlightName || !storeSettings?.authorSpotlightBookIds || storeSettings.authorSpotlightBookIds.length === 0) {
      return null;
    }

    const adminAuthor = storeSettings.authorSpotlightName;
    const selectedIds = storeSettings.authorSpotlightBookIds;
    
    // Find the specific books selected by admin
    const authorBooks = books.filter(b => selectedIds.includes(b._id || b.id)).slice(0, 3);
    
    if (authorBooks.length === 0) return null;

    return {
      author: adminAuthor,
      bio: storeSettings.authorSpotlightBio || `Dive into the captivating world of ${adminAuthor}, one of the most compelling voices in our collection.`,
      books: authorBooks
    };
  }, [books, storeSettings]);

  if (!spotlightData || spotlightData.books.length === 0) return null;

  return (
    <div className="w-full bg-[#3e2723] text-[#fcfaf7] py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#c28453] rounded-full blur-[100px] opacity-20"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500 rounded-full blur-[100px] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left Content - Author Info */}
          <div className="lg:w-1/3 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 shadow-sm">
              <PenTool className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-sans text-amber-200">Author Spotlight</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-serif tracking-tight font-bold leading-tight">
              Meet <span className="text-amber-400 italic font-medium">{spotlightData.author}</span>
            </h2>
            
            <p className="text-[#d1c0a8] font-serif text-lg leading-relaxed mt-2">
              {spotlightData.bio}
            </p>

            <button 
              className="mt-4 flex items-center gap-2 text-amber-400 font-bold tracking-wider uppercase text-xs hover:text-amber-300 transition-colors group/btn"
              onClick={() => {
                // If there's a search function or discover nav, we could trigger it here.
              }}
            >
              Explore Full Collection
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Content - Books */}
          <div className="lg:w-2/3 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {spotlightData.books.map((book) => (
                <div key={book._id || book.id} className="relative z-10 group/card">
                  {/* Subtle glow behind card to make it pop from dark background */}
                  <div className="absolute inset-0 bg-amber-500/20 blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  <div className="relative bg-white text-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                     <BookCard 
                        book={book}
                        onSelect={onSelectBook}
                        onPurchase={onPurchaseBook}
                     />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
