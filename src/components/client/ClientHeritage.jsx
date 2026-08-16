import React from 'react';
import { Quote } from 'lucide-react';

export default function ClientHeritage() {
  return (
    <section className="w-full bg-[#fcfaf7] py-20 border-t border-[#eadac2]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left: Image/Visual */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#c28453]/20 to-transparent rounded-[2rem] transform -rotate-3 scale-105 blur-lg"></div>
            <img 
              src="https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=800&auto=format&fit=crop" 
              alt="Vintage book pages" 
              className="relative w-full h-[400px] sm:h-[500px] object-cover rounded-[2rem] shadow-xl border-4 border-white"
            />
            {/* Overlay Box */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-2xl border border-[#eadac2] max-w-xs hidden sm:block">
              <Quote className="w-8 h-8 text-[#c28453] mb-3 opacity-50" />
              <p className="text-sm font-serif text-[#3e2723] italic leading-relaxed">
                "Literature is the mirror of the society, reflecting our deepest truths and untold history."
              </p>
            </div>
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start px-0 lg:px-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#f9f4ec] border border-[#eadac2] shadow-sm mb-6">
              <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shadow-sm text-[#a0683a]">03</span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-sans pr-2 text-[#a0683a]">The Heritage</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#3e2723] leading-[1.1] font-bold tracking-tight mb-8">
              Preserving <br/> <span className="italic text-[#a0683a] font-medium">Timeless</span> Stories.
            </h2>
            
            <div className="space-y-6 text-[#6d5b53] text-[15px] sm:text-base leading-relaxed font-serif">
              <p>
                Nepal has a rich history of literature, woven with the threads of revolution, romance, and spiritual awakening. From the epic poetry of Devkota to the rebellious voice of Parijat, our literature captures the very soul of the Himalayas.
              </p>
              <p>
                At Kitabghar, we don't just sell books; we act as custodians of this heritage. We actively source out-of-print classics, beautifully bound epics, and rare manuscripts to ensure that the golden era of Nepali literature continues to thrive in the hands of modern readers.
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-6 w-full">
               <div className="border border-[#eadac2] bg-white rounded-xl p-5 shadow-sm text-center">
                 <p className="text-3xl font-serif text-[#c28453] font-bold mb-1">500+</p>
                 <p className="text-[10px] tracking-[0.1em] text-[#6d5b53] uppercase font-bold">Classic Titles</p>
               </div>
               <div className="border border-[#eadac2] bg-white rounded-xl p-5 shadow-sm text-center">
                 <p className="text-3xl font-serif text-[#c28453] font-bold mb-1">100%</p>
                 <p className="text-[10px] tracking-[0.1em] text-[#6d5b53] uppercase font-bold">Authentic Prints</p>
               </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
