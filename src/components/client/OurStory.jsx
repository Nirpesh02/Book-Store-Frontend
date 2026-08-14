import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

export default function OurStory({ onExplore }) {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-[#fcfaf7] min-h-screen pb-24">
      {/* Hero Banner */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh]">
        <img 
          src="/Video and photo/our_story_hero.png" 
          alt="Elegant classic bookstore interior" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/40"></div>
        
        {/* Back Button Overlay */}
        <button 
          onClick={onExplore}
          className="absolute top-6 left-6 sm:top-8 sm:left-8 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white/20 transition-colors z-10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </button>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-bold text-amber-300 tracking-widest uppercase">The Manifesto</span>
            <div className="w-12 h-[1px] bg-amber-300/40"></div>
            <span className="text-[10px] font-bold text-amber-300/80 tracking-widest uppercase">Founded 2026</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-tight max-w-4xl drop-shadow-lg">
            For those who measure time in the pages of our heritage.
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 mt-16 sm:mt-24 space-y-24">
        
        {/* Section 1: The Genesis */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900">01. The Genesis</h2>
            <div className="flex-1 h-[1px] bg-stone-300"></div>
          </div>
          
          <div className="prose prose-stone prose-lg max-w-none text-stone-600 font-serif leading-loose">
            <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-[#c28453] first-letter:mr-3 first-letter:float-left">
              In an era dominated by fleeting digital notifications and algorithmic feeds, we founded Nepali Kitab Ghar as a sanctuary for the analog soul. We observed that the world was moving faster, yet losing touch with its roots. The profound, quiet joy of getting lost in a Nepali narrative was being replaced by the frantic scrolling of glass screens.
            </p>
            <p className="mt-6">
              Our bookstore was born out of a desire to preserve our cultural stories. We wanted to build a haven where Nepali books are treated not as disposable commodities, but as sacred artifacts of our heritage. A place where the smell of high-grade paper pulp and the elegant weight of a heavy cloth binding are celebrated as irreplaceable human luxuries.
            </p>
          </div>
        </section>

        {/* Mid-Page Quote */}
        <div className="py-12 border-y border-stone-200 text-center px-4">
          <Quote className="w-8 h-8 text-[#c28453] mx-auto mb-6 opacity-50" />
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-stone-800 leading-snug italic max-w-2xl mx-auto">
            "We believe that a well-crafted Nepali book is a timeless vessel of our culture, deserving of reverence and awe."
          </h3>
        </div>

        {/* Section 2: The Philosophy */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900">02. Our Philosophy</h2>
            </div>
            <p className="text-stone-600 font-serif leading-loose">
              We fundamentally reject algorithmic curation. A machine cannot understand the subtle nuances of human emotion and cultural depth that make a Nepali story truly resonate. Instead, every volume in our collection is hand-selected and beautifully evaluated by our expert bibliophiles. 
            </p>
            <p className="text-stone-600 font-serif leading-loose mt-4">
              We scour local publishers, rare archives, and independent Nepali presses to find books that challenge, comfort, and inspire. When you browse our shelves, you are walking through a highly curated gallery of Nepali literary excellence.
            </p>
          </div>
          <div className="bg-[#f4ebd9] p-8 rounded-sm border border-[#e5d4b8] shadow-inner">
            <h4 className="text-xs font-bold text-[#a0683a] tracking-widest uppercase mb-4">The Curatorial Standards</h4>
            <ul className="space-y-4 text-stone-800 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-[#c28453] font-serif font-bold text-lg leading-none mt-0.5">&bull;</span>
                Exceptional narrative depth and intellectual rigor.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c28453] font-serif font-bold text-lg leading-none mt-0.5">&bull;</span>
                Superior physical craftsmanship, paper quality, and binding.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c28453] font-serif font-bold text-lg leading-none mt-0.5">&bull;</span>
                A timeless quality that defies short-lived trends.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: The Promise */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900">03. The Promise</h2>
            <div className="flex-1 h-[1px] bg-stone-300"></div>
          </div>
          
          <div className="prose prose-stone prose-lg max-w-none text-stone-600 font-serif leading-loose">
            <p>
              We treat the fulfillment of your order as an artisanal process. Every book shipped from our quiet studio in Nepal is packaged by hand. We wrap each edition in custom, heavy kraft paper, finish it with raw twine, and seal it to protect the integrity of the volume.
            </p>
            <p className="mt-6">
              When a package from Nepali Kitab Ghar arrives at your door, we want it to feel like a gift from a dear friend—a tactile experience that heightens the anticipation of the Nepali story waiting inside. Thank you for choosing to keep the physical magic of reading alive with us.
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="flex justify-center pt-12">
          <button 
            onClick={onExplore}
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#c28453] hover:bg-[#a97145] text-white text-xs font-bold tracking-widest uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer rounded-sm"
          >
            Explore The Archives
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
