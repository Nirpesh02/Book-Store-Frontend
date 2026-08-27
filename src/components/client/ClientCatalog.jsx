import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { useToast } from '../../context/ToastContext';
import { SlidersHorizontal, Send } from 'lucide-react';
import BookCard from './BookCard';
import ClientHero from './ClientHero';
import ClientEthos from './ClientEthos';
import ClientExperience from './ClientExperience';
import ClientHeritage from './ClientHeritage';
import ClientCommunity from './ClientCommunity';
import ClientStatsChart from './ClientStatsChart';
import ReligiousBooksSection from './ReligiousBooksSection';
import FilterDrawer from './FilterDrawer';
import ManagerMessage from './ManagerMessage';
import Recommendation from './Recommendation';

export default function ClientCatalog({ currentUser, onSelectBook, onNavigateToStory, clientTab, onNavigateToDiscover }) {
  const { books, purchaseBook, searchQuery, setSearchQuery } = useLibrary();
  const { addToast } = useToast();
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState('newest'); // newest, popular, az
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAllBooks, setShowAllBooks] = useState(false);

  const categories = ['All', 'Fiction', 'Story', 'Sci-Fi', 'Historical', 'Self-Help'];

  // Apply Filters & Sorting
  let processedBooks = books.filter((b) => {
    // 1. Category Filter
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    
    // 2. Search Filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      b.title.toLowerCase().includes(searchLower) ||
      (b.englishTitle && b.englishTitle.toLowerCase().includes(searchLower)) ||
      b.author.toLowerCase().includes(searchLower);
      
    // 3. Stock Filter
    const matchesStock = inStockOnly ? b.availableCopies > 0 : true;

    // 4. Exclude Religious section books from main catalog
    const isReligious = b.category === 'Religious/ धार्मिक';

    return matchesCategory && matchesSearch && matchesStock && !isReligious;
  });

  // Apply Sorting
  processedBooks.sort((a, b) => {
    if (sortOption === 'az') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'popular') {
      // Assuming books with fewer available copies relative to total might be more popular, 
      // or we just sort by totalCopies descending as a proxy since we don't have a 'views' or 'sales' field.
      // Let's sort by availableCopies descending for now, to show books that are highly available, or ascending to show scarce.
      // A better proxy: ID descending if no rating/sales data is available. Let's just use availableCopies desc.
      return b.availableCopies - a.availableCopies; 
    } else {
      // Newest (Default) - Assuming _id is a mongo object id which contains timestamp
      const idA = a._id || a.id || '';
      const idB = b._id || b.id || '';
      return idB.toString().localeCompare(idA.toString());
    }
  });

  const visibleBooks = showAllBooks ? processedBooks : processedBooks.slice(0, 8);

  const handlePurchase = async (bookId) => {
    const book = books.find((b) => (b._id || b.id) === bookId);
    const result = await purchaseBook(bookId, currentUser?.name || 'Customer');
    if (result.success && book) {
      addToast(`"${book.title}" purchased successfully!`, 'success', 10000);
    } else if (!result.success) {
      addToast(result.message || 'Checkout failed. Please try again.', 'error');
    }
  };

  // Get the newest book for the Hero section (prioritizing books marked as 'New')
  const newReleaseBooks = books ? books.filter(b => b.isNewRelease) : [];
  let newestBook = null;
  
  if (newReleaseBooks.length > 0) {
    newestBook = [...newReleaseBooks].sort((a, b) => {
        const idA = a._id || a.id || '';
        const idB = b._id || b.id || '';
        return idB.toString().localeCompare(idA.toString());
    })[0];
  } else if (books && books.length > 0) {
    newestBook = [...books].sort((a, b) => {
        const idA = a._id || a.id || '';
        const idB = b._id || b.id || '';
        return idB.toString().localeCompare(idA.toString());
    })[0];
  }

  return (
    <>
      {/* Home View Sections - FULL WIDTH */}
      {clientTab === 'home' && (
        <div className="w-full flex flex-col">
          <ClientHero onExplore={onNavigateToDiscover} onStoryClick={onNavigateToStory} newestBook={newestBook} />
          <ClientExperience onStoryClick={onNavigateToStory} />
          <ClientEthos />
          <ClientHeritage />
          <ClientCommunity />
          <ClientStatsChart />
          <ManagerMessage />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full border-t border-slate-200 mt-16">
            <h3 className="text-xl font-medium text-slate-800 mb-6 text-center sm:text-left">Payment Methods</h3>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              {/* eSewa */}
              <div className="h-14 px-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:border-[#60bb46]/30 cursor-pointer">
                <div className="flex items-center text-[#60bb46]">
                  <span className="bg-[#60bb46] text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm mr-1.5 shadow-inner">e</span>
                  <span className="font-medium text-2xl tracking-tight">Sewa</span>
                </div>
              </div>
              
              {/* khalti by IME */}
              <div className="h-14 px-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:border-[#df2028]/30 cursor-pointer relative">
                <div className="flex flex-col items-end">
                  <div className="flex items-start text-[#df2028]">
                    <span className="font-bold text-2xl tracking-tighter lowercase">khalti</span>
                    <Send className="w-4 h-4 ml-0.5 -mt-1 transform rotate-45" fill="currentColor" />
                  </div>
                  <span className="text-[9px] text-[#df2028] -mt-1 font-medium tracking-tight">by IME</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discover View Sections - CONSTRAINED WIDTH */}
      {clientTab === 'explore' && (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
            <div className="space-y-8">
              {/* Top Banner for Discover Page */}
            <div className="relative w-full py-24 sm:py-32 md:py-40 rounded-[2rem] overflow-hidden mb-8 shadow-md flex flex-col items-center justify-center text-center px-4 group">
              {/* Video Background */}
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              >
                <source src="/Video and photo/video2.mp4" type="video/mp4" />
              </video>
              
              {/* Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
              
              {/* Content */}
              <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="w-8 sm:w-16 h-[1.5px] bg-[#eadac2]/60"></span>
                  <span className="text-[10px] sm:text-xs font-bold text-[#eadac2] tracking-[0.25em] uppercase font-sans drop-shadow-sm">
                    Discover The Magic of Words
                  </span>
                  <span className="w-8 sm:w-16 h-[1.5px] bg-[#eadac2]/60"></span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white font-bold tracking-tight leading-[1.1] pb-2 drop-shadow-xl">
                  Bestselling <span className="text-[#eadac2] italic font-medium">Nepali</span> Books
                </h1>
                
                <p className="text-stone-200 font-serif text-lg md:text-xl px-4 sm:px-12 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                  Immerse yourself in our handpicked collection of timeless classics, captivating stories, and modern masterpieces that capture the true essence of Nepali literature.
                </p>
              </div>
            </div>

              <div id="catalog-section" className="space-y-8 mt-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-4">
                  <div>
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#f9f4ec] border border-[#eadac2] shadow-sm mb-4">
                      <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shadow-sm text-[#a0683a]">01</span>
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-sans pr-2 text-[#a0683a]">Curated Catalog</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif text-[#3e2723] tracking-tight font-bold">
                      Explore Our Collection
                    </h2>
                    <p className="text-sm text-stone-500 mt-2 italic font-serif">
                      Showing {processedBooks.length} beautifully bound volumes
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-[#eadac2] text-[#3e2723] rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:shadow-md hover:-translate-y-0.5 transition-all shadow-sm cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#a0683a]" />
                    Filter & Sort
                  </button>
                </div>

                {/* Grid of Books */}
                {processedBooks.length > 0 ? (
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {visibleBooks.map((book) => (
                        <BookCard
                          key={book._id || book.id}
                          book={book}
                          onSelect={onSelectBook}
                          onPurchase={handlePurchase}
                        />
                      ))}
                    </div>
                    
                    {!showAllBooks && processedBooks.length > 8 && (
                      <div className="flex justify-center pt-2 pb-8">
                        <button
                          onClick={() => setShowAllBooks(true)}
                          className="px-8 py-3.5 bg-[#3e2723] text-white rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#2c1f17] hover:shadow-lg hover:-translate-y-1 transition-all shadow-sm cursor-pointer"
                        >
                          See More
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-[#fcfaf7] border border-[#eadac2] rounded-[2rem] flex flex-col items-center justify-center space-y-5 shadow-sm">
                    <div className="w-20 h-20 bg-[#f4ebd9] rounded-full flex items-center justify-center mb-2 shadow-sm border border-white">
                      <SlidersHorizontal className="w-8 h-8 text-[#a0683a]" />
                    </div>
                    <p className="text-2xl font-serif text-[#3e2723] font-bold">No volumes found.</p>
                    <p className="text-[#6d5b53] font-serif text-lg">Try adjusting your filters or search query to discover a new story.</p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setInStockOnly(false);
                      }}
                      className="mt-6 px-8 py-3.5 bg-white border border-[#eadac2] text-[#3e2723] rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#f9f4ec] transition-all shadow-sm cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recommendation Section */}
          <Recommendation 
            currentUser={currentUser} 
            onSelectBook={onSelectBook} 
            onPurchaseBook={handlePurchase} 
          />

          {/* Religious Books Section (Fifth) */}
          <ReligiousBooksSection onSelectBook={onSelectBook} onPurchaseBook={handlePurchase} />
        </>
      )}

      {/* Slide-Over Drawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        sortOption={sortOption}
        setSortOption={setSortOption}
        categories={categories}
        resultsCount={processedBooks.length}
      />
    </>
  );
}