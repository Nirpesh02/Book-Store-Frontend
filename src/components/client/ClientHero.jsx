import React from 'react';
import { ArrowRight, BookOpen, Star } from 'lucide-react';

export default function ClientHero({ onExplore, onStoryClick, newestBook }) {
  return (
    <div className="relative w-full min-h-[85vh] bg-[#fcfaf7] overflow-hidden flex items-center mb-8">
      {/* Decorative Blob Backgrounds */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#c28453]/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#8a5a44]/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-24 pb-16">
        {/* Left Content */}
        <div className="flex flex-col items-start space-y-8 max-w-2xl">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-[#eadac2] shadow-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#c28453] animate-pulse"></span>
            <span className="text-xs font-bold tracking-[0.2em] text-[#a0683a] uppercase font-sans">Welcome to Kitabghar</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-serif text-[#3e2723] leading-[1.05] font-bold tracking-tight">
            Discover the <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c28453] to-[#8a5a44] italic pr-2">Soul of Nepali</span> <br className="hidden sm:block" />
            Literature.
          </h1>

          <p className="text-lg md:text-xl text-[#6d5b53] leading-relaxed max-w-lg font-serif">
            Immerse yourself in a curated world of timeless classics, modern masterpieces, and untold stories. Your next great adventure is just a page away.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 pt-4 w-full sm:w-auto">
            <button 
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-4 bg-[#3e2723] hover:bg-[#2c1f17] text-white rounded-full font-semibold tracking-wide flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#3e2723]/30"
            >
              Explore Collection
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={onStoryClick}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#f9f4ec] text-[#3e2723] border border-[#eadac2] rounded-full font-semibold tracking-wide flex items-center justify-center transition-transform hover:-translate-y-1 shadow-sm"
            >
              Our Story
            </button>
          </div>

          {/* Mini social proof */}
          <div className="flex items-center gap-4 pt-10">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#fcfaf7] overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Reader" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex text-[#c28453]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-xs font-semibold text-[#6d5b53] mt-1 font-sans">Trusted by 10,000+ readers</span>
            </div>
          </div>
        </div>

        {/* Right Content - Images/Visuals */}
        <div className="relative h-[420px] lg:h-[600px] w-full mt-12 lg:mt-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#f4ebd9] to-transparent rounded-full opacity-60 blur-3xl"></div>
          
          {/* Main Book Focus */}
          <img 
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" 
            alt="Books" 
            className="absolute left-0 lg:left-4 bottom-8 lg:bottom-12 w-[180px] sm:w-[240px] lg:w-[320px] h-[260px] sm:h-[320px] lg:h-[450px] object-cover rounded-[1.5rem] lg:rounded-3xl shadow-2xl -rotate-6 hover:rotate-0 transition-transform duration-700 z-10 border-[4px] lg:border-[6px] border-white"
          />
          
          {/* Secondary Accent Image */}
          <img 
            src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" 
            alt="Person reading" 
            className="absolute right-0 top-0 lg:top-8 w-[140px] sm:w-[180px] lg:w-64 h-[200px] sm:h-[240px] lg:h-80 object-cover rounded-[1.5rem] lg:rounded-3xl shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-700 z-20 border-[4px] lg:border-[6px] border-white"
          />
          
          {/* Floating Element (Dynamic New Arrival) */}
          {newestBook && (
            <div className="absolute top-[5%] lg:top-[20%] left-[-2%] lg:left-[-5%] bg-white/90 backdrop-blur-md p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl z-30 border border-white flex gap-3 lg:gap-4 items-center animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#c28453] to-[#8a5a44] rounded-full flex items-center justify-center text-white shadow-inner flex-shrink-0">
                <BookOpen className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div className="pr-1 lg:pr-2 max-w-[120px] sm:max-w-[150px] lg:max-w-[180px]">
                <p className="text-[9px] lg:text-[10px] font-bold text-[#c28453] uppercase tracking-widest mb-0.5">New Arrival</p>
                <p className="text-xs lg:text-sm font-bold text-[#3e2723] font-serif truncate" title={newestBook.title}>
                  {newestBook.title}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}