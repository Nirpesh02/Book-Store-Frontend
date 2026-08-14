import React from 'react';

export default function ClientExperience({ onStoryClick }) {
  return (
    <div className="mb-16 bg-white rounded-3xl p-6 sm:p-10 lg:p-16 border border-stone-100 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column: Text Content */}
        <div className="order-2 lg:order-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-bold text-[#c28453] tracking-widest uppercase">01</span>
            <div className="w-8 h-[1px] bg-[#c28453]/40"></div>
            <span className="text-[10px] font-bold text-stone-500 tracking-widest uppercase">The Experience</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-stone-900 leading-[1.15] tracking-tight mb-8">
            The magic of discovering Nepali literature.
          </h2>
          
          <div className="space-y-6 text-stone-600 text-sm sm:text-base leading-relaxed mb-10">
            <p>
              We believe that reading our own stories is more than just absorbing words; it is a connection to our roots. The crisp sound of turning a fresh page, the distinctive scent of high-grade paper, and the satisfying weight of a classic hardcover holding the tales of our ancestors — these are irreplaceable sensory luxuries.
            </p>
            <p>
              Every order from our shelves is treated with the utmost reverence. We meticulously hand-pack each volume so that the moment it arrives at your doorstep, you experience the genuine joy of unwrapping a perfect Nepali literary treasure.
            </p>
          </div>
          
          <button 
            onClick={onStoryClick}
            className="inline-flex items-center justify-center px-6 py-3 border border-stone-300 hover:border-stone-500 text-stone-800 text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer bg-transparent"
          >
            Read Our Story
          </button>
        </div>

        {/* Right Column: Image */}
        <div className="order-1 lg:order-2 w-full">
          <img 
            src="/Video and photo/cozy_book_unboxing.png" 
            alt="Cozy book unboxing experience" 
            className="w-full h-auto object-cover rounded-xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
