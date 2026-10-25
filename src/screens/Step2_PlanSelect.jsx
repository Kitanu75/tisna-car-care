import React, { useState } from 'react';
import StepIndicator from '../components/StepIndicator';

const PLANS_DATA = {
  basic: {
    key: 'basic',
    name: 'Basic Care',
    subtitle: 'Everyday exterior cleanliness',
    pricing: {
      hatchback: 450,
      sedan: 600,
      suv: 700,
      sevenSeater: 750,
      luxury: 900
    },
    baseFeatures: [
      'Daily exterior dust cleaning',
      'Windshield & window cleaning',
      'Mirrors & door handles cleaning'
    ],
    moreFeatures: []
  },
  standard: {
    key: 'standard',
    name: 'Standard Care',
    badge: 'Most Popular',
    subtitle: 'Complete care inside & out',
    pricing: {
      hatchback: 650,
      sedan: 800,
      suv: 900,
      sevenSeater: 1000,
      luxury: 1300
    },
    isPopular: true,
    baseFeatures: [
      'Everything in Basic',
      'Interior cleaning 1×/month',
      'Dashboard cleaning'
    ],
    moreFeatures: [
      'Floor mat cleaning'
    ]
  },
  premium: {
    key: 'premium',
    name: 'Premium Care',
    subtitle: 'Deep cleaning & extra shine',
    pricing: {
      hatchback: 850,
      sedan: 1200,
      suv: 1400,
      sevenSeater: 1550,
      luxury: 1800
    },
    baseFeatures: [
      'Everything in Standard',
      'Tyre polish 1×/month',
      'Interior polish 1×/month'
    ],
    moreFeatures: [
      'Exterior foam wash 1×/month'
    ]
  },
  luxury: {
    key: 'luxury',
    name: 'Luxury Care',
    subtitle: 'Ultimate cleaning & premium shine',
    pricing: {
      hatchback: 1300,
      sedan: 1600,
      suv: 1900,
      sevenSeater: 2050,
      luxury: 2200
    },
    baseFeatures: [
      'Everything in Premium',
      'Powerful vacuum interior cleaning',
      'Full pressure wash 1×/month'
    ],
    moreFeatures: [
      'Deep interior cleaning 1×/month',
      'Dashboard & trim polish 2×/month',
      'Tyre polish 2×/month',
      'Priority booking'
    ]
  }
};

const ADDITIONAL_SERVICES = [
  {
    id: 'foam-wash',
    name: 'Exterior Foam Wash',
    desc: 'Snow foam wash & tyre pressure clean',
    pricing: { hatchback: 300, sedan: 350, suv: 400, sevenSeater: 500, luxury: 500 },
    image: '/assets/service-foam-wash.jpg'
  },
  {
    id: 'dry-cleaning',
    name: 'Interior Dry Cleaning',
    desc: 'Deep seat, carpet & roof vacuuming with high-power machine',
    priceOnCall: true,
    image: '/assets/service-vacuum-clean.jpg'
  },
  {
    id: 'polishing',
    name: 'Car Polishing',
    desc: 'Swirl removal & paint gloss shine',
    priceOnCall: true,
    image: '/assets/service-polishing.jpg'
  },
  {
    id: 'ceramic-coating',
    name: 'Ceramic Coating',
    desc: '9H hydrophobic long-lasting protection',
    priceOnCall: true,
    image: '/assets/service-ceramic-coating.jpg'
  },
  {
    id: 'mechanical-work',
    name: 'Mechanical Works',
    desc: 'Doorstep engine, brakes, AC & battery inspection',
    priceOnCall: true,
    image: '/assets/service-mechanical.jpg'
  },
  {
    id: 'denting-painting',
    name: 'Denting & Painting',
    desc: 'Panel dent repair & flawless paint finish',
    priceOnCall: true,
    image: '/assets/service-denting-painting.jpg'
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

  const selectedAddonsList = ADDITIONAL_SERVICES
    .filter(s => selectedAddonIds.includes(s.id))
    .map(s => ({
      ...s,
      isPriceOnCall: !!s.priceOnCall,
      price: s.priceOnCall ? 0 : (s.pricing?.[carType] || s.pricing?.hatchback || 0)
    }));

  const addonsTotal = selectedAddonsList.reduce((sum, s) => sum + s.price, 0);
  const totalAmount = basePrice + addonsTotal;

  const handleNext = () => {
    onNext({
      ...carData,
      planKey: selectedPlan.key,
      planName: selectedPlan.name,
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <h3 className="plan-title-text">{plan.name}</h3>
                        {plan.badge && (
                          <span className={`plan-badge-pill ${plan.isPopular ? 'popular-pill' : ''}`}>
                            {plan.badge}
                          </span>
                        )}
                      </div>
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
                  {plan.moreFeatures.length > 0 ? (
                  <button
                    type="button"
                    id={`plan-more-${plan.key}`}
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
                  ) : <span />}

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
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>
                Additional Services
              </h3>
              <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                Optional one-time add-on services for your vehicle
              </p>
            </div>
            {selectedAddonIds.length > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '3px 8px', borderRadius: 12 }}>
                {selectedAddonIds.length} Added
              </span>
            )}
          </div>

          <div className="addon-banner-list">
            {ADDITIONAL_SERVICES.map((addon) => {
              const isChecked = selectedAddonIds.includes(addon.id);
              const addonPrice = addon.pricing?.[carType] || addon.pricing?.hatchback || 0;

              return (
                <div
                  key={addon.id}
                  id={`addon-${addon.id}`}
                  className={`addon-banner-card ${isChecked ? 'selected' : ''}`}
                  onClick={() => toggleAddon(addon.id)}
                >
                  <img className="addon-banner-img" src={addon.image} alt={addon.name} loading="lazy" />
                  <div className="addon-banner-overlay" />

                  <div className={`addon-banner-check ${isChecked ? 'checked' : ''}`}>
                    {isChecked && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>

                  <div className="addon-banner-content">
                    <div>
                      <div className="addon-banner-name">{addon.name}</div>
                      <div className="addon-banner-desc">{addon.desc}</div>
                    </div>
                    <div className={`addon-banner-price ${addon.priceOnCall ? 'on-call' : ''}`}>
                      {addon.priceOnCall ? 'Price on Call' : `+₹${addonPrice.toLocaleString('en-IN')}`}
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
