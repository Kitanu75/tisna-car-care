import React, { useState } from 'react';
import { X, Plus, Check, Car, Fuel, Calendar, ShieldCheck } from 'lucide-react';
import appConfig from '../data/appConfig';
import { storage } from '../utils/storage';

export default function CarDetailsModal({ isOpen, onClose, onAddNewCar }) {
  const [cars, setCars] = useState(storage.getCars());
  const [activeCarId, setActiveCarId] = useState(storage.getActiveCarId());

  if (!isOpen) return null;

  const handleSelectCar = (id) => {
    storage.setActiveCarId(id);
    setActiveCarId(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up p-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base">Your Garage / Vehicles</h3>
            <p className="text-xs text-gray-500">Switch or manage your registered cars</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cars List */}
        <div className="py-4 space-y-3 overflow-y-auto flex-1">
          {cars.map((car) => {
            const isActive = car.id === activeCarId;
            return (
              <div
                key={car.id}
                onClick={() => handleSelectCar(car.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isActive
                    ? 'border-[#0F7A44] bg-[#EAF6EF] ring-2 ring-[#0F7A44]'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-12 bg-white rounded-xl p-1 flex items-center justify-center border border-gray-100 shadow-sm">
                    <img
                      src={car.image || "/assets/honda-city.png"}
                      alt={car.model}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm font-bold text-gray-900">{car.brand} {car.model}</span>
                      <span className="text-[10px] bg-gray-100 px-1.5 py-0.2 rounded font-semibold text-gray-600 capitalize">
                        {car.carType}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gray-600 uppercase block">{car.regNumber}</span>
                    <span className="text-[10px] text-gray-400">{car.year} • {car.fuelType || 'Petrol'}</span>
                  </div>
                </div>

                <div>
                  {isActive ? (
                    <div className="w-6 h-6 rounded-full bg-[#0F7A44] text-white flex items-center justify-center">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-[#0F7A44] hover:underline">Select</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Another Car Button */}
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={() => {
              onClose();
              onAddNewCar();
            }}
            className="w-full py-3 px-4 border border-[#0F7A44] text-[#0F7A44] hover:bg-emerald-50 active:scale-[0.99] font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition"
          >
            <Plus size={16} />
            <span>Add Another Car</span>
          </button>
        </div>
      </div>
    </div>
  );
}
