import React, { useState } from 'react';
import StepIndicator from '../components/StepIndicator';
import { CAR_TYPE_INFO } from '../data/carModels';

// Clean vector design icons matching Figma Screen 01
const getCarVectorIcon = (type) => {
  switch (type) {
    case 'hatchback':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      );
    case 'sedan':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
          <line x1="5" y1="10" x2="16" y2="10" />
        </svg>
      );
    case 'suv':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 17h16c.6 0 1-.4 1-1v-4c0-.9-.7-1.7-1.5-1.9L16 9l-4-3H5c-.6 0-1.1.4-1.4.9L2 11.5V16c0 .6.4 1 1 1z" />
          <circle cx="6.5" cy="17" r="2" />
          <circle cx="17.5" cy="17" r="2" />
        </svg>
      );
    case 'luxury':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

export default function Step1_CarSelect({ onNext, initialData }) {
  const [selectedType, setSelectedType] = useState(initialData?.carType || 'hatchback');

  const carTypes = Object.keys(CAR_TYPE_INFO);
  const currentInfo = CAR_TYPE_INFO[selectedType] || CAR_TYPE_INFO.hatchback;

  const handleNext = () => {
    if (!selectedType || !currentInfo) return;
    onNext({
      carType: selectedType,
      carTypeLabel: currentInfo.label
    });
  };

  return (
    <>
      <StepIndicator currentStep={1} />

      <div className="section-header">
        <h2>Select Your Car Type</h2>
        <p>Choose the category that best matches your car.</p>
      </div>

      <div className="step-content">
        {/* Car Category Cards Matching Figma Screen 01 (Vector Design, No Photo Cutouts) */}
        {carTypes.map((type) => {
          const info = CAR_TYPE_INFO[type];
          const isSelected = selectedType === type;

          return (
            <div
              key={type}
              className={`car-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              <div className={`car-card-design-icon ${isSelected ? 'selected' : ''}`}>
                {getCarVectorIcon(type)}
              </div>

              <div className="car-card-text">
                <h3>{info.label}</h3>
                <p>{info.subtitle}</p>
              </div>

              <div className={`car-card-radio-circle ${isSelected ? 'checked' : ''}`}>
                {isSelected && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bottom-bar">
        <button
          className="btn btn-primary"
          onClick={handleNext}
        >
          <span>Next</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </>
  );
}
