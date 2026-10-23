import React, { useState } from 'react';
import { ArrowLeft, Car, Check, ChevronDown, Sparkles } from 'lucide-react';
import appConfig from '../data/appConfig';
import { storage } from '../utils/storage';

export default function Screen3_AddCar({ onBack, onCarAdded }) {
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState('Honda');
  const [model, setModel] = useState('City');
  const [year, setYear] = useState('2018');
  const [regNumber, setRegNumber] = useState('DL 08 AB 1234');
  const [carType, setCarType] = useState('sedan');
  const [fuelType, setFuelType] = useState('Petrol');
  const [isSuccess, setIsSuccess] = useState(false);

  const pricing = storage.getPricing();

  const brandOptions = [
    'Honda', 'Hyundai', 'Maruti Suzuki', 'Tata Motors', 'Mahindra', 
    'Toyota', 'Kia', 'Volkswagen', 'Skoda', 'BMW', 'Mercedes-Benz', 'Audi'
  ];

  const modelsByBrand = {
    'Honda': ['City', 'Amaze', 'Elevate', 'Civic', 'CR-V', 'Jazz'],
    'Hyundai': ['Creta', 'i20', 'Venue', 'Verna', 'Tucson', 'Aura'],
    'Maruti Suzuki': ['Swift', 'Baleno', 'Brezza', 'Dzire', 'Grand Vitara', 'Fronx'],
    'Tata Motors': ['Nexon', 'Harrier', 'Safari', 'Punch', 'Altroz', 'Tiago'],
    'Mahindra': ['Scorpio-N', 'XUV700', 'Thar', 'Bolero', 'XUV300'],
    'Toyota': ['Fortuner', 'Innova Hycross', 'Urban Cruiser', 'Camry', 'Glanza'],
    'Kia': ['Seltos', 'Sonet', 'Carens', 'EV6'],
    'BMW': ['3 Series', '5 Series', 'X1', 'X3', 'X5'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'GLA', 'GLC'],
    'Audi': ['A4', 'A6', 'Q3', 'Q5'],
    'Volkswagen': ['Virtus', 'Taigun', 'Polo'],
    'Skoda': ['Slavia', 'Kushaq', 'Octavia']
  };

  const years = Array.from({ length: 15 }, (_, i) => String(2026 - i));

  const handleBrandChange = (selectedBrand) => {
    setBrand(selectedBrand);
    const available = modelsByBrand[selectedBrand] || ['Standard'];
    setModel(available[0]);
  };

  const handleSaveAndContinue = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    const newCar = {
      brand,
      model,
      year,
      regNumber: regNumber.toUpperCase().trim(),
      carType,
      fuelType,
      image: '/assets/honda-city.png',
      isPrimary: true
    };

    storage.addCar(newCar);
    setIsSuccess(true);

    setTimeout(() => {
      onCarAdded(newCar);
    }, 400);
  };

  return (
    <div className="max-w-2xl mx-auto my-4 sm:my-8 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
      {/* Top Header */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={() => {
              if (step === 2) setStep(1);
              else onBack();
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 bg-gray-50 hover:bg-gray-100 transition active:scale-95"
            title="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Add Vehicle to Garage</h2>
        </div>

        {/* 2-Step Stepper */}
        <div className="flex items-center justify-center px-8 mb-6 max-w-sm mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#0F7A44] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-800/20">
              {step === 2 ? <Check size={16} /> : "1"}
            </div>
            <span className="text-xs font-bold text-[#0F7A44] mt-1">Car Details</span>
          </div>

          <div className={`h-0.5 w-24 mx-2 transition-colors ${step === 2 ? 'bg-[#0F7A44]' : 'bg-gray-200'}`}></div>

          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
              step === 2 
                ? 'bg-[#0F7A44] text-white shadow-md shadow-emerald-800/20' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className={`text-xs font-semibold mt-1 ${step === 2 ? 'text-[#0F7A44]' : 'text-gray-400'}`}>
              Confirm
            </span>
          </div>
        </div>

        {/* Car Image Preview */}
        <div className="flex justify-center my-4 bg-gradient-to-b from-gray-50 to-white rounded-3xl p-4 border border-gray-100 shadow-xs relative">
          <img 
            src="/assets/honda-city.png" 
            alt="Car Preview" 
            className="h-36 sm:h-44 object-contain filter drop-shadow-md"
          />
          <div className="absolute top-3 right-3 bg-emerald-50 text-[#0F7A44] border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full capitalize">
            {carType}
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            {/* Brand & Model Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Car Brand / Make</label>
                <div className="relative">
                  <select
                    value={brand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                  >
                    {brandOptions.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Model Name</label>
                <div className="relative">
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                  >
                    {(modelsByBrand[brand] || [model]).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Year & Registration Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Manufacturing Year</label>
                <div className="relative">
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Registration Number</label>
                <input
                  type="text"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                  placeholder="DL 08 AB 1234"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-gray-800 uppercase focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                />
              </div>
            </div>

            {/* Car Type Selector Cards */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Car Segment <span className="text-[11px] text-gray-400 font-normal">(Sets your tailored service rates)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {appConfig.carTypes.map((type) => {
                  const isSelected = carType === type.id;
                  const dailyBasic = pricing.carTypePricing?.basic?.[type.id] ?? type.defaultBasic;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setCarType(type.id)}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'border-[#0F7A44] bg-[#EAF6EF] text-[#0F7A44] shadow-xs font-bold ring-2 ring-[#0F7A44]'
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <Car size={24} className={isSelected ? 'text-[#0F7A44]' : 'text-gray-400'} />
                      <span className="text-xs mt-1.5 font-bold leading-tight">{type.shortLabel}</span>
                      <span className="text-[11px] text-gray-500 mt-1 font-semibold">₹{dailyBasic}/day</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Fuel Type</label>
              <div className="grid grid-cols-4 gap-2">
                {['Petrol', 'Diesel', 'CNG', 'Electric'].map((fuel) => (
                  <button
                    key={fuel}
                    type="button"
                    onClick={() => setFuelType(fuel)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      fuelType === fuel
                        ? 'border-[#0F7A44] bg-[#EAF6EF] text-[#0F7A44] ring-1 ring-[#0F7A44]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {fuel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Step 2: Confirmation Summary */
          <div className="space-y-3 bg-gray-50 p-6 rounded-3xl border border-gray-200 animate-fade-in text-xs sm:text-sm">
            <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2.5">
              Vehicle Registration Summary
            </h3>
            
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Make & Model</span>
              <span className="font-bold text-gray-900">{brand} {model}</span>
            </div>
            
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Registration Number</span>
              <span className="font-bold text-gray-900 uppercase">{regNumber}</span>
            </div>
            
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Body Segment</span>
              <span className="font-bold text-gray-900 capitalize">{carType}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-gray-500">Manufacturing Year</span>
              <span className="font-bold text-gray-900">{year}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-gray-500">Fuel Type</span>
              <span className="font-bold text-gray-900">{fuelType}</span>
            </div>

            <div className="pt-3 border-t border-gray-200 flex items-center space-x-2 text-[#0F7A44] font-semibold text-xs">
              <Sparkles size={16} />
              <span>Doorstep wash available across Delhi NCR & Noida.</span>
            </div>
          </div>
        )}
      </div>

      {/* Save & Continue Button */}
      <div className="pt-6">
        <button
          id="add-car-submit-btn"
          type="button"
          onClick={handleSaveAndContinue}
          className="w-full py-4 px-6 bg-[#0F7A44] hover:bg-[#0c6237] active:scale-[0.99] text-white font-extrabold rounded-2xl text-base shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center tracking-wide"
        >
          {isSuccess ? (
            <div className="flex items-center space-x-2">
              <Check size={18} />
              <span>Vehicle Saved!</span>
            </div>
          ) : step === 1 ? (
            'Continue to Review'
          ) : (
            'Save & Continue'
          )}
        </button>
      </div>
    </div>
  );
}
