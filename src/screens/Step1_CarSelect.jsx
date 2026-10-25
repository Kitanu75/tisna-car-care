import React, { useState } from 'react';
import StepIndicator from '../components/StepIndicator';
import { CAR_TYPE_INFO } from '../data/carModels';

export default function Step1_CarSelect({ onNext, initialData }) {
  const [selectedType, setSelectedType] = useState(initialData?.carType || 'hatchback');

  const carTypes = Object.keys(CAR_TYPE_INFO);
  const currentInfo = CAR_TYPE_INFO[selectedType] || CAR_TYPE_INFO.hatchback;

  const handleNext = () => {
    if (!selectedType || !currentInfo) return;
    onNext({
      carType: selectedType,
      carTypeLabel: currentInfo.label,
      carImage: currentInfo.image,
      carSubtitle: currentInfo.subtitle
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
        {carTypes.map((type) => {
          const info = CAR_TYPE_INFO[type];
          const isSelected = selectedType === type;

          return (
            <div
              key={type}
              id={`car-type-${type}`}
              className={`car-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              <div className={`car-card-photo ${isSelected ? 'selected' : ''}`}>
                <img src={info.image} alt={info.label} loading="lazy" />
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
          id="step1-next-btn"
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
