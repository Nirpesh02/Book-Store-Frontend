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
    <div className="mb-16">
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-12 gap-4 text-center">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-[#c28453] tracking-widest uppercase">02</span>
          <div className="w-8 h-[1px] bg-[#c28453]/40"></div>
          <span className="text-[10px] font-bold text-stone-500 tracking-widest uppercase">Our Ethos</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-stone-900 tracking-tight">
          The Bookstore, Redefined.
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-[#fbfaf7] border border-stone-200/60 p-8 sm:p-10 rounded-sm h-full flex flex-col">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-[#f4ebd9] text-[#a0683a] rounded-full mb-8">
              {feature.icon}
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-stone-900 mb-4">
              {feature.title}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
