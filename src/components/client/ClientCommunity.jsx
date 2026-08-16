import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

export default function ClientCommunity() {
  const testimonials = [
    {
      id: 1,
      text: "Kitabghar brought me closer to my roots. Finding pristine copies of old Nepali poems here was an absolute delight. The packaging feels like a gift to myself.",
      author: "Aditi S.",
      role: "Literature Student"
    },
    {
      id: 2,
      text: "The curated selection is unmatched. I no longer have to dig through dusty piles in local shops to find genuine masterpieces. A truly premium experience.",
      author: "Bikash M.",
      role: "Avid Reader"
    },
    {
      id: 3,
      text: "A masterclass in customer experience. From the beautiful UI to the fast delivery, Kitabghar sets a new standard for bookstores in Nepal.",
      author: "Smriti C.",
      role: "Book Reviewer"
    }
  ];

  return (
    <section className="w-full bg-white py-20 border-t border-[#eadac2]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-16 gap-4 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#f9f4ec] border border-[#eadac2] shadow-sm mb-2">
            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shadow-sm text-[#a0683a]">04</span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-sans pr-2 text-[#a0683a]">The Community</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#3e2723] tracking-tight font-bold">
            Voices of Our <span className="italic text-[#a0683a] font-medium">Readers</span>.
          </h2>
          <p className="text-[#6d5b53] font-serif text-lg max-w-2xl mx-auto mt-2">
            Don't just take our word for it. Here is what our community of passionate bibliophiles has to say about their Kitabghar experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {testimonials.map((t, idx) => (
            <div key={t.id} className={`p-8 sm:p-10 rounded-[2rem] bg-[#fcfaf7] border border-[#eadac2] shadow-sm relative hover:-translate-y-2 transition-all duration-500 ${idx === 1 ? 'md:-translate-y-8 hover:-translate-y-10' : ''}`}>
              <div className="absolute -top-5 left-10 w-10 h-10 bg-[#f4ebd9] rounded-full flex items-center justify-center border-4 border-white shadow-sm text-[#a0683a]">
                <MessageCircle fill="currentColor" className="w-4 h-4" />
              </div>
              <p className="text-[#6d5b53] font-serif leading-relaxed italic text-[15px] mb-8 mt-2">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4 border-t border-[#eadac2]/60 pt-6">
                <div className="w-12 h-12 bg-white rounded-full border border-[#eadac2] p-1 flex items-center justify-center">
                   <Heart className="w-5 h-5 text-[#c28453]/60" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#3e2723]">{t.author}</p>
                  <p className="text-[10px] tracking-widest uppercase text-[#a0683a] font-bold">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
