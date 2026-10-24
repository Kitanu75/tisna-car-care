import React, { useState } from 'react';
import StepIndicator from '../components/StepIndicator';

// 4 Plan Types directly aligned with Figma Screen 02 & Reference Design
const PLANS_DATA = {
  basic: {
    key: 'basic',
    name: 'Basic',
    subtitle: 'Essential cleaning for your car',
    badge: null,
    pricing: { hatchback: 999, sedan: 1199, suv: 1499, luxury: 1999 },
    features: [
      'Exterior wash & wipe',
      'Basic interior cleaning',
      'Tyre cleaning & rinse'
    ],
    detailedInclusions: [
      'Exterior high-pressure dry dusting with soft microfiber',
      'Alternate day water-based exterior body wash & wipe',
      'Footmat removal, shaking & dust cleaning (2x / month)',
      'Tyre sidewall mud wash & wheel water rinse',
      'Streak-free windshield & window glass cleaning'
    ],
    whatsExtra: 'Essential daily doorstep exterior cleaning package for convenient everyday maintenance.'
  },
  standard: {
    key: 'standard',
    name: 'Standard',
    badge: 'Most Popular',
    subtitle: 'Complete care inside & out',
    pricing: { hatchback: 1499, sedan: 1799, suv: 2199, luxury: 2799 },
    isPopular: true,
    features: [
      'Exterior wash & wipe',
      'Interior cleaning & vacuum',
      'Tyre polish & gloss',
      'Dashboard cleaning & wipe'
    ],
    detailedInclusions: [
      'Everything included in Basic Plan',
      'Dashboard cleaning, dusting & conditioning wipe',
      'Interior cabin vacuuming (4 times / month - weekly)',
      'High-gloss tyre dressing & rim black shine polish',
      'Scratch-free two-bucket microfiber washing system',
      'Center console & door panels detailed dusting'
    ],
    whatsExtra: 'Compared to Basic: Adds Dashboard Conditioning, High-Gloss Tyre Dressing, and 2x more interior vacuuming visits.'
  },
  premium: {
    key: 'premium',
    name: 'Premium',
    badge: 'Deep Clean',
    subtitle: 'Deep cleaning & extra shine',
    pricing: { hatchback: 1999, sedan: 2499, suv: 2999, luxury: 3799 },
    features: [
      'Exterior wash & foam wash',
      'Deep interior cleaning & vacuum',
      'Tyre polish & dressing',
      'Dashboard polish & UV shield',
      'Glass cleaning & anti-fog wipe'
    ],
    detailedInclusions: [
      'Everything included in Standard Plan',
      'Deep interior vacuuming of seats, floor carpet & boot (weekly)',
      'Dashboard, glove box & vinyl polish with UV sun protector',
      'Anti-streak glass cleaner on all windows & mirrors inside/out',
      'AC vent deep dusting with soft bristle brush',
      'Monthly spray liquid wax buff for enhanced body shine',
      'Long-lasting hydrophobic tyre black shine'
    ],
    whatsExtra: 'Compared to Standard: Adds Deep Trunk Vacuuming, UV Dashboard Polish, Anti-Streak Glass Treatment, AC Vent Detailing, and Wax Shine Boost.'
  },
  luxury: {
    key: 'luxury',
    name: 'Luxury',
    badge: 'Showroom Finish',
    subtitle: 'Complete detailing & premium protection',
    pricing: { hatchback: 2999, sedan: 3499, suv: 3999, luxury: 4999 },
    features: [
      'Complete exterior wash & wax shine',
      'Full interior detailing & vacuum',
      'Tyre & alloy wheel deep gloss',
      'Dashboard & leather seat conditioning',
      'Anti-fog glass coating',
      'Cabin fragrance & air sanitization'
    ],
    detailedInclusions: [
      'Everything included in Premium Plan',
      'Full showroom-grade exterior wash & high-carnauba wax hand buff',
      'Leather seat deep conditioning / Fabric stain spot cleaning',
      'Alloy wheel rim degreasing & brake dust removal',
      'Engine bay cowl surface dusting & wipe',
      'Antibacterial cabin odor removal & premium mist fragrance',
      'Dedicated senior car care specialist assigned to your car'
    ],
    whatsExtra: 'Compared to Premium: Complete showroom-level detailing with Leather Seat Conditioning, Alloy Wheel Degreasing, Engine Bay Dusting, and Antibacterial Sanitization.'
  }
};

// Trust Badges from Reference Design
const TRUST_BADGES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </svg>
    ),
    title: 'Trained Staff'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
    title: 'Eco Products'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: 'Doorstep Daily'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Safe & Reliable'
  }
];

