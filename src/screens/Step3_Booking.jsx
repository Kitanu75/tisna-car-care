import React, { useState } from 'react';
import StepIndicator from '../components/StepIndicator';
import { storage } from '../utils/storage';

export default function Step3_Booking({ bookingData, onBack, onGoHome }) {
  const pricing = storage.getPricing();
  const waNumber = pricing?.payment?.whatsappNumber || '917042062926';

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [society, setSociety] = useState('');
  const [parkingSlot, setParkingSlot] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [confirmed, setConfirmed] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const [errors, setErrors] = useState({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const amount = bookingData?.amount || 0;
  const planName = bookingData?.planName || 'Standard Care';
  const carTypeLabel = bookingData?.carTypeLabel || 'Small Hatchback';
  const selectedAddons = bookingData?.selectedAddons || [];

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = 'Please enter your full name';
    }
    if (!mobile.trim()) {
      errs.mobile = 'Please enter your mobile number';
    } else if (mobile.trim().length !== 10) {
      errs.mobile = `Mobile number must be 10 digits (currently ${mobile.trim().length} digits)`;
    }
    if (!society.trim()) {
      errs.society = 'Please enter your society / apartment name';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDirectSubmit = () => {
    setAttemptedSubmit(true);
    const isValid = validate();
    if (!isValid) {
      const firstErrorEl = document.querySelector('.form-input.error, .form-error-msg');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    // Save directly to Firebase Cloud
    const newBooking = storage.addBooking({
      customerName: name.trim(),
      customerPhone: mobile.trim(),
      society: society.trim(),
      parkingSlot: parkingSlot.trim() || 'Not specified',
      flatNo: flatNo.trim() || 'Not specified',
      carNumber: carNumber.trim() || 'Not provided',
      carType: bookingData?.carType,
      carTypeLabel,
      planKey: bookingData?.planKey,
      planName,
      selectedAddons: selectedAddons.map(a => a.name),
      amount,
      bookingMethod: 'Direct WhatsApp',
      status: 'Booking Received'
    });

    // Format WhatsApp message
    const addonsText = selectedAddons.length > 0 
      ? selectedAddons.map(a => `${a.name} (+₹${a.price})`).join(', ')
      : 'None';

    const msg = encodeURIComponent(
      `*New Booking - Tisna Car*\n\n` +
      `• *Booking ID:* ${newBooking.id}\n` +
      `• *Customer Name:* ${name.trim()}\n` +
      `• *Mobile Number:* ${mobile.trim()}\n` +
      `• *Vehicle Segment:* ${carTypeLabel}\n` +
      `• *Car Registration:* ${carNumber.trim() || 'Not provided'}\n` +
      `• *Selected Plan:* ${planName}\n` +
      `• *Optional Add-ons:* ${addonsText}\n` +
      `• *Total Payable:* Rs. ${amount.toLocaleString('en-IN')}\n` +
      `• *Address:* ${society.trim()}${flatNo ? ', Flat ' + flatNo.trim() : ''}\n` +
      `• *Parking Slot No.:* ${parkingSlot.trim() || 'Not specified'}\n\n` +
      `_Booking request submitted via Tisna Car website._`
    );

    // Direct WhatsApp redirect
    window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');

    setIsSubmitting(false);
    setConfirmed(newBooking);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // THANK YOU / BOOKING CONFIRMED SCREEN (Figma Screen 05 / PDF Page 5)
  if (confirmed) {
    return (
      <div className="thank-you">
        <div className="thank-you-icon">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h2>Booking Confirmed!</h2>
        <p>Thank you for choosing Tisna Car.</p>

        <div className="booking-summary-card">
          <div className="booking-summary-row">
            <span className="label">Booking ID</span>
            <span className="value" style={{ fontFamily: 'monospace', fontWeight: 800 }}>{confirmed.id}</span>
          </div>
          <div className="booking-summary-row">
            <span className="label">Vehicle</span>
            <span className="value">{carTypeLabel}</span>
          </div>
          {confirmed.carNumber && confirmed.carNumber !== 'Not provided' && (
            <div className="booking-summary-row">
              <span className="label">Car Number</span>
              <span className="value">{confirmed.carNumber}</span>
            </div>
          )}
          <div className="booking-summary-row">
            <span className="label">Plan</span>
            <span className="value">{planName}</span>
          </div>
          {selectedAddons.length > 0 && (
            <div className="booking-summary-row">
              <span className="label">Add-ons</span>
              <span className="value">{selectedAddons.map(a => a.name).join(', ')}</span>
            </div>
          )}
          <div className="booking-summary-row">
            <span className="label">Amount</span>
            <span className="value" style={{ color: 'var(--primary)', fontWeight: 800 }}>
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 20 }}>
          Your booking has been forwarded to our team on WhatsApp. We will contact you shortly!
        </p>

        <button className="btn btn-primary" onClick={onGoHome} style={{ width: '100%' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Go to Home</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <StepIndicator currentStep={3} />

      <div className="section-header">
        <h2>Booking Details</h2>
        <p>Provide details to confirm your booking.</p>
      </div>

      <div className="step-content">
        {/* Selected Plan Summary Card (Figma Screen 03 & Screen 10) */}
        <div className="booking-plan-card">
          <div className="booking-plan-card-left">
            <div className="booking-plan-details">
              <span className="booking-plan-tag">Selected Plan</span>
              <h4>{planName} • {carTypeLabel}</h4>
              {selectedAddons.length > 0 && (
                <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 12, marginTop: 4 }}>
                  + Optional add-on: {selectedAddons.map(a => `${a.name} (+₹${a.price})`).join(', ')}
                </p>
              )}
            </div>
          </div>
          <div className="booking-plan-card-right">
            <div className="booking-plan-price">
              ₹{amount.toLocaleString('en-IN')}
            </div>
            <button className="booking-plan-edit-btn" onClick={onBack}>
              Edit
            </button>
          </div>
        </div>

        {/* Validation Error Banner */}
        {attemptedSubmit && Object.keys(errors).length > 0 && (
          <div className="form-validation-banner" style={{ marginBottom: 16 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>Please complete all required fields correctly (Check Mobile Number - 10 digits required).</span>
          </div>
        )}

        {/* Customer Form */}
        <div className="form-group">
          <label className="form-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Your Name *</span>
          </label>
          <input
            className={`form-input ${errors.name ? 'error' : ''}`}
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
          />
          {errors.name && <span className="form-error-msg">{errors.name}</span>}
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label className="form-label" style={{ margin: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Mobile Number *</span>
            </label>
            {mobile.length > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: mobile.length === 10 ? 'var(--success)' : 'var(--amber)' }}>
                {mobile.length}/10 digits
              </span>
            )}
          </div>
          <input
            className={`form-input ${errors.mobile ? 'error' : ''}`}
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={mobile}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
              setMobile(cleaned);
              if (cleaned.length === 10) {
                setErrors(prev => ({ ...prev, mobile: '' }));
              }
            }}
            maxLength={10}
          />
          {errors.mobile && <span className="form-error-msg">{errors.mobile}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
              <path d="M9 22v-4h6v4" />
              <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" />
            </svg>
            <span>Society / Apartment Name *</span>
          </label>
          <input
            className={`form-input ${errors.society ? 'error' : ''}`}
            type="text"
            placeholder="e.g. DLF Phase 5, ATS Greens"
            value={society}
            onChange={(e) => {
              setSociety(e.target.value);
              if (errors.society) setErrors(prev => ({ ...prev, society: '' }));
            }}
          />
          {errors.society && <span className="form-error-msg">{errors.society}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="parking-slot-input">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
            </svg>
            <span>Parking Slot No. (Optional)</span>
          </label>
          <input
            id="parking-slot-input"
            className="form-input"
            type="text"
            placeholder="e.g. B2-45, Basement 1"
            value={parkingSlot}
            onChange={(e) => setParkingSlot(e.target.value.toUpperCase())}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span>Flat / House No. (Optional)</span>
          </label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Flat 402, Tower B"
            value={flatNo}
            onChange={(e) => setFlatNo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            <span>Car Registration Number (Optional)</span>
          </label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. DL 10 AB 1234"
            value={carNumber}
            onChange={(e) => setCarNumber(e.target.value.toUpperCase())}
          />
        </div>
      </div>

      <div className="bottom-bar">
        <button className="btn btn-secondary" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back</span>
        </button>
        <button
          className="btn btn-whatsapp"
          onClick={handleDirectSubmit}
          disabled={isSubmitting}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
          </svg>
          <span>{isSubmitting ? 'Opening WhatsApp...' : `Book via WhatsApp (₹${amount.toLocaleString('en-IN')})`}</span>
        </button>
      </div>
    </>
  );
}
