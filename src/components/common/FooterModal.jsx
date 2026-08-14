import React from 'react';
import { X, Book, ShieldCheck, FileText, HelpCircle } from 'lucide-react';

export default function FooterModal({ type, isOpen, onClose }) {
  if (!isOpen) return null;

  let title = '';
  let icon = null;
  let content = null;

  if (type === 'privacy') {
    title = 'Privacy Policy';
    icon = <ShieldCheck className="w-6 h-6 text-amber-500" />;
    content = (
      <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-amber-800">
          <p className="font-semibold">Your privacy is critically important to us.</p>
          <p className="text-xs mt-1">Last updated: August 2026</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-slate-800 font-bold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span> 1. Information Collection</h3>
          <p className="pl-3.5">At किताबघर, we collect only the necessary information required to provide you with a seamless book-buying experience. This includes your name, email address, shipping details, and order history. We do not store any sensitive payment information on our servers; all transactions are processed through secure, industry-leading payment gateways.</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-slate-800 font-bold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span> 2. Use of Information</h3>
          <p className="pl-3.5">Your data is utilized exclusively to:</p>
          <ul className="list-disc pl-8 space-y-1 text-slate-500">
            <li>Process and fulfill your book orders accurately.</li>
            <li>Personalize your reading recommendations based on your preferences.</li>
            <li>Communicate important updates regarding your account or our services.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-slate-800 font-bold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span> 3. Data Protection</h3>
          <p className="pl-3.5">We employ state-of-sart security protocols to safeguard your personal information against unauthorized access. किताबघर strictly adheres to a zero-tolerance policy regarding data selling; your information will never be shared with third-party advertisers without your explicit consent.</p>
        </div>
      </div>
    );
  } else if (type === 'terms') {
    title = 'Terms of Service';
    icon = <FileText className="w-6 h-6 text-amber-500" />;
    content = (
      <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700">
          <p className="font-medium">By accessing and using किताबघर, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </div>

        <div className="space-y-3">
          <div className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-slate-800 font-bold mb-2">1. Store Policies & Pricing</h3>
            <p className="text-slate-500">All book prices are listed in Nepalese Rupees (NPR) and are subject to change without prior notice. By confirming a purchase, you agree to our standard pricing and fulfillment policies. We reserve the right to cancel any orders resulting from pricing errors.</p>
          </div>

          <div className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-slate-800 font-bold mb-2">2. Refunds and Returns</h3>
            <p className="text-slate-500">Customer satisfaction is our priority. You may request a refund within 7 days of delivery if you receive a damaged or defective physical copy. Please note that digital purchases and gift cards are strictly non-refundable.</p>
          </div>

          <div className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-slate-800 font-bold mb-2">3. User Conduct</h3>
            <p className="text-slate-500">We foster a community of book lovers. When interacting with our platform (e.g., leaving reviews), users must maintain respect. Hate speech, spamming, or inappropriate language will result in immediate removal of the content and potential permanent account suspension.</p>
          </div>
        </div>
      </div>
    );
  } else if (type === 'faq') {
    title = 'Frequently Asked Questions';
    icon = <HelpCircle className="w-6 h-6 text-amber-500" />;
    content = (
      <div className="space-y-3 text-sm leading-relaxed">
        
        <div className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all">
          <p className="font-bold text-slate-800 flex items-start gap-2">
            <span className="text-amber-500 font-black">Q.</span> How long does delivery take?
          </p>
          <p className="mt-2 text-slate-500 flex items-start gap-2">
            <span className="text-slate-300 font-black">A.</span> Deliveries inside the Kathmandu Valley typically take 1-2 business days. For locations outside the valley, please expect a delivery timeframe of 3-5 business days depending on the courier service.
          </p>
        </div>

        <div className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all">
          <p className="font-bold text-slate-800 flex items-start gap-2">
            <span className="text-amber-500 font-black">Q.</span> Can I request a book that is currently out of stock?
          </p>
          <p className="mt-2 text-slate-500 flex items-start gap-2">
            <span className="text-slate-300 font-black">A.</span> Absolutely! If a book you desire is out of stock, simply add it to your Wishlist. Our system will automatically notify you via email the moment fresh copies arrive in our inventory.
          </p>
        </div>

        <div className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all">
          <p className="font-bold text-slate-800 flex items-start gap-2">
            <span className="text-amber-500 font-black">Q.</span> Do you sell original copies?
          </p>
          <p className="mt-2 text-slate-500 flex items-start gap-2">
            <span className="text-slate-300 font-black">A.</span> Yes. Quality is our guarantee. किताबघर exclusively sources 100% genuine and original copies directly from authorized publishers and verified international distributors.
          </p>
        </div>

        <div className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all">
          <p className="font-bold text-slate-800 flex items-start gap-2">
            <span className="text-amber-500 font-black">Q.</span> How do I process a refund for a damaged book?
          </p>
          <p className="mt-2 text-slate-500 flex items-start gap-2">
            <span className="text-slate-300 font-black">A.</span> You can initiate a refund directly from your 'My Orders' page. Simply click 'Request Refund', and our admin team will review your request and process it within 24 hours.
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl relative border border-slate-100 max-h-[85vh] flex flex-col animate-[slideIn_0.2s_ease-out]">
        <button onClick={onClose} className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer z-10 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <div className="p-2 bg-amber-50 rounded-xl">
            {icon}
          </div>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>

        <div className="overflow-y-auto pr-2 custom-scrollbar">
          {content}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <Book className="w-3.5 h-3.5" /> किताबघर Legal & Help Center
          </p>
        </div>
      </div>
    </div>
  );
}