// Additional Services (Add-ons from PDF Page 7 & Page 10)
const ADDITIONAL_SERVICES = [
  {
    id: 'dry-cleaning',
    name: 'Interior Dry Cleaning',
    desc: 'Seats, carpet & roof deep vacuum dry cleaning',
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
    desc: 'Thick snow foam wash & tyre pressure clean',
    price: 299,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20M2 6h20M2 18h20" />
      </svg>
    )
  },
  {
    id: 'polishing',
    name: 'Machine Car Polishing',
    desc: 'Swirl removal & deep paint gloss shine',
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
    desc: '9H hydrophobic long-lasting paint shield',
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
  const [activeDetailsPlan, setActiveDetailsPlan] = useState(null);

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
              <span className="car-selection-label">Vehicle Selected</span>
              <h4>{carData.carTypeLabel}</h4>
            </div>
            <button className="car-selection-change-btn" onClick={onBack}>
              Change
            </button>
          </div>
        )}
      </div>

      {/* Trust Badges Strip (from Reference Image) */}
      <div className="trust-strip-container">
        {TRUST_BADGES.map((b, idx) => (
          <div key={idx} className="trust-strip-item">
            <div className="trust-strip-icon">{b.icon}</div>
            <span className="trust-strip-title">{b.title}</span>
          </div>
        ))}
      </div>

      <div className="section-header" style={{ padding: '8px 20px 14px' }}>
        <h2>Choose Your Plan</h2>
        <p>Simple monthly plans for a cleaner, shinier car.</p>
      </div>

      <div className="step-content">
        {/* 4 Plan Cards (Matching Reference Design with Features & View Details) */}
        <div className="plans-grid-v2">
          {plansList.map((plan) => {
            const isSelected = selectedPlanKey === plan.key;
            const price = plan.pricing[carType] || plan.pricing.hatchback;

            return (
              <div
                key={plan.key}
                className={`plan-card-v2 ${isSelected ? 'selected' : ''} ${plan.isPopular ? 'popular' : ''}`}
                onClick={() => setSelectedPlanKey(plan.key)}
              >
                {/* Popular Badge Ribbon */}
                {plan.badge && (
                  <div className={`plan-badge-ribbon ${plan.isPopular ? 'popular-ribbon' : ''}`}>
                    {plan.badge}
                  </div>
                )}

                <div className="plan-card-v2-header">
                  <div className="plan-header-icon-title">
                    <div className={`plan-type-icon ${isSelected ? 'selected' : ''}`}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

                {/* Feature Bullet List (Like Reference Design) */}
                <ul className="plan-card-features">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="plan-feature-row">
                      <svg className="plan-feature-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Card Action Row: View Details & Radio Circle */}
                <div className="plan-card-action-row">
                  <button
                    type="button"
                    className="plan-view-details-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDetailsPlan(plan);
                    }}
                  >
                    <span>View Details</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
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

        {/* Additional Services (Optional Add-ons) */}
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>
                Additional Services
              </h3>
              <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                Optional one-time or add-on doorstep services
              </p>
            </div>
            {selectedAddonIds.length > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 10px', borderRadius: 12 }}>
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
                      width: 34,
                      height: 34,
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

      {/* Plan Details & What's Extra Modal */}
      {activeDetailsPlan && (
        <div className="plan-modal-overlay" onClick={() => setActiveDetailsPlan(null)}>
          <div className="plan-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="plan-modal-header">
              <div>
                {activeDetailsPlan.badge && (
                  <span className="plan-modal-badge">{activeDetailsPlan.badge}</span>
                )}
                <h3>{activeDetailsPlan.name} Plan Details</h3>
                <p className="plan-modal-sub">{activeDetailsPlan.subtitle}</p>
              </div>
              <button
                className="plan-modal-close-btn"
                onClick={() => setActiveDetailsPlan(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="plan-modal-body">
              {/* Highlight Box: What's Extra in this Plan */}
              <div className="whats-extra-highlight-card">
                <div className="whats-extra-title">
                  <span>✨</span>
                  <h4>What's Extra in {activeDetailsPlan.name}</h4>
                </div>
                <p className="whats-extra-desc">{activeDetailsPlan.whatsExtra}</p>
              </div>

              {/* Complete Inclusions Checklist */}
              <div className="modal-inclusions-wrap">
                <h4>What's Included ({carData?.carTypeLabel || 'Your Vehicle'})</h4>
                <ul className="modal-inclusions-list">
                  {activeDetailsPlan.detailedInclusions.map((item, idx) => (
                    <li key={idx} className="modal-inclusion-item">
                      <div className="modal-check-dot">✓</div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Schedule & Product Guarantee */}
              <div className="modal-schedule-card">
                <div className="schedule-row">
                  <strong>🗓️ Service Frequency:</strong>
                  <span>26 Days Exterior doorstep service + scheduled interior care</span>
                </div>
                <div className="schedule-row">
                  <strong>🧪 Products Used:</strong>
                  <span>pH-balanced shampoo, dual microfiber scratch-free cloths, UV vinyl polish</span>
                </div>
              </div>
            </div>

            <div className="plan-modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedPlanKey(activeDetailsPlan.key);
                  setActiveDetailsPlan(null);
                }}
              >
                <span>Select {activeDetailsPlan.name} (₹{(activeDetailsPlan.pricing[carType] || activeDetailsPlan.pricing.hatchback).toLocaleString('en-IN')}/mo)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar: Tight spacing, zero awkward gap */}
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
