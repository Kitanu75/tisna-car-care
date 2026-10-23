import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Car, MessageCircle } from 'lucide-react';
import appConfig from '../data/appConfig';

export default function Navbar({ 
  currentScreen, 
  onNavigate, 
  selectedCarType,
  onChangeCarType
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [payment, setPayment] = useState(() => appConfig.getPaymentDetails());

  useEffect(() => {
    const handleUpdate = () => {
      setPayment(appConfig.getPaymentDetails());
    };
    window.addEventListener('tisna_pricing_updated', handleUpdate);
    return () => window.removeEventListener('tisna_pricing_updated', handleUpdate);
  }, []);

  const navLinks = [
    { id: 'screen-4', label: '1. Select Car & Plan' },
    { id: 'screen-6', label: '2. Other Services' },
    { id: 'screen-7', label: '3. Details & Payment' },
  ];

  const handleNavClick = (screenId) => {
    onNavigate(screenId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('screen-4')}>
            <img 
              src={appConfig.brand.logoImage} 
              alt={appConfig.brand.name} 
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation Links (No login required for customer) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentScreen === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'text-[#0F7A44] bg-[#EAF6EF] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls (Call / WhatsApp & Admin Price Access) */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* WhatsApp & Call Direct Contact */}
            <a
              href={`https://wa.me/${payment.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-[#0F7A44] border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold transition"
            >
              <Phone size={14} className="fill-current text-[#0F7A44]" />
              <span>{payment.paymentPhone}</span>
            </a>

            {/* Quick Book Button */}
            <button
              onClick={() => handleNavClick('screen-4')}
              className="py-2.5 px-5 bg-[#0F7A44] hover:bg-[#0c6237] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Book Doorstep Wash
            </button>
          </div>

          {/* Mobile Right Controls: WhatsApp + Hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            <a
              href={`https://wa.me/${payment.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-emerald-50 text-[#0F7A44] border border-emerald-200"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={18} />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-2 shadow-xl animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition ${
                currentScreen === link.id
                  ? 'text-[#0F7A44] bg-[#EAF6EF]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <a
              href={`https://wa.me/${payment.whatsappNumber}`}
              className="text-xs font-bold text-[#0F7A44] flex items-center space-x-1.5"
            >
              <Phone size={14} />
              <span>{payment.paymentPhone}</span>
            </a>
            <span className="text-[11px] text-gray-400 font-medium">8:00 AM - 7:00 PM</span>
          </div>
        </div>
      )}
    </header>
  );
}
