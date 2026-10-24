import React, { useState, useEffect } from 'react';
import StepIndicator from '../components/StepIndicator';
import { storage } from '../utils/storage';

export default function Step2_PlanSelect({ carData, onNext, onBack }) {
  const [pricing, setPricing] = useState(storage.getPricing());
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [selectedDuration, setSelectedDuration] = useState('daily');

  useEffect(() => {
    const handleUpdate = () => setPricing(storage.getPricing());
    window.addEventListener('tisna_pricing_updated', handleUpdate);
    return () => window.removeEventListener('tisna_pricing_updated', handleUpdate);
  }, []);

  const carType = carData?.carType || 'hatchback';

  const getPrice = (plan, duration) => {
    return storage.calculatePlanPrice(plan, duration, carType, pricing);
  };

  const currentPrice = getPrice(selectedPlan, selectedDuration);

  const plans = [
    {
      key: 'basic',
      name: 'Basic Plan',
      desc: 'Exterior wash • Basic interior • Tyre cleaning',
      isPopular: false,
      svgIcon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      )
    },
    {
      key: 'premium',
      name: 'Premium Plan',
      badge: 'Most Popular',
      desc: 'Deep cleaning • Interior polish • Tyre & dashboard polish',
      isPopular: true,
      svgIcon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
      )
    }
  ];

  const durations = [
    { id: 'daily', label: 'Daily', unit: '/day' },
    { id: '1m', label: '1 Month', unit: '/mo' },
    { id: '3m', label: '3 Months', unit: '/3mo' },
    { id: '6m', label: '6 Months', unit: '/6mo' }
  ];

  const discount1m = Number(pricing.discounts?.['1m'] ?? 0);
  const discount3m = Number(pricing.discounts?.['3m'] ?? 7);
  const discount6m = Number(pricing.discounts?.['6m'] ?? 11);

  const getDiscount = (durId) => {
    if (durId === '1m') return discount1m;
    if (durId === '3m') return discount3m;
    if (durId === '6m') return discount6m;
    return 0;
  };

  const handleNext = () => {
    const plan = plans.find(p => p.key === selectedPlan);
    const dur = durations.find(d => d.id === selectedDuration);
    onNext({
      ...carData,
      planKey: selectedPlan,
      planName: plan.name,
      durationId: selectedDuration,
      durationLabel: dur.label,
      amount: currentPrice
    });
  };

  return (
    <>
      <StepIndicator currentStep={2} />

      <div className="section-header">
        <h2>Choose Your Plan</h2>
        <p>Select a subscription plan for a cleaner, shinier car.</p>
      </div>

      <div className="step-content">
        {/* Selected Car Header Badge */}
        {carData && (
          <div className="car-selection-badge-bar">
            {carData.carImage && (
              <img
                src={carData.carImage}
                alt={carData.carTypeLabel}
                className="car-selection-thumb"
              />
            )}
            <div className="car-selection-info">
              <span className="car-selection-label">Selected Vehicle</span>
              <h4>{carData.carTypeLabel}</h4>
            </div>
            <button className="car-selection-change-btn" onClick={onBack}>
              Change
            </button>
          </div>
        )}

        {/* Plan Cards */}
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.key;
          const planPrice = getPrice(plan.key, selectedDuration);
          const durObj = durations.find(d => d.id === selectedDuration);

          return (
            <div
              key={plan.key}
              className={`plan-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedPlan(plan.key)}
            >
              {plan.badge && (
                <div className="plan-badge-pill">{plan.badge}</div>
              )}

              <div className="plan-card-header">
                <div className="plan-card-left">
                  <div className={`plan-card-icon-wrap ${isSelected ? 'selected' : ''}`}>
                    {plan.svgIcon}
                  </div>
                  <div className="plan-card-info">
                    <h3>{plan.name}</h3>
                    <p>{plan.desc}</p>
                  </div>
                </div>

                <div className="plan-card-price-wrap">
                  <div className="plan-card-price">
                    ₹{planPrice.toLocaleString('en-IN')}
                  </div>
                  <span className="plan-card-price-unit">{durObj?.unit}</span>
                </div>
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

        {/* Duration Selection */}
        <div style={{ marginTop: 24 }}>
          <label className="model-dropdown-label">Select Duration</label>
          <div className="duration-grid">
            {durations.map((dur) => {
              const price = getPrice(selectedPlan, dur.id);
              const disc = getDiscount(dur.id);
              const isSelected = selectedDuration === dur.id;

              return (
                <div
                  key={dur.id}
                  className={`duration-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDuration(dur.id)}
                >
                  <h4>{dur.label}</h4>
                  <div className="price">₹{price.toLocaleString('en-IN')}</div>
                  {disc > 0 && <div className="discount">{disc}% OFF</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bottom-bar">
        <button className="btn btn-secondary" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back</span>
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          <span>Next</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </>
  );
}
