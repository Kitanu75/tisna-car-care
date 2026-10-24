import React, { useState, useEffect } from 'react';
import { storage, DEFAULT_PRICING } from '../utils/storage';
import { fetchBookingsFromCloud, subscribeToBookings } from '../utils/firebase';

export default function AdminPriceModal({ isOpen, onClose }) {
  const [pricing, setPricing] = useState(storage.getPricing());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(sessionStorage.getItem('tisna_admin_unlocked') === 'true');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  const ADMIN_PIN = "2026";
  const carCategories = ['hatchback', 'sedan', 'suv', 'luxury'];

  const loadBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const cloudData = await fetchBookingsFromCloud();
      if (Array.isArray(cloudData) && cloudData.length > 0) {
        setBookings(cloudData);
        setIsLoadingBookings(false);
        return;
      }
    } catch {}
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) { setBookings(data); setIsLoadingBookings(false); return; }
      }
    } catch {}
    setBookings(storage.getBookings());
    setIsLoadingBookings(false);
  };

  useEffect(() => {
    if (isOpen) {
      setPricing(storage.getPricing());
      setSaveSuccess(false);
      setPinError('');
      if (sessionStorage.getItem('tisna_admin_unlocked') === 'true') {
        setIsUnlocked(true);
        loadBookings();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isUnlocked) {
      const unsub = subscribeToBookings((list) => {
        if (Array.isArray(list) && list.length > 0) setBookings(list);
      });
      return () => { if (unsub) unsub(); };
    }
  }, [isOpen, isUnlocked]);

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e?.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsUnlocked(true);
      sessionStorage.setItem('tisna_admin_unlocked', 'true');
      setPinError('');
      loadBookings();
    } else {
      setPinError('Incorrect PIN');
    }
  };

  const handleToggleVerification = async (bookingId, currentStatus) => {
    const newStatus = currentStatus === 'Payment Verified' ? 'Payment Pending Verification' : 'Payment Verified';
    const updated = storage.updateBookingPaymentStatus(bookingId, newStatus);
    setBookings(updated);
  };

  const handleNestedPriceChange = (section, category, subkey, value) => {
    const num = value === '' ? '' : Number(value);
    setPricing(prev => ({
      ...prev,
      [section]: { ...prev[section], [category]: { ...prev[section]?.[category], [subkey]: num } }
    }));
  };

  const handleDiscountChange = (durationKey, percent) => {
    const pct = percent === '' ? '' : (parseFloat(percent) || 0);
    setPricing(prev => ({
      ...prev,
      discounts: { ...prev.discounts, [durationKey]: pct }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    storage.savePricing(pricing);
    setSaveSuccess(true);
    setTimeout(() => { setSaveSuccess(false); onClose(); }, 700);
  };

  const handleReset = () => {
    if (window.confirm("Reset all prices to defaults?")) {
      storage.resetPricing();
      setPricing(DEFAULT_PRICING);
    }
  };

  // PIN Unlock Screen
  if (!isUnlocked) {
    return (
      <div className="admin-overlay" onClick={onClose}>
        <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
          <div className="admin-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#E8F1FD', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0866E8' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#1E293B' }}>Admin Portal</span>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94A3B8' }}>✕</button>
          </div>
          <form onSubmit={handleUnlock} style={{ padding: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>Enter Admin PIN to access</p>
            <input
              type="password"
              className="form-input"
              placeholder="PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{ textAlign: 'center', fontSize: 20, letterSpacing: 8, maxWidth: 180, margin: '0 auto' }}
              autoFocus
              maxLength={6}
            />
            {pinError && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 8 }}>{pinError}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 16 }}>
              Unlock Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#E8F1FD', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0866E8' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1E293B' }}>Admin Price & Booking Manager</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94A3B8' }}>✕</button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
            Bookings ({bookings.length})
          </button>
          <button className={`admin-tab ${activeTab === 'pricing' ? 'active' : ''}`} onClick={() => setActiveTab('pricing')}>
            Pricing Configuration
          </button>
        </div>

        {/* Body */}
        <div className="admin-body">
          {activeTab === 'bookings' && (
            <div>
              {isLoadingBookings ? (
                <p style={{ textAlign: 'center', color: '#94A3B8', padding: 40 }}>Loading bookings...</p>
              ) : bookings.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94A3B8', padding: 40 }}>No bookings recorded yet.</p>
              ) : (
                bookings.map((b) => (
                  <div key={b.id} style={{
                    background: '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 12,
                    border: b.paymentStatus === 'Payment Verified' ? '2px solid #10B981' : '1px solid #E2E8F0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 13, fontFamily: 'monospace', color: '#334155' }}>{b.id}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                        background: b.paymentStatus === 'Payment Verified' ? '#D1FAE5' : '#FEF3C7',
                        color: b.paymentStatus === 'Payment Verified' ? '#065F46' : '#92400E'
                      }}>
                        {b.paymentStatus === 'Payment Verified' ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.8 }}>
                      <div><strong>Customer:</strong> {b.customerName || '-'} • {b.customerPhone || '-'}</div>
                      <div><strong>Vehicle:</strong> {b.carTypeLabel || b.carType || '-'} {b.carModel ? `(${b.carModel})` : ''} • {b.carNumber || '-'}</div>
                      <div><strong>Plan:</strong> {b.planName || '-'} ({b.durationLabel || '-'}) • ₹{(b.amount || 0).toLocaleString('en-IN')}</div>
                      <div><strong>Address:</strong> {b.society || b.address || '-'}{b.flatNo ? `, ${b.flatNo}` : ''}</div>
                      <div><strong>Schedule:</strong> {b.startDate || '-'} • {b.timeSlot || '-'}</div>
                    </div>
                    <button
                      onClick={() => handleToggleVerification(b.id, b.paymentStatus)}
                      style={{
                        marginTop: 10, width: '100%', padding: '8px 0', borderRadius: 8, border: 'none',
                        fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                        background: b.paymentStatus === 'Payment Verified' ? '#FEE2E2' : '#D1FAE5',
                        color: b.paymentStatus === 'Payment Verified' ? '#DC2626' : '#065F46'
                      }}
                    >
                      {b.paymentStatus === 'Payment Verified' ? 'Mark as Unverified' : '✓ Mark as Payment Verified'}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'pricing' && (
            <form onSubmit={handleSave}>
              {/* Basic Daily Rates */}
              <p style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 10 }}>Basic Daily Rates (₹/day)</p>
              {carCategories.map(ct => (
                <div key={ct} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ flex: 1, fontSize: 13, color: '#475569', textTransform: 'capitalize' }}>{ct}</span>
                  <input className="form-input" type="number" style={{ width: 95, padding: '8px 12px', textAlign: 'right' }}
                    value={pricing.carTypePricing?.basic?.[ct] ?? ''} onChange={(e) => handleNestedPriceChange('carTypePricing', 'basic', ct, e.target.value)} />
                </div>
              ))}

              {/* Premium Daily Rates */}
              <p style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 10, marginTop: 20 }}>Premium Daily Rates (₹/day)</p>
              {carCategories.map(ct => (
                <div key={ct} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ flex: 1, fontSize: 13, color: '#475569', textTransform: 'capitalize' }}>{ct}</span>
                  <input className="form-input" type="number" style={{ width: 95, padding: '8px 12px', textAlign: 'right' }}
                    value={pricing.carTypePricing?.premium?.[ct] ?? ''} onChange={(e) => handleNestedPriceChange('carTypePricing', 'premium', ct, e.target.value)} />
                </div>
              ))}

              {/* Discounts */}
              <p style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 10, marginTop: 20 }}>Duration Discounts (%)</p>
              {[{ key: '1m', label: '1 Month' }, { key: '3m', label: '3 Months' }, { key: '6m', label: '6 Months' }].map(d => (
                <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ flex: 1, fontSize: 13, color: '#475569' }}>{d.label}</span>
                  <input className="form-input" type="number" style={{ width: 95, padding: '8px 12px', textAlign: 'right' }}
                    value={pricing.discounts?.[d.key] ?? ''} onChange={(e) => handleDiscountChange(d.key, e.target.value)} />
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>%</span>
                </div>
              ))}

              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={handleReset}>Reset Defaults</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  {saveSuccess ? 'Saved to Cloud ✓' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
