import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminPriceModal from './components/AdminPriceModal';

// Clean Web Application Views
import Screen4_Home from './screens/Screen4_Home';
import Screen5_RegularService from './screens/Screen5_RegularService';
import Screen6_OtherServices from './screens/Screen6_OtherServices';
import Screen7_BookSchedule from './screens/Screen7_BookSchedule';
import Screen8_PaymentSummary from './screens/Screen8_PaymentSummary';
import Screen9_BookingConfirmed from './screens/Screen9_BookingConfirmed';
import { storage } from './utils/storage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('screen-4');
  const [navigationHistory, setNavigationHistory] = useState(['screen-4']);
  const [selectedCarType, setSelectedCarType] = useState('sedan');

  // Booking Flow State
  const [selectedServiceItem, setSelectedServiceItem] = useState({
    serviceType: 'regular',
    planKey: 'basic',
    planName: 'Basic Service',
    amount: 1499,
    isDaily: false
  });
  const [scheduledBookingData, setScheduledBookingData] = useState(null);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);
  const [selectedPlanInitialTab, setSelectedPlanInitialTab] = useState('basic');

  // Admin Price Manager Modal State
  const [isAdminPriceModalOpen, setIsAdminPriceModalOpen] = useState(false);

  // Sync pricing from server and listen for owner shortcuts
  useEffect(() => {
    // 1. Fetch live prices from server so all devices/incognito tabs have identical prices
    storage.initServerSync();

    // 2. Check URL param (?admin=true or ?owner=true)
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || params.get('owner') === 'true' || window.location.hash === '#admin') {
      setIsAdminPriceModalOpen(true);
    }

    const handleKeyDown = (e) => {
      // Alt + P or Ctrl + Shift + P triggers Owner Price Manager
      if ((e.altKey && e.key.toLowerCase() === 'p') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p')) {
        e.preventDefault();
        setIsAdminPriceModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigate helper with history tracking
  const navigateTo = (screenId) => {
    setNavigationHistory(prev => [...prev, screenId]);
    setCurrentScreen(screenId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      const nextHistory = [...navigationHistory];
      nextHistory.pop();
      const prevScreen = nextHistory[nextHistory.length - 1];
      setNavigationHistory(nextHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('screen-4');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col justify-between selection:bg-[#0F7A44] selection:text-white">
      
      {/* Responsive Modern Header / Navbar (Clean customer view - zero admin controls) */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={navigateTo}
        selectedCarType={selectedCarType}
        onChangeCarType={setSelectedCarType}
      />

      {/* Main Responsive Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* PAGE 1: Car Segment, Car Details & Mobile, Instant Basic/Premium Plans with Admin Discount Calculation */}
        {(currentScreen === 'screen-4' || currentScreen === 'home' || currentScreen === 'page-1') && (
          <Screen4_Home
            selectedCarType={selectedCarType}
            onCarTypeChange={setSelectedCarType}
            initialCarData={selectedServiceItem}
            onProceedToStep2={(page1Data) => {
              setSelectedServiceItem(page1Data);
              navigateTo('screen-6');
            }}
          />
        )}

        {/* PAGE 2: Other Services (Optional Add-ons - Select or Skip) */}
        {(currentScreen === 'screen-6' || currentScreen === 'addons' || currentScreen === 'page-2') && (
          <Screen6_OtherServices
            basePlan={selectedServiceItem}
            onBack={handleBack}
            onProceedToSchedule={(combinedData) => {
              setSelectedServiceItem(combinedData);
              navigateTo('screen-7');
            }}
            onBookDirectOneTime={(serviceData) => {
              setSelectedServiceItem(serviceData);
              navigateTo('screen-7');
            }}
          />
        )}

        {/* PAGE 3: Final Details, Live UPI QR Code on website & Direct WhatsApp Submit */}
        {(currentScreen === 'screen-7' || currentScreen === 'book' || currentScreen === 'payment' || currentScreen === 'screen-8' || currentScreen === 'page-3') && (
          <Screen7_BookSchedule
            selectedItem={selectedServiceItem}
            initialCarSegment={selectedCarType}
            onBack={handleBack}
            onGoHome={() => navigateTo('screen-4')}
          />
        )}

      </main>

      {/* Responsive Footer with Direct Owner Price Link */}
      <Footer 
        onNavigate={navigateTo} 
        onOpenAdminPricing={() => setIsAdminPriceModalOpen(true)}
      />

      {/* Owner / Admin Live Price Manager Modal (Direct Access - No Login) */}
      <AdminPriceModal
        isOpen={isAdminPriceModalOpen}
        onClose={() => setIsAdminPriceModalOpen(false)}
      />

    </div>
  );
}
