import React from 'react';

export default function ClientExperience({ onStoryClick }) {
  return (
    <section className="w-full bg-[#fcfaf7] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2rem] p-8 sm:p-12 lg:p-16 border border-[#eadac2] shadow-sm flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
        {/* Left Column: Text Content */}
        <div className="order-2 lg:order-1 flex flex-col items-start">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#f9f4ec] border border-[#eadac2] shadow-sm mb-6">
            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shadow-sm text-[#a0683a]">01</span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-sans pr-2 text-[#a0683a]">The Experience</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-serif text-[#3e2723] leading-[1.1] font-bold tracking-tight mb-8">
            The Magic of <br/> <span className="italic text-[#a0683a] font-medium">Discovering</span> Nepali Literature.
          </h2>
          
          <div className="space-y-6 text-[#6d5b53] text-[15px] sm:text-base leading-relaxed mb-10 font-serif">
            <p>
              We believe that reading our own stories is more than just absorbing words; it is a profound connection to our roots. The crisp sound of turning a fresh page, the distinctive scent of high-grade paper, and the satisfying weight of a classic hardcover holding the tales of our ancestors — these are irreplaceable sensory luxuries.
            </p>
            <p className="font-semibold text-[#8a5a44]">
              Every order from our shelves is treated with the utmost reverence. We meticulously hand-pack each volume so that the moment it arrives at your doorstep, you experience the genuine joy of unwrapping a perfect Nepali literary treasure.
            </p>
          </div>
          
          <button 
            onClick={onStoryClick}
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white border-2 border-[#eadac2] hover:border-[#a0683a] text-[#3e2723] text-xs font-bold tracking-[0.15em] uppercase transition-all rounded-full shadow-sm hover:shadow-md cursor-pointer group"
          >
            Read Our Story
            <svg className="w-4 h-4 ml-2 text-[#a0683a] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
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
    </section>
  );
}
