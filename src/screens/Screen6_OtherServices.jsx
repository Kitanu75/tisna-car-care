import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Sparkles, Check, Plus, ShieldCheck, ArrowRight } from 'lucide-react';
import appConfig from '../data/appConfig';
import { storage } from '../utils/storage';

export default function Screen6_OtherServices({ 
  basePlan, 
  onBack, 
  onProceedToSchedule,
  onBookDirectOneTime 
}) {
  const [pricing, setPricing] = useState(storage.getPricing());
  const [selectedAddonIds, setSelectedAddonIds] = useState([]);

  useEffect(() => {
    const handlePricingUpdate = () => {
      setPricing(storage.getPricing());
    };
    window.addEventListener('tisna_pricing_updated', handlePricingUpdate);
    return () => window.removeEventListener('tisna_pricing_updated', handlePricingUpdate);
  }, []);

  const otherServices = appConfig.getOtherServices();
  const hasBasePlan = !!basePlan?.planName;
  const baseAmount = basePlan?.amount || 0;
  const carType = basePlan?.carSegment || 'sedan';
  const carImage = appConfig.getCarImage(carType);

  const toggleAddon = (serviceId) => {
    setSelectedAddonIds((prev) => 
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  const selectedAddonsList = otherServices.filter(s => selectedAddonIds.includes(s.id));
  const addonsTotal = selectedAddonsList.reduce((sum, s) => sum + s.price, 0);
  const totalPayable = (hasBasePlan ? baseAmount : 0) + addonsTotal;

  // Proceed with regular plan + chosen add-ons
  const handleContinueWithAddons = () => {
    if (onProceedToSchedule) {
      onProceedToSchedule({
        ...basePlan,
        selectedAddons: selectedAddonsList,
        addonsTotal: addonsTotal,
        amount: hasBasePlan ? (baseAmount + addonsTotal) : (addonsTotal || 500)
      });
    }
  };

  // Skip add-ons and continue directly with just base regular plan
  const handleSkipAddons = () => {
    if (onProceedToSchedule) {
      onProceedToSchedule({
        ...basePlan,
        selectedAddons: [],
        addonsTotal: 0,
        amount: baseAmount
      });
    }
  };

  // Direct 1-click booking of a single service (when user arrives without a regular plan)
  const handleBookSingleService = (service) => {
    if (onProceedToSchedule) {
      onProceedToSchedule({
        serviceType: 'onetime',
        serviceId: service.id,
        planName: service.name,
        serviceSubtitle: 'One Time Specialized Detailing',
        carSegment: carType,
        amount: service.price,
        image: service.image,
        selectedAddons: [service],
        addonsTotal: service.price
      });
    } else if (onBookDirectOneTime) {
      onBookDirectOneTime(service);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-16">
      
      {/* 3-Step Clean Progress Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
            title="Back to Step 1"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="text-xs uppercase tracking-wider font-extrabold text-[#0F7A44] block">Step 2 of 3</span>
            <h2 className="text-sm sm:text-base font-black text-gray-900">Choose Other Services (Optional Add-ons)</h2>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-xs font-bold text-gray-400">
          <span className="text-emerald-700 font-bold">1. Car & Plan ✓</span>
          <span>→</span>
          <span className="text-gray-900 font-extrabold">2. Other Services</span>
          <span>→</span>
          <span>3. Details & Payment</span>
        </div>
      </div>

      {/* Selected Base Regular Plan Summary (from Page 1) */}
      {hasBasePlan && (
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-500/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-16 h-12 bg-emerald-50 rounded-2xl p-1 flex items-center justify-center border border-emerald-100 flex-shrink-0">
              <img src={carImage} alt={carType} className="max-h-full max-w-full object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-emerald-100 text-[#0F7A44] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase">
                <Check size={12} strokeWidth={3} />
                <span>Selected Plan from Step 1</span>
              </div>
              <h3 className="text-base font-extrabold text-gray-900 mt-0.5">
                {basePlan.carNumber ? `${basePlan.carNumber} • ${carType.toUpperCase()}` : `${carType.toUpperCase()} Car`}
              </h3>
              <p className="text-xs text-gray-500">
                {basePlan.planName} • {basePlan.durationLabel || (basePlan.isDaily ? 'Daily Wash' : `${basePlan.durationId?.toUpperCase() || '1M'} Plan`)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 self-end sm:self-center">
            <div className="text-right">
              <span className="text-xl font-black text-[#0F7A44]">
                ₹ {baseAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-gray-400 block">Base service price</span>
            </div>
            <button
              onClick={handleSkipAddons}
              className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition"
            >
              Skip Add-ons →
            </button>
          </div>
        </div>
      )}

      {/* Services Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {otherServices.map((service) => {
          const isSelected = selectedAddonIds.includes(service.id);
          return (
            <div
              key={service.id}
              className={`bg-white rounded-3xl p-5 shadow-sm border transition-all duration-200 flex flex-col justify-between group ${
                isSelected 
                  ? 'border-[#0F7A44] ring-2 ring-[#0F7A44] bg-[#F7FBF9]' 
                  : 'border-gray-100 hover:shadow-md hover:border-emerald-200'
              }`}
            >
              <div className="space-y-3.5">
                <div className="h-44 sm:h-48 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {service.category}
                  </span>
                  {isSelected && (
                    <span className="absolute top-2.5 right-2.5 bg-[#0F7A44] text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
                      <Check size={13} strokeWidth={3} />
                      <span>Added</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed mt-1">
                    {service.description}
                  </p>
                  
                  {/* Features Bullets */}
                  <div className="mt-3 space-y-1.5 pt-2 border-t border-gray-100">
                    {service.features?.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-xs text-gray-600">
                        <Check size={12} className="text-[#0F7A44] flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-[#0F7A44]">
                    ₹ {service.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-400 block flex items-center mt-0.5">
                    <Clock size={12} className="mr-1" />
                    {service.duration}
                  </span>
                </div>

                {hasBasePlan ? (
                  <button
                    id={`toggle-addon-${service.id}`}
                    onClick={() => toggleAddon(service.id)}
                    className={`py-2 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition active:scale-95 ${
                      isSelected
                        ? 'bg-[#0F7A44] text-white shadow-xs'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-[#0F7A44] border border-emerald-200'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check size={14} strokeWidth={2.5} />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} strokeWidth={2.5} />
                        <span>Add Service</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    id={`book-service-${service.id}`}
                    onClick={() => handleBookSingleService(service)}
                    className="py-2 px-5 bg-[#0F7A44] hover:bg-[#0c6237] active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating / Sticky Bottom Bar when in Booking Flow */}
      {hasBasePlan && (
        <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0F7A44] flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-500">
                {selectedAddonIds.length > 0 
                  ? `${basePlan.planName} + ${selectedAddonIds.length} Add-on${selectedAddonIds.length > 1 ? 's' : ''}`
                  : `${basePlan.planName} (No add-ons selected)`}
              </div>
              <div className="text-xl sm:text-2xl font-black text-gray-900">
                Total: <span className="text-[#0F7A44]">₹ {totalPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleSkipAddons}
              className="flex-1 sm:flex-initial py-3.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm rounded-2xl transition"
            >
              Skip Add-ons
            </button>
            <button
              id="continue-to-schedule-btn"
              onClick={handleContinueWithAddons}
              className="flex-1 sm:flex-initial py-3.5 px-7 bg-[#0F7A44] hover:bg-[#0c6237] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Continue to Step 3 (Details & Payment)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
