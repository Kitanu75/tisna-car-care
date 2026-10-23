import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Sparkles, ShieldCheck, Clock } from 'lucide-react';
import appConfig from '../data/appConfig';
import { storage } from '../utils/storage';

export default function Screen5_RegularService({ 
  initialPlan = 'basic', 
  selectedCarType = 'sedan',
  onCarTypeChange,
  onBack, 
  onProceedToBook 
}) {
  const [selectedPlanKey, setSelectedPlanKey] = useState(initialPlan);
  const [selectedDurationId, setSelectedDurationId] = useState('1m');
  const [pricing, setPricing] = useState(storage.getPricing());
  const [activeCarType, setActiveCarType] = useState(selectedCarType || 'sedan');

  useEffect(() => {
    if (selectedCarType) {
      setActiveCarType(selectedCarType);
    }
  }, [selectedCarType]);

  useEffect(() => {
    const handlePricingUpdate = () => {
      setPricing(storage.getPricing());
    };
    window.addEventListener('tisna_pricing_updated', handlePricingUpdate);
    return () => window.removeEventListener('tisna_pricing_updated', handlePricingUpdate);
  }, []);

  const carType = activeCarType || 'sedan';
  const carImage = appConfig.getCarImage(carType);
  const plan = appConfig.regularPlans[selectedPlanKey] || appConfig.regularPlans.basic;

  // Car segment rates from live storage
  const dailyRate = pricing.carTypePricing?.[selectedPlanKey]?.[carType] ?? (selectedPlanKey === 'basic' ? 600 : 1100);

  // Compute live duration price dynamically from car segment daily rate
  const currentPrice = storage.calculatePlanPrice(selectedPlanKey, selectedDurationId, carType, pricing);

  const handleCarChange = (newCarType) => {
    setActiveCarType(newCarType);
    if (onCarTypeChange) onCarTypeChange(newCarType);
  };

  const handleProceed = () => {
    onProceedToBook({
      serviceType: 'regular',
      planKey: selectedPlanKey,
      planName: plan.name,
      carSegment: carType,
      durationId: selectedDurationId,
      amount: currentPrice,
      isDaily: selectedDurationId === 'daily',
      image: plan.image,
      features: plan.features
    });
  };

  const carSegments = [
    { id: 'hatchback', label: 'Small / Hatch', image: '/assets/hatchback-car.jpg' },
    { id: 'sedan', label: 'Sedan', image: '/assets/honda-city.png' },
    { id: 'suv', label: 'SUV', image: '/assets/suv-car.jpg' },
    { id: 'luxury', label: 'Luxury', image: '/assets/luxury-car.jpg' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex items-center space-x-3 pb-2 border-b border-gray-200">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 bg-white hover:bg-gray-100 transition shadow-xs"
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Regular Car Service</h2>
            <p className="text-xs sm:text-sm text-gray-500">Scheduled daily doorstep cleaning & detailing</p>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-2xl self-start sm:self-auto">
            <img src={carImage} alt={carType} className="h-6 w-10 object-contain" />
            <span className="text-xs font-extrabold text-[#0F7A44] capitalize">Segment: {carType}</span>
          </div>
        </div>
      </div>

      {/* Step 1 in Screen 5: Quick Car Segment Switcher */}
      <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-gray-700">Select Car Segment:</span>
          <span className="text-[11px] text-gray-400">Click to change car size</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {carSegments.map((c) => {
            const isSelected = carType === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCarChange(c.id)}
                className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                  isSelected
                    ? 'border-[#0F7A44] bg-[#EAF6EF] text-[#0F7A44] ring-2 ring-[#0F7A44] font-bold shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="h-10 w-14 flex items-center justify-center mb-1">
                  <img src={c.image} alt={c.label} className="max-h-full max-w-full object-contain" />
                </div>
                <span className="text-[11px] font-bold truncate max-w-full">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Basic vs Premium Toggle Pills */}
      <div className="bg-gray-200/70 p-1.5 rounded-2xl flex items-center max-w-md mx-auto">
        <button
          onClick={() => setSelectedPlanKey('basic')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            selectedPlanKey === 'basic'
              ? 'bg-[#0F7A44] text-white shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Basic Service
        </button>
        <button
          onClick={() => setSelectedPlanKey('premium')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            selectedPlanKey === 'premium'
              ? 'bg-[#0F7A44] text-white shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Premium Service
        </button>
      </div>

      {/* Responsive 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Visual Banner & Features */}
        <div className="md:col-span-6 space-y-4">
          <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-56 sm:h-72 relative">
            <img 
              src={plan.image} 
              alt={plan.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 sm:p-6">
              <span className="text-white text-xs sm:text-sm font-semibold flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                Verified & Background-Checked Tisna Cleaning Specialists
              </span>
            </div>
          </div>

          {/* Features Checklist */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-3">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Features Included</h4>
            <div className="space-y-2.5">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#0F7A44] flex items-center justify-center flex-shrink-0">
                    <Check size={13} strokeWidth={2.8} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Duration Selection */}
        <div className="md:col-span-6 space-y-4">
          
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-baseline justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{plan.name}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{plan.tagline}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-black text-[#0F7A44]">
                  ₹ {currentPrice.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-gray-400">
                  {selectedDurationId === 'daily' ? 'Per Single Wash' : 'Subscription Rate'}
                </div>
              </div>
            </div>

            {/* Dynamic Car Segment Daily Pricing Pill */}
            <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4">
              <div className="text-xs sm:text-sm font-bold text-[#0F7A44] flex items-center justify-between">
                <span>Daily Doorstep Rate ({carType.toUpperCase()}):</span>
                <span className="text-base font-extrabold">₹{dailyRate} / day</span>
              </div>
              <div className="text-xs text-emerald-800/80 mt-2 flex flex-wrap gap-x-3 gap-y-1">
                <span>Small Car: ₹{pricing.carTypePricing?.[selectedPlanKey]?.hatchback ?? 500}</span>
                <span>•</span>
                <span>Sedan: ₹{pricing.carTypePricing?.[selectedPlanKey]?.sedan ?? 600}</span>
                <span>•</span>
                <span>SUV: ₹{pricing.carTypePricing?.[selectedPlanKey]?.suv ?? 700}</span>
              </div>
            </div>

            {/* Select Plan Duration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Select Plan Duration
                </h4>
                <span className="text-xs text-emerald-700 font-semibold">Cancel anytime</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: '1m', label: '1 Month', months: 1, badge: pricing.discounts?.['1m'] > 0 ? `Save ${pricing.discounts?.['1m']}%` : null, price: storage.calculatePlanPrice(selectedPlanKey, '1m', carType, pricing) },
                  { id: '3m', label: '3 Months', months: 3, badge: `Save ${pricing.discounts?.['3m'] ?? 7}%`, price: storage.calculatePlanPrice(selectedPlanKey, '3m', carType, pricing) },
                  { id: '6m', label: '6 Months', months: 6, badge: `Save ${pricing.discounts?.['6m'] ?? 11}%`, price: storage.calculatePlanPrice(selectedPlanKey, '6m', carType, pricing) },
                ].map((duration) => {
                  const isSelected = selectedDurationId === duration.id;
                  return (
                    <button
                      key={duration.id}
                      type="button"
                      onClick={() => setSelectedDurationId(duration.id)}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col justify-between relative ${
                        isSelected
                          ? 'border-[#0F7A44] bg-[#EAF6EF] ring-2 ring-[#0F7A44] shadow-xs'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {duration.badge && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#0F7A44] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                          {duration.badge}
                        </span>
                      )}
                      <div className="text-xs sm:text-sm font-bold text-gray-800">{duration.label}</div>
                      <div className="text-base font-extrabold text-[#0F7A44] my-1">
                        ₹ {duration.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {duration.months} month plan
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Single Day Wash Option */}
              <button
                type="button"
                onClick={() => setSelectedDurationId('daily')}
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  selectedDurationId === 'daily'
                    ? 'border-[#0F7A44] bg-[#EAF6EF] ring-2 ring-[#0F7A44]'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Sparkles size={18} className="text-[#0F7A44]" />
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-bold text-gray-800">
                      Single Day Doorstep Wash ({carType.toUpperCase()})
                    </div>
                    <div className="text-[11px] text-gray-500">Book for today or your chosen date</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-[#0F7A44]">₹{dailyRate}</span>
                  <span className="text-[10px] text-gray-500 block">/ day</span>
                </div>
              </button>
            </div>

            {/* Action Button */}
            <div className="pt-3">
              <button
                id="regular-service-proceed-btn"
                onClick={handleProceed}
                className="w-full py-4 px-6 bg-[#0F7A44] hover:bg-[#0c6237] active:scale-[0.99] text-white font-extrabold rounded-2xl text-base shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center space-x-2 tracking-wide"
              >
                <span>Proceed to Other Services (Add-ons)</span>
                <span className="text-emerald-200">•</span>
                <span>₹{currentPrice.toLocaleString('en-IN')}</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
