import React, { useState } from 'react';
import { Store, Mail, Phone, MapPin } from 'lucide-react';
import FooterModal from './FooterModal';

export default function Footer() {
  const [modalType, setModalType] = useState(null);

  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <img 
                src="/Video and photo/Kitabghar logo.png" 
                alt="किताबघर Logo" 
                className="h-14 w-14 rounded-full object-cover object-center shadow-md border-2 border-white/10"
              />
            </div>
            <p className="text-sm leading-relaxed">
              Your premium online book store. Discover, buy, and collect your favorite books from bestselling authors worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Browse Store</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">New Arrivals</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Best Sellers</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Customer Reviews</span></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Fiction</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Sci-Fi</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Historical</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Self-Help</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Jhapa Gauradaha, Nepal</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Nepalikitabghar@np.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+977 9816988657</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} किताबघर. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs">
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
