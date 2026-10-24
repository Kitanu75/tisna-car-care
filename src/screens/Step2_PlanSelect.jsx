import React, { useState } from 'react';
import StepIndicator from '../components/StepIndicator';

// 4 Plan Types directly from Figma Screen 02 (PDF Page 2)
const PLANS_DATA = {
  basic: {
    key: 'basic',
    name: 'Basic',
    desc: 'Exterior wash • Basic interior • Tyre cleaning',
    pricing: { hatchback: 999, sedan: 1199, suv: 1499, luxury: 1999 },
    isPopular: false
  },
  standard: {
    key: 'standard',
    name: 'Standard',
    badge: 'Most Popular',
    desc: 'Exterior wash • Interior cleaning • Tyre polish',
    pricing: { hatchback: 1499, sedan: 1799, suv: 2199, luxury: 2799 },
    isPopular: true
  },
  premium: {
    key: 'premium',
    name: 'Premium',
    desc: 'Deep cleaning • Interior & dashboard polish',
    pricing: { hatchback: 1999, sedan: 2499, suv: 2999, luxury: 3799 },
    isPopular: false
  },
  luxury: {
    key: 'luxury',
    name: 'Luxury',
    desc: 'Complete detailing • Premium products',
    pricing: { hatchback: 2999, sedan: 3499, suv: 3999, luxury: 4999 },
    isPopular: false
  }
};

// Additional Services from PDF Page 7 & Page 10
const ADDITIONAL_SERVICES = [
  {
    id: 'dry-cleaning',
    name: 'Interior Dry Cleaning',
    desc: 'Seats, carpet & dashboard',
    price: 999,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    )
  },
  {
    id: 'foam-wash',
    name: 'Exterior Foam Wash',
    desc: 'Foam wash & tyre cleaning',
    price: 299,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20M2 6h20M2 18h20" />
      </svg>
    )
  },
  {
    id: 'polishing',
    name: 'Car Polishing',
    desc: 'Shine and scratch reduction',
    price: 1499,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  },
  {
    id: 'ceramic-coating',
    name: 'Ceramic Coating',
    desc: 'Long-lasting paint protection',
    price: 5999,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  }
];

export default function Step2_PlanSelect({ carData, onNext, onBack }) {
  const [selectedPlanKey, setSelectedPlanKey] = useState('standard');
  const [selectedAddonIds, setSelectedAddonIds] = useState([]);

  const carType = carData?.carType || 'hatchback';
  const plansList = Object.values(PLANS_DATA);

  const selectedPlan = PLANS_DATA[selectedPlanKey] || PLANS_DATA.standard;
  const basePrice = selectedPlan.pricing[carType] || selectedPlan.pricing.hatchback;

  const toggleAddon = (id) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectedAddonsList = ADDITIONAL_SERVICES.filter(s => selectedAddonIds.includes(s.id));
  const addonsTotal = selectedAddonsList.reduce((sum, s) => sum + s.price, 0);
  const totalAmount = basePrice + addonsTotal;

  const handleNext = () => {
    onNext({
      ...carData,
      planKey: selectedPlan.key,
      planName: `${selectedPlan.name} Plan`,
      baseAmount: basePrice,
      selectedAddons: selectedAddonsList,
      addonsTotal,
      amount: totalAmount
    });
  };

  return (
    <>
      <StepIndicator currentStep={2} />

      <div className="section-header">
        <h2>Choose Your Plan</h2>
        <p>A cleaner, shinier car every day.</p>
      </div>

      <div className="step-content">
        {/* Selected Vehicle Badge */}
        {carData && (
          <div className="car-selection-badge-bar">
            <div className="car-selection-info">
              <span className="car-selection-label">Selected Vehicle</span>
              <h4>{carData.carTypeLabel}</h4>
            </div>
            <button className="car-selection-change-btn" onClick={onBack}>
              Change
            </button>
          </div>
        )}

        {/* 4 Plan Cards (Figma Screen 02) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {plansList.map((plan) => {
            const isSelected = selectedPlanKey === plan.key;
            const price = plan.pricing[carType] || plan.pricing.hatchback;

            return (
              <div
                key={plan.key}
                className={`plan-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedPlanKey(plan.key)}
              >
                {plan.badge && (
                  <div className="plan-badge-pill">{plan.badge}</div>
                )}

                <div className="plan-card-header">
                  <div className="plan-card-left">
                    <div className="plan-card-info">
                      <h3>{plan.name}</h3>
                      <p>{plan.desc}</p>
                    </div>
                  </div>

                  <div className="plan-card-price-wrap">
                    <div className="plan-card-price">
                      ₹{price.toLocaleString('en-IN')}
                    </div>
                    <span className="plan-card-price-unit">/month</span>
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
        </div>

        {/* Additional Services (Optional Add-ons from PDF Page 7 & Page 10) */}
        <div style={{ marginTop: 24, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>
                Additional Services
              </h3>
              <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                Optional one-time or add-on services
              </p>
            </div>
            {selectedAddonIds.length > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '3px 8px', borderRadius: 12 }}>
                {selectedAddonIds.length} Added
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ADDITIONAL_SERVICES.map((addon) => {
              const isChecked = selectedAddonIds.includes(addon.id);

              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: isChecked ? '2px solid var(--primary)' : '1.5px solid var(--gray-200)',
                    background: isChecked ? 'var(--primary-light)' : 'var(--white)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: isChecked ? 'rgba(8, 102, 232, 0.15)' : 'var(--gray-100)',
                      color: isChecked ? 'var(--primary)' : 'var(--gray-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {addon.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>
                        {addon.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 1 }}>
                        {addon.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>
                      +₹{addon.price.toLocaleString('en-IN')}
                    </div>
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      border: isChecked ? 'none' : '2px solid var(--gray-300)',
                      background: isChecked ? 'var(--primary)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      {isChecked && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
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
          <span>Next (₹{totalAmount.toLocaleString('en-IN')})</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </>
  );
}
