import React, { useState } from 'react';
import StepIndicator from '../components/StepIndicator';
import { storage } from '../utils/storage';

export default function Step3_Booking({ bookingData, onBack, onGoHome }) {
  const pricing = storage.getPricing();
  const waNumber = pricing?.payment?.whatsappNumber || '917042062926';
  const upiId = pricing?.payment?.upiId || 'tisnacarcare@upi';

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [society, setSociety] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('morning');
  const [showPayment, setShowPayment] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const amount = bookingData?.amount || 0;
  const planName = bookingData?.planName || 'Basic Plan';
  const durationLabel = bookingData?.durationLabel || 'Daily';
  const carTypeLabel = bookingData?.carTypeLabel || 'Small Hatchback';
  const carImage = bookingData?.carImage || '/assets/hatchback-car.jpg';

  const today = new Date().toISOString().split('T')[0];

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

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
    if (!carNumber.trim()) {
      errs.carNumber = 'Please enter your car registration number';
    }
    if (!startDate) {
      errs.startDate = 'Please select a service start date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePay = () => {
    setAttemptedSubmit(true);
    const isValid = validate();
    if (!isValid) {
      const firstErrorEl = document.querySelector('.form-input.error, .form-error-msg');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setShowPayment(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newBooking = storage.addBooking({
        customerName: name.trim(),
        customerPhone: mobile.trim(),
        society: society.trim(),
        flatNo: flatNo.trim(),
        carNumber: carNumber.trim(),
        carType: bookingData?.carType,
        carTypeLabel,
        carImage,
        planKey: bookingData?.planKey,
        planName,
        durationId: bookingData?.durationId,
        durationLabel,
        amount,
        startDate,
        timeSlot: timeSlot === 'morning' ? 'Morning (7:00 AM - 10:00 AM)' : 'Evening (4:00 PM - 7:00 PM)',
        paymentStatus: 'Payment Pending Verification',
        paymentMethod: 'UPI QR'
      });

      // Auto-open WhatsApp
      const msg = encodeURIComponent(
        `*New Booking - Tisna Car Care*\n\n` +
        `• *Booking ID:* ${newBooking.id}\n` +
        `• *Customer:* ${name.trim()}\n` +
        `• *Phone:* ${mobile.trim()}\n` +
        `• *Vehicle Segment:* ${carTypeLabel}\n` +
        `• *Car Number:* ${carNumber.trim()}\n` +
        `• *Plan:* ${planName} (${durationLabel})\n` +
        `• *Amount:* Rs. ${amount.toLocaleString('en-IN')}\n` +
        `• *Address:* ${society.trim()}${flatNo ? ', Flat ' + flatNo.trim() : ''}\n` +
        `• *Start Date:* ${startDate}\n` +
        `• *Time Slot:* ${timeSlot === 'morning' ? 'Morning (7 AM - 10 AM)' : 'Evening (4 PM - 7 PM)'}\n\n` +
        `_Payment completed via UPI._`
      );
      window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');

      setShowPayment(false);
      setIsProcessing(false);
      setConfirmed(newBooking);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  // THANK YOU / BOOKING CONFIRMED SCREEN (Figma Screen 5)
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
        <p>Thank you for choosing Tisna Car Care.</p>

        <div className="booking-summary-card">
          {carImage && (
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <img
                src={carImage}
                alt={carTypeLabel}
                style={{ height: 64, objectFit: 'contain' }}
              />
            </div>
          )}

          <div className="booking-summary-row">
            <span className="label">Booking ID</span>
            <span className="value" style={{ fontFamily: 'monospace', fontWeight: 800 }}>{confirmed.id}</span>
          </div>
          <div className="booking-summary-row">
            <span className="label">Vehicle Segment</span>
            <span className="value">{carTypeLabel}</span>
          </div>
          <div className="booking-summary-row">
            <span className="label">Car Number</span>
            <span className="value" style={{ fontWeight: 700 }}>{confirmed.carNumber}</span>
          </div>
          <div className="booking-summary-row">
            <span className="label">Plan</span>
            <span className="value">{planName} ({durationLabel})</span>
          </div>
          <div className="booking-summary-row">
            <span className="label">Amount</span>
            <span className="value" style={{ color: 'var(--primary)', fontWeight: 800 }}>
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="booking-summary-row">
            <span className="label">Start Date</span>
            <span className="value">{startDate}</span>
          </div>
        </div>

        <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 20 }}>
          Please share your payment screenshot on WhatsApp to complete verification.
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
        <p>Provide your details and complete payment to confirm.</p>
      </div>

      <div className="step-content">
        {/* Selected Plan Summary Card */}
        <div className="booking-plan-card">
          <div className="booking-plan-card-left">
            <div className="booking-plan-img-wrap">
              <img
                src={carImage}
                alt={carTypeLabel}
                className="booking-plan-car-thumb"
              />
            </div>
            <div className="booking-plan-details">
              <span className="booking-plan-tag">Selected Plan</span>
              <h4>{planName}</h4>
              <p>{carTypeLabel} ({durationLabel})</p>
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

        {/* Form Error Banner if attempted submit */}
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
            <span>Car Registration Number *</span>
          </label>
          <input
            className={`form-input ${errors.carNumber ? 'error' : ''}`}
            type="text"
            placeholder="e.g. DL 10 AB 1234"
            value={carNumber}
            onChange={(e) => {
              setCarNumber(e.target.value.toUpperCase());
              if (errors.carNumber) setErrors(prev => ({ ...prev, carNumber: '' }));
            }}
          />
          {errors.carNumber && <span className="form-error-msg">{errors.carNumber}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Service Start Date *</span>
          </label>
          <input
            className={`form-input ${errors.startDate ? 'error' : ''}`}
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (errors.startDate) setErrors(prev => ({ ...prev, startDate: '' }));
            }}
            min={today}
          />
          {errors.startDate && <span className="form-error-msg">{errors.startDate}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Preferred Time Slot</span>
          </label>
          <div className="slot-grid">
            <div
              className={`slot-card ${timeSlot === 'morning' ? 'selected' : ''}`}
              onClick={() => setTimeSlot('morning')}
            >
              <div className="slot-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" /><path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" /><path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                </svg>
              </div>
              <h4>Morning</h4>
              <p>7:00 AM - 10:00 AM</p>
            </div>

            <div
              className={`slot-card ${timeSlot === 'evening' ? 'selected' : ''}`}
              onClick={() => setTimeSlot('evening')}
            >
              <div className="slot-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              </div>
              <h4>Evening</h4>
              <p>4:00 PM - 7:00 PM</p>
            </div>
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
        <button
          className="btn btn-primary"
          onClick={handlePay}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Pay ₹{amount.toLocaleString('en-IN')}</span>
        </button>
      </div>

      {/* Payment Popup Modal matching Figma Screen 4 */}
      {showPayment && (
        <div className="payment-overlay" onClick={() => !isProcessing && setShowPayment(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal-header">
              <div className="payment-modal-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Complete Payment</span>
              </div>
              <button
                className="payment-modal-close"
                onClick={() => !isProcessing && setShowPayment(false)}
              >
                ✕
              </button>
            </div>

            <div className="payment-amount-box">
              <span className="payment-amount-label">Payable Amount</span>
              <div className="payment-amount">₹{amount.toLocaleString('en-IN')}</div>
              <div className="payment-plan-name">{planName} • {durationLabel}</div>
            </div>

            <div className="qr-container">
              <img src="/assets/client-qr.png" alt="UPI QR Code" />
            </div>

            <div className="upi-id-display">
              <span>Scan QR code with any UPI app</span>
              <div className="upi-pill">
                <code>{upiId}</code>
                <button
                  type="button"
                  className="upi-copy-btn"
                  onClick={handleCopyUpi}
                  title="Copy UPI ID"
                >
                  {copiedUpi ? (
                    <span style={{ color: 'var(--success)' }}>Copied!</span>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="payment-ss-notice">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Please take a screenshot of your payment receipt and send it on WhatsApp for verification.</span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 8 }}
              onClick={handleConfirmPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>I have paid ₹{amount.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
