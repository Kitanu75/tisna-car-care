import React, { useState, useEffect } from 'react';
import { CAR_TYPE_INFO } from '../data/carModels';
import { storage } from '../utils/storage';

const PLANS_DATA = {
  basic: {
    key: 'basic',
    name: 'Basic Care',
    subtitle: 'Everyday exterior cleanliness',
    pricing: {
      hatchback: 399,
      sedan: 499,
      suv: 599
    },
    features: [
      'Daily exterior dust cleaning',
      'Windshield and window cleaning',
      'Mirrors and door handle cleaning',
      'Interior cleaning — 4 times/month',
      'Dashboard cleaning — 4 times/month',
      'Floor mat cleaning — 4 times/month'
    ]
  },
  premium: {
    key: 'premium',
    name: 'Premium Care',
    badge: 'MOST POPULAR',
    subtitle: 'Deep clean. More shine. More care.',
    pricing: {
      hatchback: 799,
      sedan: 899,
      suv: 999
    },
    isPopular: true,
    plusTitle: 'Includes all Basic Care services, plus:',
    plusFeatures: [
      'Deep interior cleaning – 2 times/month',
      'Dashboard polish – 2 times/month',
      'Tyre cleaning and polishing – 2 times/month',
      'Shampoo cleaning – 1 time/month with jet spray'
    ]
  }
};

export default function Step2_PlanSelect({ carData, onNext, onBack }) {
  // Default selected plan is Premium Care per design screenshot
  const [selectedPlanKey, setSelectedPlanKey] = useState('premium');

  // 100% Dynamic Live Pricing synced in realtime from Firebase Cloud
  const [livePricing, setLivePricing] = useState(() => storage.getPricing());

  useEffect(() => {
    const handleUpdate = () => {
      setLivePricing(storage.getPricing());
    };
    window.addEventListener('tisna_pricing_updated', handleUpdate);
    return () => window.removeEventListener('tisna_pricing_updated', handleUpdate);
  }, []);

  const carType = carData?.carType || 'hatchback';
  const carInfo = CAR_TYPE_INFO[carType] || {
    label: carData?.carTypeLabel || 'Small Car / Hatchback',
    subtitle: carData?.carSubtitle || 'Selected Segment'
  };

  // Helper resolving plan price dynamically from Firebase Realtime Database
  const getPlanPrice = (planKey, segment) => {
    const liveVal = livePricing?.plans?.[planKey]?.[segment]
      ?? livePricing?.carTypePricing?.[planKey]?.[segment];
    if (liveVal !== undefined && liveVal !== null && !isNaN(Number(liveVal))) {
      return Number(liveVal);
    }
    return PLANS_DATA[planKey]?.pricing?.[segment] || 0;
  };

  const basicPrice = getPlanPrice('basic', carType);
  const premiumPrice = getPlanPrice('premium', carType);
  const selectedPrice = selectedPlanKey === 'premium' ? premiumPrice : basicPrice;
  const selectedPlanName = selectedPlanKey === 'premium' ? 'Premium Care' : 'Basic Care';

  const handleNext = () => {
    onNext({
      ...carData,
      planKey: selectedPlanKey,
      planName: selectedPlanName,
      baseAmount: selectedPrice,
      amount: selectedPrice,
      selectedAddons: []
    });
  };

  return (
    <>
      <div className="plan-hero-container">
        {/* Selected Vehicle Badge (Tap to change) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{carInfo.label}</span>
          </div>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#0072F5',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              padding: '2px 6px'
            }}
          >
            Change Model
          </button>
        </div>

        {/* 1. Basic Care Card */}
        <div
          id="plan-card-basic"
          className={`plan-card-hero basic ${selectedPlanKey === 'basic' ? 'selected' : ''}`}
          onClick={() => setSelectedPlanKey('basic')}
        >
          {/* Header */}
          <div className="plan-hero-header">
            <div className="plan-hero-title-group">
              <div className="plan-hero-icon-box basic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <div>
                <h3 className="plan-hero-title">Basic Care</h3>
                <p className="plan-hero-subtitle">Everyday exterior cleanliness</p>
              </div>
            </div>

            <div className="plan-hero-price-box basic">
              <div className="plan-hero-price">₹{basicPrice.toLocaleString('en-IN')}</div>
              <span className="plan-hero-freq">/month</span>
            </div>
          </div>

          {/* Body: Left Features, Right Car Render */}
          <div className="plan-hero-body">
            <ul className="plan-hero-features">
              {PLANS_DATA.basic.features.map((feat, idx) => (
                <li key={idx} className="plan-hero-feature-item">
                  <span className="plan-hero-check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div className="plan-hero-car-visual basic">
              <div className="plan-hero-aura basic" />
              <span className="plan-hero-sparkle sp1">✦</span>
              <span className="plan-hero-sparkle sp2">✦</span>
              <img
                src="/assets/plan-basic-car.jpg"
                alt="Basic Care Clean White Sedan"
                className="plan-hero-car-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* 2. Premium Care Card */}
        <div
          id="plan-card-premium"
          className={`plan-card-hero premium ${selectedPlanKey === 'premium' ? 'selected' : ''}`}
          onClick={() => setSelectedPlanKey('premium')}
        >
          {/* Blue Header Banner */}
          <div className="plan-hero-header premium">
            <div className="plan-hero-title-group">
              <div className="plan-hero-icon-box premium">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <h3 className="plan-hero-title premium">Premium Care</h3>
                  <span className="plan-hero-popular-badge">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    MOST POPULAR
                  </span>
                </div>
                <p className="plan-hero-subtitle premium">Deep clean. More shine. More care.</p>
              </div>
            </div>

            <div className="plan-hero-price-box premium">
              <div className="plan-hero-price premium">₹{premiumPrice.toLocaleString('en-IN')}</div>
              <span className="plan-hero-freq premium">/month</span>
            </div>
          </div>

          {/* Premium Body */}
          <div className="plan-hero-body premium">
            <div className="plan-hero-plus-header">
              {PLANS_DATA.premium.plusTitle}
            </div>

            <div className="plan-hero-content-row">
              <ul className="plan-hero-features">
                {PLANS_DATA.premium.plusFeatures.map((feat, idx) => (
                  <li key={idx} className="plan-hero-feature-item">
                    <span className="plan-hero-check">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="plan-hero-car-visual premium">
                <img
                  src="/assets/plan-premium-car.jpg"
                  alt="Premium Care Blue SUV Water Splash"
                  className="plan-hero-car-img premium"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Select Your Subscription Divider */}
        <div className="plan-subscription-divider">
          <span className="divider-line" />
          <span className="divider-text">Select Your Subscription</span>
          <span className="divider-line" />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <button
          id="step2-back-btn"
          className="btn btn-secondary"
          onClick={onBack}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back</span>
        </button>
        <button
          id="step2-next-btn"
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
