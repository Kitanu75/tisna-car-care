import React from 'react';

export default function StepIndicator({ currentStep = 1 }) {
  return (
    <div className="step-indicator">
      {[1, 2, 3].map((step, i) => (
        <React.Fragment key={step}>
          <div
            className={`step-dot ${
              step < currentStep ? 'completed' :
              step === currentStep ? 'active' : 'pending'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {i < 2 && (
            <div className={`step-line ${step < currentStep ? 'active' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
