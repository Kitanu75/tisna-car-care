import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Car, ShieldCheck, ArrowRight, Tag } from 'lucide-react';
import appConfig from '../data/appConfig';
import { storage } from '../utils/storage';

export default function Screen4_Home({
  selectedCarType = 'sedan',
  onCarTypeChange,
  onProceedToStep2,
  initialCarData = null
}) {
  const [pricing, setPricing] = useState(storage.getPricing());
  
  // Page 1: Car & Service Plan State (No Brand, No Model, No Phone - Phone asked on Page 3)
  const [currentCarType, setCurrentCarType] = useState(selectedCarType || 'sedan');
  const [carNumber, setCarNumber] = useState(initialCarData?.carNumber || 'DL 08 AB 1234');

  // Plan Selection State
  const [selectedPlanKey, setSelectedPlanKey] = useState('basic'); // 'basic' | 'premium'
  const [selectedDurationId, setSelectedDurationId] = useState('1m'); // 'daily' | '1m' | '3m' | '6m'

  // Listen for admin price updates live
  useEffect(() => {
    const handlePricingUpdate = () => {
      setPricing(storage.getPricing());
    };
    window.addEventListener('tisna_pricing_updated', handlePricingUpdate);
    return () => window.removeEventListener('tisna_pricing_updated', handlePricingUpdate);
  }, []);

  const currentCarImage = appConfig.getCarImage(currentCarType);

  // Live daily rates based on car segment
  const basicDailyRate = Number(pricing.carTypePricing?.basic?.[currentCarType] ?? 600);
  const premiumDailyRate = Number(pricing.carTypePricing?.premium?.[currentCarType] ?? 1100);

  // Live discount percentages set by Admin
  const discount1m = Number(pricing.discounts?.['1m'] ?? 0);
  const discount3m = Number(pricing.discounts?.['3m'] ?? 7);
  const discount6m = Number(pricing.discounts?.['6m'] ?? 11);

  // Live prices dynamically calculated using Daily Rate of currentCarType & Admin's discount percentages
  const basicDaily = storage.calculatePlanPrice('basic', 'daily', currentCarType, pricing);
  const basic1m = storage.calculatePlanPrice('basic', '1m', currentCarType, pricing);
  const basic3m = storage.calculatePlanPrice('basic', '3m', currentCarType, pricing);
  const basic6m = storage.calculatePlanPrice('basic', '6m', currentCarType, pricing);

  const premiumDaily = storage.calculatePlanPrice('premium', 'daily', currentCarType, pricing);
  const premium1m = storage.calculatePlanPrice('premium', '1m', currentCarType, pricing);
  const premium3m = storage.calculatePlanPrice('premium', '3m', currentCarType, pricing);
  const premium6m = storage.calculatePlanPrice('premium', '6m', currentCarType, pricing);

  // Calculate current effective price for the selected plan & duration
  const getSelectedPrice = () => {
    return storage.calculatePlanPrice(selectedPlanKey, selectedDurationId, currentCarType, pricing);
  };

  const currentPrice = getSelectedPrice();

  // Active plan details
  const activePlan = appConfig.regularPlans[selectedPlanKey] || appConfig.regularPlans.basic;
  const activeDailyRate = selectedPlanKey === 'basic' ? basicDailyRate : premiumDailyRate;

  const durationOptions = [
    {
      id: 'daily',
      label: 'Daily Wash',
      sublabel: 'Single Day',
      badge: null,
      price: selectedPlanKey === 'basic' ? basicDaily : premiumDaily
    },
    {
      id: '1m',
      label: '1 Month',
      sublabel: '30 Days',
      badge: discount1m > 0 ? `Save ${discount1m}%` : null,
      price: selectedPlanKey === 'basic' ? basic1m : premium1m
    },
    {
      id: '3m',
      label: '3 Months',
      sublabel: '90 Days',
      badge: `Save ${discount3m}%`,
      price: selectedPlanKey === 'basic' ? basic3m : premium3m
    },
    {
      id: '6m',
      label: '6 Months',
      sublabel: '180 Days',
      badge: `Save ${discount6m}%`,
      price: selectedPlanKey === 'basic' ? basic6m : premium6m
    }
  ];

  const carTypeOptions = [
    { 
      id: 'hatchback', 
      label: 'Hatchback', 
      examples: 'Swift, i10, Tiago',
      image: '/assets/hatchback-car.jpg' 
    },
    { 
      id: 'sedan', 
      label: 'Sedan', 
      examples: 'City, Dzire, Verna',
      image: '/assets/honda-city.png' 
    },
    { 
      id: 'suv', 
      label: 'SUV', 
      examples: 'Creta, Brezza, Thar',
      image: '/assets/suv-car.jpg' 
    },
    { 
      id: 'luxury', 
      label: 'Luxury', 
      examples: 'BMW, Audi, Merc',
      image: '/assets/luxury-car.jpg' 
    }
  ];

  const handleCarSegmentClick = (segmentId) => {
    setCurrentCarType(segmentId);
    if (onCarTypeChange) onCarTypeChange(segmentId);
  };

  // Proceed to Page 2 (Other Services)
  const handleProceed = () => {
    const isBasic = selectedPlanKey === 'basic';
    const planName = isBasic ? 'Basic Service' : 'Premium Service';
    const isDaily = selectedDurationId === 'daily';
    const durationLabel = isDaily 
      ? 'Daily Single Wash' 
      : selectedDurationId === '1m' ? '1 Month Plan' 
      : selectedDurationId === '3m' ? '3 Months Plan' 
      : '6 Months Plan';

    const page1Data = {
      carSegment: currentCarType,
      carNumber: carNumber.toUpperCase().trim() || 'DL 08 AB 1234',
      planKey: selectedPlanKey,
      planName,
      durationId: selectedDurationId,
      durationLabel,
      isDaily,
      dailyRate: activeDailyRate,
      amount: currentPrice,
      image: isBasic ? appConfig.regularPlans.basic.image : appConfig.regularPlans.premium.image,
      features: isBasic 
        ? appConfig.regularPlans.basic.features 
        : appConfig.regularPlans.premium.features
    };

    if (onProceedToStep2) {
      onProceedToStep2(page1Data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
      
      {/* 3-Step Clean Progress Header (Matching Figma) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#0F7A44] text-white flex items-center justify-center font-extrabold text-xs shadow-md">
            1
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#0F7A44] block">Step 1 of 3</span>
            <h2 className="text-sm sm:text-base font-black text-gray-900">Select Car & Service Plan</h2>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-xs font-bold text-gray-400">
          <span className="text-gray-900 font-extrabold bg-emerald-50 text-[#0F7A44] px-3 py-1 rounded-full border border-emerald-200">
            1. Car & Plan
          </span>
          <span>→</span>
          <span>2. Other Services</span>
          <span>→</span>
          <span>3. Details & Payment</span>
        </div>
      </div>

      {/* Hero Car Card with Dynamic Visual (Figma Screen 3 "Add Your Car" style) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-6 text-center">
        
        {/* Dynamic Car Photo */}
        <div className="h-44 sm:h-52 w-full max-w-md mx-auto flex items-center justify-center relative bg-gradient-to-b from-gray-50 to-white rounded-2xl p-4 border border-gray-100">
          <img 
            key={currentCarType}
            src={currentCarImage} 
            alt={`Tisna ${currentCarType} Car`} 
            className="max-h-full max-w-full object-contain filter drop-shadow-xl transition-all duration-300 animate-fade-in"
          />
          <span className="absolute bottom-3 right-3 bg-[#0F7A44] text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full capitalize shadow-xs">
            {currentCarType}
          </span>
        </div>

        {/* Section 1: Car Type Buttons in a Row (Figma Screen 3 format) */}
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-gray-900 uppercase tracking-wider block">
              Car Type
            </label>
            <span className="text-[11px] text-gray-500 font-medium">Click to change car type</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {carTypeOptions.map((opt) => {
              const isSelected = currentCarType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  id={`select-car-segment-${opt.id}`}
                  onClick={() => handleCarSegmentClick(opt.id)}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between space-y-2 cursor-pointer ${
                    isSelected
                      ? 'border-[#0F7A44] bg-[#EAF6EF] ring-2 ring-[#0F7A44] text-[#0F7A44] font-extrabold shadow-sm'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-2xs'
                  }`}
                >
                  <div className="h-12 flex items-center justify-center">
                    <img src={opt.image} alt={opt.label} className="max-h-10 max-w-[70px] object-contain" />
                  </div>
                  <span className="text-xs font-bold block">{opt.label}</span>
                  <span className="text-[10px] text-gray-400 block line-clamp-1">{opt.examples}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Registration Number (Only Registration Number - No brand/model/phone) */}
        <div className="text-left space-y-1.5 pt-2 border-t border-gray-100">
          <label className="text-xs font-black text-gray-900 uppercase tracking-wider block">
            Registration Number
          </label>
          <div className="relative">
            <input
              type="text"
              id="car-plate-input"
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value)}
              placeholder="e.g. DL 08 AB 1234"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-black text-gray-900 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#0F7A44] focus:bg-white transition"
            />
            <span className="absolute right-4 top-3.5 text-xs text-gray-400 font-bold uppercase">
              Plate No
            </span>
          </div>
        </div>

      </div>

      {/* SECTION 3: REGULAR CAR SERVICE (Figma Screen 5 Format) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-5">
        
        {/* Header & Plan Toggle Bar (Figma Screen 5 style) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg sm:text-xl font-black text-gray-900">
              Regular Car Service
            </h3>
            <span className="text-xs text-[#0F7A44] font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Live Calculated Rates
            </span>
          </div>

          {/* Toggle Pills: [ Basic Service ]  [ Premium Service ] */}
          <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-2xl">
            <button
              type="button"
              id="toggle-plan-basic"
              onClick={() => setSelectedPlanKey('basic')}
              className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                selectedPlanKey === 'basic'
                  ? 'bg-[#0F7A44] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 bg-transparent'
              }`}
            >
              Basic Service
            </button>
            <button
              type="button"
              id="toggle-plan-premium"
              onClick={() => setSelectedPlanKey('premium')}
              className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                selectedPlanKey === 'premium'
                  ? 'bg-[#0F7A44] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 bg-transparent'
              }`}
            >
              Premium Service
            </button>
          </div>
        </div>

        {/* Hero Plan Image (Screen 5 banner) */}
        <div className="h-48 sm:h-56 rounded-2xl overflow-hidden relative bg-gray-100 shadow-inner">
          <img 
            src={activePlan.image} 
            alt={activePlan.name} 
            className="w-full h-full object-cover transition-all duration-300 animate-fade-in"
          />
          <span className={`absolute bottom-3 left-4 text-white text-xs font-extrabold px-3.5 py-1 rounded-full shadow-md ${
            selectedPlanKey === 'basic' ? 'bg-[#0F7A44]' : 'bg-gradient-to-r from-amber-600 to-yellow-600'
          }`}>
            {selectedPlanKey === 'basic' ? 'Daily Exterior & Vacuum' : 'Deep Detailing & Polish'}
          </span>
          <span className="absolute top-3 right-4 bg-white/90 backdrop-blur-xs text-gray-900 text-xs font-black px-3 py-1 rounded-full shadow-xs">
            {currentCarType.toUpperCase()}
          </span>
        </div>

        {/* Plan Title & Price Header */}
        <div className="flex items-start justify-between pt-2">
          <div>
            <h4 className="text-xl sm:text-2xl font-black text-gray-900">{activePlan.name}</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {selectedPlanKey === 'basic' ? 'Daily routine doorstep cleaning' : 'Comprehensive deep detailing & shine'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-[#0F7A44]">
              ₹ {currentPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-400 block font-medium">
              {selectedDurationId === 'daily' ? '/ daily single wash' : selectedDurationId === '1m' ? '/ 1 month plan' : selectedDurationId === '3m' ? '/ 3 months' : '/ 6 months'}
            </span>
          </div>
        </div>

        {/* Single Day Rate Tag for chosen car */}
        <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between font-bold ${
          selectedPlanKey === 'basic' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}>
          <span>Daily Wash Rate for {currentCarType.toUpperCase()}:</span>
          <span className="text-sm font-black text-[#0F7A44]">₹{activeDailyRate} / day</span>
        </div>

        {/* Features Checklist (Figma Screen 5 format) */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <span className="text-xs font-black text-gray-900 uppercase tracking-wider block mb-2">
            What's Included:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
            {activePlan.features.map((feat, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#0F7A44] flex items-center justify-center flex-shrink-0">
                  <Check size={11} strokeWidth={3} />
                </div>
                <span className="font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Select Plan Duration (Figma Screen 5 format) */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
              Select Plan Duration
            </h4>
            <span className="text-xs text-emerald-700 font-semibold">100% Calculated from Daily Rate</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {durationOptions.map((opt) => {
              const isSelected = selectedDurationId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  id={`select-duration-${opt.id}`}
                  onClick={() => setSelectedDurationId(opt.id)}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col justify-between relative cursor-pointer ${
                    isSelected
                      ? 'border-[#0F7A44] bg-[#EAF6EF] ring-2 ring-[#0F7A44] shadow-xs'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {opt.badge && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#0F7A44] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                      {opt.badge}
                    </span>
                  )}
                  <div className="text-xs font-bold text-gray-800">{opt.label}</div>
                  <div className="text-base sm:text-lg font-black text-[#0F7A44] my-1">
                    ₹ {opt.price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">{opt.sublabel}</div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* STICKY BOTTOM BAR & ACTION BUTTON (Figma Proceed to Payment Format) */}
      <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 text-left w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 p-1">
            <img src={currentCarImage} alt={currentCarType} className="max-h-full max-w-full object-contain" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold">
              {carNumber} • {currentCarType.toUpperCase()} • {activePlan.name}
            </div>
            <div className="text-xl sm:text-2xl font-black text-gray-900">
              Total: <span className="text-[#0F7A44]">₹ {currentPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <button
          id="page-1-continue-btn"
          onClick={handleProceed}
          className="w-full sm:w-auto py-4 px-8 bg-[#0F7A44] hover:bg-[#0c6237] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-900/20 transition flex items-center justify-center space-x-2.5 cursor-pointer"
        >
          <span>Continue to Other Services (Step 2 of 3)</span>
          <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}
