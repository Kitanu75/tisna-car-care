import React, { useState } from 'react';
import { Layers, X, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function ScreenSwitcherModal({ currentScreen, onSelectScreen }) {
  const [isOpen, setIsOpen] = useState(false);

  const screens = [
    { id: 'screen-1', number: 1, name: 'Splash / Onboarding', category: 'Auth & Onboarding' },
    { id: 'screen-2', number: 2, name: 'Login Screen', category: 'Auth & Onboarding' },
    { id: 'screen-3', number: 3, name: 'Add Your Car (Stepper)', category: 'Car Management' },
    { id: 'screen-4', number: 4, name: 'Home Dashboard', category: 'Main App' },
    { id: 'screen-5', number: 5, name: 'Regular Service Details', category: 'Services & Plans' },
    { id: 'screen-6', number: 6, name: 'Other Services (Add-ons)', category: 'Services & Plans' },
    { id: 'screen-7', number: 7, name: 'Book Service / Schedule', category: 'Booking Flow' },
    { id: 'screen-8', number: 8, name: 'Payment Summary (Static QR)', category: 'Booking Flow' },
    { id: 'screen-9', number: 9, name: 'Booking Confirmed', category: 'Booking Flow' },
    { id: 'screen-10', number: 10, name: 'Notifications & Alerts', category: 'Main App' },
    { id: 'screen-11', number: 11, name: 'My Bookings', category: 'Main App' },
    { id: 'screen-12', number: 12, name: 'Profile & Settings', category: 'Main App' },
  ];

  return (
    <>
      {/* Floating Pill Button */}
      <div className="fixed bottom-20 right-4 sm:right-8 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-gray-900 text-white px-3.5 py-2 rounded-full shadow-2xl hover:bg-black transition-all transform hover:scale-105 border border-gray-700/60 text-xs font-semibold"
          title="Jump directly to any of the 12 screens"
        >
          <Layers size={14} className="text-emerald-400" />
          <span>Screens ({screens.find(s => s.id === currentScreen)?.number || 4}/12)</span>
        </button>
      </div>

      {/* Screen Selection Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0F7A44]"></span>
                  All 12 Screens Navigator
                </h3>
                <p className="text-xs text-gray-500">Jump directly to any screen from the UI design</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Screens List */}
            <div className="overflow-y-auto p-4 space-y-2 flex-1">
              {screens.map((screen) => {
                const isCurrent = screen.id === currentScreen;
                return (
                  <button
                    key={screen.id}
                    onClick={() => {
                      onSelectScreen(screen.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                      isCurrent
                        ? 'border-[#0F7A44] bg-[#EAF6EF] text-[#0F7A44] shadow-sm font-semibold'
                        : 'border-gray-200/80 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isCurrent 
                          ? 'bg-[#0F7A44] text-white shadow-sm' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }`}>
                        {screen.number}
                      </div>
                      <div>
                        <div className="text-sm font-semibold leading-tight">{screen.name}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">{screen.category}</div>
                      </div>
                    </div>
                    {isCurrent ? (
                      <CheckCircle2 size={18} className="text-[#0F7A44]" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
              <span className="text-[11px] text-gray-500 font-medium">
                Tisna Car Care • Mobile Web Application
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
