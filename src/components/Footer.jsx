import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import appConfig from '../data/appConfig';

export default function Footer({ onNavigate, onOpenAdminPricing }) {
  const [payment, setPayment] = useState(() => appConfig.getPaymentDetails());

  useEffect(() => {
    const handleUpdate = () => {
      setPayment(appConfig.getPaymentDetails());
    };
    window.addEventListener('tisna_pricing_updated', handleUpdate);
    return () => window.removeEventListener('tisna_pricing_updated', handleUpdate);
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 py-6 mt-10">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Brand & Phone */}
        <div className="flex items-center space-x-3">
          <div className="bg-white p-1.5 rounded-xl inline-block">
            <img 
              src={appConfig.brand.logoImage} 
              alt={appConfig.brand.name} 
              className="h-7 w-auto object-contain"
            />
          </div>
          <div>
            <span className="font-extrabold text-white text-sm block">Tisna Car Care</span>
            <span className="text-[11px] text-gray-400">Delhi NCR • Doorstep Service</span>
          </div>
        </div>

        {/* WhatsApp & Call Action */}
        <div className="flex items-center space-x-3">
          <a
            href={`tel:${payment.paymentPhone}`}
            className="flex items-center space-x-1.5 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-xl font-bold transition"
          >
            <Phone size={13} className="text-[#25D366]" />
            <span>{payment.paymentPhone}</span>
          </a>

          <a
            href={`https://wa.me/${payment.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 bg-[#0F7A44] hover:bg-[#0c6237] text-white px-3.5 py-1.5 rounded-xl font-bold transition shadow-xs"
          >
            <MessageCircle size={13} />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Secret PIN-protected Admin click link */}
        <div className="text-[11px] text-gray-500 select-none text-center sm:text-right">
          <span 
            onClick={onOpenAdminPricing}
            className="cursor-default hover:text-gray-400 transition"
          >
            © {new Date().getFullYear()} Tisna Car Care
          </span>
        </div>

      </div>
    </footer>
  );
}
