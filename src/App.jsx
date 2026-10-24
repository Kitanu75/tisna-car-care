import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Step1_CarSelect from './screens/Step1_CarSelect';
import Step2_PlanSelect from './screens/Step2_PlanSelect';
import Step3_Booking from './screens/Step3_Booking';
import { storage } from './utils/storage';

export default function App() {
  const [step, setStep] = useState(1);
  const [carData, setCarData] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // Sync live pricing from Firebase Cloud Realtime Database
    storage.initServerSync();
  }, []);

  const handleStep1Next = (data) => {
    setCarData(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Back = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Next = (data) => {
    setBookingData(data);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep3Back = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setStep(1);
    setCarData(null);
    setBookingData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <div className="app-card">
        <Navbar
          step={step}
          onBack={step === 2 ? handleStep2Back : step === 3 ? handleStep3Back : undefined}
          onReset={handleGoHome}
        />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {step === 1 && (
            <Step1_CarSelect
              initialData={carData}
              onNext={handleStep1Next}
            />
          )}

          {step === 2 && (
            <Step2_PlanSelect
              carData={carData}
              onBack={handleStep2Back}
              onNext={handleStep2Next}
            />
          )}

          {step === 3 && (
            <Step3_Booking
              bookingData={bookingData}
              onBack={handleStep3Back}
              onGoHome={handleGoHome}
            />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
