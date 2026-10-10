import React, { useState } from 'react';
import { Store, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import FooterModal from './FooterModal';

export default function Footer() {
  const [modalType, setModalType] = useState(null);

  return (
    <footer className="bg-[#0f172a] text-slate-400 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="md:col-span-12 lg:col-span-4 xl:col-span-4 space-y-6">
            <div className="flex items-center mb-4">
              <img 
                src="/Video and photo/Kitabghar logo.png" 
                alt="किताबघर Logo" 
                className="h-16 w-16 rounded-full object-cover object-center shadow-lg border-2 border-slate-700/50 hover:border-amber-500/50 transition-colors"
              />
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Your premium online book store. Discover, buy, and collect your favorite books from bestselling authors worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 lg:col-span-2 xl:col-span-2 space-y-6">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider relative inline-block pb-1">
              Quick Links
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-amber-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3 text-sm">
              {['Browse Store', 'New Arrivals', 'Best Sellers', 'Customer Reviews'].map((item) => (
                <li key={item} className="group flex items-center">
                  <ArrowRight className="w-3 h-3 text-amber-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2" />
                  <span className="hover:text-amber-400 transition-colors cursor-pointer group-hover:translate-x-1 duration-300 block">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-4 lg:col-span-2 xl:col-span-2 space-y-6">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider relative inline-block pb-1">
              Categories
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-amber-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3 text-sm">
              {['Fiction', 'Sci-Fi', 'Historical', 'Self-Help'].map((item) => (
                <li key={item} className="group flex items-center">
                  <ArrowRight className="w-3 h-3 text-amber-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2" />
                  <span className="hover:text-amber-400 transition-colors cursor-pointer group-hover:translate-x-1 duration-300 block">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 lg:col-span-4 xl:col-span-4 space-y-6">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider relative inline-block pb-1">
              Contact Us
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-amber-500 rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group cursor-pointer">
                <div className="p-2 bg-slate-800/50 group-hover:bg-amber-500/20 rounded-lg transition-colors shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-slate-400 group-hover:text-amber-100 transition-colors mt-1.5">Jhapa Gauradaha, Nepal</span>
              </li>
              <li className="flex items-start gap-3 group cursor-pointer">
                <div className="p-2 bg-slate-800/50 group-hover:bg-amber-500/20 rounded-lg transition-colors shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-slate-400 group-hover:text-amber-100 transition-colors mt-1.5">Nepalikitabghar@np.com</span>
              </li>
              <li className="flex items-start gap-3 group cursor-pointer">
                <div className="p-2 bg-slate-800/50 group-hover:bg-amber-500/20 rounded-lg transition-colors shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-slate-400 group-hover:text-amber-100 transition-colors mt-1.5">+977 9816988657</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/60 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} किताबघर. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs font-medium">
            <span onClick={() => setModalType('privacy')} className="hover:text-amber-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span onClick={() => setModalType('terms')} className="hover:text-amber-400 transition-colors cursor-pointer">Terms of Service</span>
            <span onClick={() => setModalType('faq')} className="hover:text-amber-400 transition-colors cursor-pointer">FAQ</span>
          </div>
        </div>
      </div>

      <FooterModal type={modalType} isOpen={!!modalType} onClose={() => setModalType(null)} />
    </footer>
  );
}
