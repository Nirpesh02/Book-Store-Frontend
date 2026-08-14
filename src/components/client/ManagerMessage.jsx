import React from 'react';

export default function ManagerMessage() {
  return (
    <section className="py-16 mt-16 border-y border-[#c28453]/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-shrink-0 flex flex-col items-center gap-6 relative">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10">
              <img 
                src="/Video and photo/Manager.png" 
                alt="Manager of Kitabghar" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative name badge */}
            <div className="px-6 py-2.5 bg-[#c28453] rounded-full flex items-center justify-center text-white text-sm shadow-xl font-bold tracking-widest z-20 border-[3px] border-white whitespace-nowrap">
              Mr Nirpesh Dhungel
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-[#c28453]/10 rounded-full blur-xl z-0"></div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-6 z-10">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-serif text-stone-900">A Message from Our Manager</h2>
              <p className="text-sm font-bold text-[#c28453] tracking-widest uppercase">Welcome to Kitabghar</p>
            </div>
            <p className="text-lg md:text-xl text-stone-700 font-serif leading-relaxed italic">
              "At किताब घर, we believe that every book holds a universe waiting to be discovered. Our mission is to celebrate the rich tapestry of Nepali literature and share the profound joy of reading with our community. We carefully curate our collection with love and dedication, hoping that you find stories here that deeply resonate with your heart and soul."
            </p>
            <div>
              <p className="text-stone-900 font-bold text-lg">Nirpesh Dhungel</p>
              <p className="text-stone-500 text-sm">Manager, किताब घर</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
