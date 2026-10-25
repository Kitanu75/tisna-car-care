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
    if (!parkingSlot.trim()) {
      errs.parkingSlot = 'Please enter your parking slot no.';
    }
    if (!flatNo.trim()) {
      errs.flatNo = 'Please enter your flat or house no.';
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
      parkingSlot: parkingSlot.trim(),
      flatNo: flatNo.trim(),
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
      ? selectedAddons.map(a => {
          const detail = a.isPriceOnCall ? 'Price on Call' : `+₹${a.price}`;
          const pickup = a.hasPickupDrop ? ' • Pick up & Drop' : '';
          return `${a.name} (${detail}${pickup})`;
        }).join(', ')
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
      `• *Society / Apartment:* ${society.trim()}\n` +
      `• *Flat / House No.:* ${flatNo.trim()}\n` +
      `• *Parking Slot No.:* ${parkingSlot.trim()}\n\n` +
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
              <span className="value">
                {selectedAddons.map(a => {
                  const detail = a.isPriceOnCall ? 'Price on Call' : `+₹${a.price}`;
                  const pickup = a.hasPickupDrop ? ' • Pick up & Drop' : '';
                  return `${a.name} (${detail}${pickup})`;
                }).join(', ')}
              </span>
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
        <p>Provide details to confirm your doorstep car care.</p>
      </div>

      <div className="step-content">
        {/* Selected Plan Summary Card */}
        <div className="booking-plan-card">
          <div className="booking-plan-card-left">
            <div className="booking-plan-details">
              <span className="booking-plan-tag">Selected Plan</span>
              <h4>{planName} • {carTypeLabel}</h4>
              {selectedAddons.length > 0 && (
                <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 12, marginTop: 4 }}>
                  + Optional add-ons: {selectedAddons.map(a => {
                    const detail = a.isPriceOnCall ? 'Price on Call' : `+₹${a.price}`;
                    const pickup = a.hasPickupDrop ? ' • Pick up & Drop' : '';
                    return `${a.name} (${detail}${pickup})`;
                  }).join(', ')}
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
            <span>Please complete all required fields (*).</span>
          </div>
        )}

        {/* Customer Form */}
        <div className="form-group">
          <label className="form-label" htmlFor="input-name">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Your Name <span className="req-star">*</span></span>
          </label>
          <input
            id="input-name"
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
            <label className="form-label" htmlFor="input-mobile" style={{ margin: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Mobile Number <span className="req-star">*</span></span>
            </label>
            {mobile.length > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: mobile.length === 10 ? 'var(--success)' : 'var(--amber)' }}>
                {mobile.length}/10 digits
              </span>
            )}
          </div>
          <input
            id="input-mobile"
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
          <label className="form-label" htmlFor="input-society">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
              <path d="M9 22v-4h6v4" />
              <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" />
            </svg>
            <span>Society / Apartment Name <span className="req-star">*</span></span>
          </label>
          <input
            id="input-society"
            className={`form-input ${errors.society ? 'error' : ''}`}
            type="text"
            placeholder="e.g. DLF Phase 5, ATS Greens, Gaur City"
            value={society}
            onChange={(e) => {
              setSociety(e.target.value);
              if (errors.society) setErrors(prev => ({ ...prev, society: '' }));
            }}
          />
          {errors.society && <span className="form-error-msg">{errors.society}</span>}
        </div>

        {/* Flat No and Parking Slot side-by-side or stacked cleanly */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="input-flat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              <span>Flat / House No. <span className="req-star">*</span></span>
            </label>
            <input
              id="input-flat"
              className={`form-input ${errors.flatNo ? 'error' : ''}`}
              type="text"
              placeholder="e.g. 402, Tower B"
              value={flatNo}
              onChange={(e) => {
                setFlatNo(e.target.value);
                if (errors.flatNo) setErrors(prev => ({ ...prev, flatNo: '' }));
              }}
            />
            {errors.flatNo && <span className="form-error-msg">{errors.flatNo}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="parking-slot-input">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
              </svg>
              <span>Parking Slot <span className="req-star">*</span></span>
            </label>
            <input
              id="parking-slot-input"
              className={`form-input ${errors.parkingSlot ? 'error' : ''}`}
              type="text"
              placeholder="e.g. B2-45"
              value={parkingSlot}
              onChange={(e) => {
                setParkingSlot(e.target.value.toUpperCase());
                if (errors.parkingSlot) setErrors(prev => ({ ...prev, parkingSlot: '' }));
              }}
            />
            {errors.parkingSlot && <span className="form-error-msg">{errors.parkingSlot}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="input-car-num">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            <span>Car Registration Number <span className="opt-tag">(Optional)</span></span>
          </label>
          <input
            id="input-car-num"
            className="form-input"
            type="text"
            placeholder="e.g. DL 10 AB 1234 (optional)"
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
          className="btn btn-whatsapp-order"
          onClick={handleDirectSubmit}
          disabled={isSubmitting}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span>{isSubmitting ? 'Opening WhatsApp...' : `Confirm & Book on WhatsApp (₹${amount.toLocaleString('en-IN')})`}</span>
        </button>
      </div>
    </>
  );
}
