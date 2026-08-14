import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { useToast } from '../../context/ToastContext';
import { SlidersHorizontal, Send } from 'lucide-react';
import BookCard from './BookCard';
import ClientHero from './ClientHero';
import ClientEthos from './ClientEthos';
import ClientExperience from './ClientExperience';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Home View Sections */}
      {clientTab === 'home' && (
        <>
          <ClientHero onExplore={onNavigateToDiscover} onStoryClick={onNavigateToStory} />
          <ClientExperience onStoryClick={onNavigateToStory} />
          <ClientEthos />
        </>
      )}

      {/* Discover View Sections */}
      {clientTab === 'explore' && (
        <div className="space-y-8">
          {/* Top Banner for Discover Page */}
          <div className="w-full py-12 sm:py-16 md:py-20 flex items-center justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#3e2723] font-bold tracking-tight">
              Bestselling Nepali Books
            </h1>
          </div>

          <div id="catalog-section" className="space-y-8 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-bold text-[#c28453] tracking-widest uppercase">01</span>
                <div className="w-8 h-[1px] bg-[#c28453]/40"></div>
                <span className="text-[10px] font-bold text-stone-500 tracking-widest uppercase">Curated Catalog</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 tracking-tight">
                Explore Our Collection
              </h2>
              <p className="text-sm text-stone-500 mt-2 italic font-serif">
                Showing {processedBooks.length} beautifully bound volumes
              </p>
            </div>
            
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#fcfaf7] border border-stone-200 text-stone-700 rounded-sm text-xs font-bold tracking-widest uppercase hover:bg-white hover:border-stone-300 transition-colors shadow-sm cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#c28453]" />
              Filter & Sort
            </button>
          </div>

          {/* Grid of Books */}
          {processedBooks.length > 0 ? (
            <div className="space-y-10">
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
                    className="px-8 py-3 bg-[#c28453] text-white rounded-sm text-xs font-bold tracking-widest uppercase hover:bg-[#a0683a] transition-colors shadow-sm cursor-pointer"
                  >
                    See More
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#fbfaf7] border border-stone-200/60 rounded-sm flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm border border-stone-100">
                <SlidersHorizontal className="w-6 h-6 text-[#c28453]" />
              </div>
              <p className="text-xl font-serif text-stone-900">No volumes found.</p>
              <p className="text-sm text-stone-500">Try adjusting your filters or search query to discover a new story.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setInStockOnly(false);
                }}
                className="mt-6 px-6 py-2.5 bg-[#f4ebd9] text-[#a0683a] rounded-sm text-xs font-bold tracking-widest uppercase hover:bg-[#ebdcc2] transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Recommendation Section */}
      {clientTab === 'explore' && (
        <Recommendation 
          currentUser={currentUser} 
          onSelectBook={onSelectBook} 
          onPurchaseBook={handlePurchase} 
        />
      )}

      {/* Religious Books Section (Fifth) */}
      {clientTab === 'explore' && (
        <ReligiousBooksSection onSelectBook={onSelectBook} onPurchaseBook={handlePurchase} />
      )}

      {/* Manager Message Section */}
      {clientTab === 'home' && <ManagerMessage />}

      {/* Payment Methods Section */}
      {clientTab === 'home' && (
        <div className="mt-16 pt-8 border-t border-slate-200">
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
    </div>
  );
}