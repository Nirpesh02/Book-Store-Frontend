import React from 'react';
import { BookOpen, Package, Award } from 'lucide-react';

export default function ClientEthos() {
  const features = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Curated Excellence",
      description: "We skip algorithmic recommendations. Every volume in our collection is hand-selected and beautifully evaluated by our expert bibliophiles."
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: "Pristine Delivery",
      description: "We treat shipping as an art form. Each book is carefully packaged with protective layers to ensure it arrives at your doorstep in immaculate condition."
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Exclusive Editions",
      description: "Partnering with renowned publishers, we offer rare editions, custom covers, and unique literary gems you won't find anywhere else."
    }
  ];

  return (
    <section className="w-full bg-white py-20 border-y border-[#eadac2]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-16 gap-4 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#f9f4ec] border border-[#eadac2] shadow-sm mb-2">
            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shadow-sm text-[#a0683a]">02</span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-sans pr-2 text-[#a0683a]">Our Ethos</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#3e2723] tracking-tight font-bold">
            The Bookstore, Redefined.
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-[#f9f4ec] border border-[#eadac2] p-8 sm:p-10 rounded-2xl h-full flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f4ebd9] text-[#a0683a] rounded-full mb-6 shadow-sm border border-white">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-serif text-[#3e2723] mb-4 font-semibold">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-[#6d5b53] leading-relaxed max-w-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
