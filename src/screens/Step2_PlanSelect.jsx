import React, { useState } from 'react';
import StepIndicator from '../components/StepIndicator';

const PLANS_DATA = {
  basic: {
    key: 'basic',
    name: 'Basic',
    subtitle: 'Essential cleaning for your car',
    pricing: { hatchback: 999, sedan: 1199, suv: 1499, luxury: 1999 },
    baseFeatures: [
      'Exterior wash',
      'Basic interior cleaning',
      'Tyre cleaning'
    ],
    moreFeatures: [
      'Microfiber wipe down',
      'Footmat cleaning'
    ]
  },
  standard: {
    key: 'standard',
    name: 'Standard',
    badge: 'Most Popular',
    subtitle: 'Complete care inside & out',
    pricing: { hatchback: 1499, sedan: 1799, suv: 2199, luxury: 2799 },
    isPopular: true,
    baseFeatures: [
      'Exterior wash',
      'Interior cleaning',
      'Tyre polish'
    ],
    moreFeatures: [
      'Dashboard cleaning',
      'Cabin vacuuming'
    ]
  },
  premium: {
    key: 'premium',
    name: 'Premium',
    subtitle: 'Deep cleaning & extra shine',
    pricing: { hatchback: 1999, sedan: 2499, suv: 2999, luxury: 3799 },
    baseFeatures: [
      'Exterior foam wash',
      'Deep interior cleaning',
      'Tyre polish'
    ],
    moreFeatures: [
      'Dashboard polish',
      'Glass cleaning'
    ]
  },
  luxury: {
    key: 'luxury',
    name: 'Luxury',
    subtitle: 'Complete detailing & protection',
    pricing: { hatchback: 2999, sedan: 3499, suv: 3999, luxury: 4999 },
    baseFeatures: [
      'Exterior wash & wax',
      'Full interior detailing',
      'Tyre & alloy gloss'
    ],
    moreFeatures: [
      'Leather conditioning',
      'Anti-fog glass cleaning'
    ]
  }
};

const ADDITIONAL_SERVICES = [
  {
    id: 'dry-cleaning',
    name: 'Interior Dry Cleaning',
    desc: 'Seats, carpet & roof vacuuming',
    price: 999,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    )
  },
  {
    id: 'foam-wash',
    name: 'Exterior Foam Wash',
    desc: 'Snow foam wash & tyre pressure clean',
    price: 299,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20M2 6h20M2 18h20" />
      </svg>
    )
  },
  {
    id: 'polishing',
    name: 'Car Polishing',
    desc: 'Swirl removal & paint gloss shine',
    price: 1499,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  },
  {
    id: 'ceramic-coating',
    name: 'Ceramic Coating',
    desc: '9H hydrophobic long-lasting protection',
    price: 5999,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  }
];

export default function Step2_PlanSelect({ carData, onNext, onBack }) {
  const [selectedPlanKey, setSelectedPlanKey] = useState('standard');
  const [selectedAddonIds, setSelectedAddonIds] = useState([]);
  const [expandedPlans, setExpandedPlans] = useState({});

  const toggleExpand = (planKey, e) => {
    e.stopPropagation();
    setExpandedPlans(prev => ({
      ...prev,
      [planKey]: !prev[planKey]
    }));
  };

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

      {/* Selected Vehicle Badge */}
      <div style={{ padding: '0 20px', marginTop: 12 }}>
        {carData && (
          <div className="car-selection-badge-bar">
            <div className="car-selection-info">
              <span className="car-selection-label">Vehicle</span>
              <h4>{carData.carTypeLabel}</h4>
            </div>
            <button className="car-selection-change-btn" onClick={onBack}>
              Change
            </button>
          </div>
        )}
      </div>

      <div className="section-header" style={{ padding: '12px 20px 16px' }}>
        <h2>Choose Your Plan</h2>
        <p>Simple monthly plans for a cleaner car.</p>
      </div>

      <div className="step-content">
        <div className="plans-grid-v2">
          {plansList.map((plan) => {
            const isSelected = selectedPlanKey === plan.key;
            const isExpanded = !!expandedPlans[plan.key];
            const price = plan.pricing[carType] || plan.pricing.hatchback;

            return (
              <div
                key={plan.key}
                className={`plan-card-v2 ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedPlanKey(plan.key)}
              >
                {plan.badge && (
                  <div className={`plan-badge-ribbon ${plan.isPopular ? 'popular-ribbon' : ''}`}>
                    {plan.badge}
                  </div>
                )}

                <div className="plan-card-v2-header">
                  <div className="plan-header-icon-title">
                    <div className={`plan-type-icon ${isSelected ? 'selected' : ''}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <circle cx="17" cy="17" r="2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="plan-title-text">{plan.name}</h3>
                      <p className="plan-subtitle-text">{plan.subtitle}</p>
                    </div>
                  </div>

                  <div className="plan-card-price-block">
                    <div className="plan-price-num">₹{price.toLocaleString('en-IN')}</div>
                    <span className="plan-price-freq">/month</span>
                  </div>
                </div>

                {/* Base Features */}
                <ul className="plan-card-features">
                  {plan.baseFeatures.map((feat, fIdx) => (
                    <li key={fIdx} className="plan-feature-row">
                      <svg className="plan-feature-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}

                  {/* Expanded 1-2 Extra Features */}
                  {isExpanded && plan.moreFeatures.map((feat, mIdx) => (
                    <li key={`more-${mIdx}`} className="plan-feature-row plan-feature-extra">
                      <svg className="plan-feature-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Inline Action Row: More / Less toggle & Radio Selection */}
                <div className="plan-card-action-row">
                  <button
                    type="button"
                    className="plan-more-toggle-btn"
                    onClick={(e) => toggleExpand(plan.key, e)}
                  >
                    <span>{isExpanded ? 'Less' : 'More'}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <div className={`car-card-radio-circle ${isSelected ? 'checked' : ''}`}>
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Services */}
        <div style={{ marginTop: 20, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>
                Additional Services
              </h3>
              <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                Optional one-time add-on services
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
                      justifyContent: 'center',
                      flexShrink: 0
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
                      color: 'white',
                      flexShrink: 0
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

      {/* Bottom Bar */}
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
