import React, { useState, useEffect } from 'react';
import { 
  X, Check, Save, RotateCcw, Lock, KeyRound, 
  Calendar, Phone, MapPin, Car, MessageCircle, 
  User, Clock, ShieldCheck, Tag 
} from 'lucide-react';
import { storage, DEFAULT_PRICING } from '../utils/storage';

export default function AdminPriceModal({ isOpen, onClose }) {
  const [pricing, setPricing] = useState(storage.getPricing());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(sessionStorage.getItem('tisna_admin_unlocked') === 'true');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'pricing'
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  const ADMIN_PIN = "2026";

  const loadBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setBookings(data);
          try {
            localStorage.setItem('tisna_bookings', JSON.stringify(data));
          } catch {}
          setIsLoadingBookings(false);
          return;
        }
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

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e?.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsUnlocked(true);
      sessionStorage.setItem('tisna_admin_unlocked', 'true');
      setPinError('');
      loadBookings();
    } else {
      setPinError('Incorrect PIN. Please try again.');
    }
  };

  const handleToggleVerification = async (bookingId, currentStatus) => {
    const newStatus = currentStatus === 'Payment Verified' ? 'Payment Pending Verification' : 'Payment Verified';
    
    // 1. Update state immediately in UI
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentStatus: newStatus,
          status: newStatus === 'Payment Verified' ? 'Confirmed' : 'Payment Verification Pending',
          statusColor: newStatus === 'Payment Verified' ? 'emerald' : 'amber'
        };
      }
      return b;
    });
    setBookings(updated);

    // 2. Save in localStorage
    try {
      localStorage.setItem('tisna_bookings', JSON.stringify(updated));
    } catch {}

    // 3. Persist directly to server file so refresh ALWAYS keeps it verified!
    const target = updated.find(b => b.id === bookingId);
    if (target) {
      try {
        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target)
        });
      } catch (err) {
        console.warn('Booking status sync error:', err);
      }
    }
  };

  const handlePriceChange = (section, subkey, value) => {
    const num = value === '' ? '' : Number(value);
    setPricing(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subkey]: num
      }
    }));
  };

  const handleNestedPriceChange = (section, category, subkey, value) => {
    const num = value === '' ? '' : Number(value);
    setPricing(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [category]: {
          ...prev[section][category],
          [subkey]: num
        }
      }
    }));
  };

  const handlePaymentChange = (field, value) => {
    setPricing(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        [field]: value
      }
    }));
  };

  const handleDiscountChange = (durationKey, percent) => {
    const pct = percent === '' ? '' : (parseFloat(percent) || 0);
    setPricing(prev => ({
      ...prev,
      discounts: {
        ...prev.discounts,
        [durationKey]: pct
      }
    }));
  };

  const handlePhoneChange = (val) => {
    const digits = val.replace(/\D/g, '');
    let wa = digits;
    if (digits.length === 10) wa = `91${digits}`;
    else if (digits.length === 12 && digits.startsWith('91')) wa = digits;

    setPricing(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        paymentPhone: val,
        whatsappNumber: wa || prev.payment?.whatsappNumber || '919876543210'
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Normalize phone and whatsapp so Header, Footer, and WhatsApp buttons always match
    const currentWa = (pricing.payment?.whatsappNumber || '').toString();
    const currentPhone = (pricing.payment?.paymentPhone || '').toString();
    const digits = (currentPhone || currentWa).replace(/\D/g, '');
    const cleanWaDigits = (currentWa || currentPhone).replace(/\D/g, '');

    let normalizedPhone = currentPhone;
    if (!normalizedPhone || normalizedPhone === '+91 98765 43210') {
      const pure10 = cleanWaDigits.replace(/^91/, '');
      if (pure10.length === 10) {
        normalizedPhone = `+91 ${pure10.slice(0, 5)} ${pure10.slice(5)}`;
      }
    } else if (!normalizedPhone.startsWith('+') && !normalizedPhone.startsWith('91')) {
      const pure10 = digits.replace(/^91/, '');
      if (pure10.length === 10) {
        normalizedPhone = `+91 ${pure10.slice(0, 5)} ${pure10.slice(5)}`;
      }
    }

    let normalizedWa = cleanWaDigits;
    if (cleanWaDigits.length === 10) {
      normalizedWa = `91${cleanWaDigits}`;
    }

    const updatedPricing = {
      ...pricing,
      payment: {
        ...pricing.payment,
        paymentPhone: normalizedPhone || '+91 98765 43210',
        whatsappNumber: normalizedWa || '919876543210'
      }
    };

    setPricing(updatedPricing);
    storage.savePricing(updatedPricing);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 700);
  };

  const handleReset = () => {
    if (window.confirm("Reset all prices back to initial defaults?")) {
      storage.resetPricing();
      setPricing(DEFAULT_PRICING);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0F7A44] flex items-center justify-center">
              {isUnlocked ? <ShieldCheck size={18} /> : <Lock size={18} />}
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base">Owner Admin Portal</h3>
              <p className="text-xs text-gray-500">Live booking dashboard & price manager</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-gray-800 shadow-xs"
          >
            <X size={18} />
          </button>
        </div>

        {/* PIN Security Check (Only Owner Can Access) */}
        {!isUnlocked ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#0F7A44] flex items-center justify-center mx-auto">
              <KeyRound size={26} />
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-base">Owner Security Verification</h4>
              <p className="text-xs text-gray-500 mt-1">
                Enter your 4-digit secret PIN to access pricing controls
              </p>
            </div>

            <form onSubmit={handleUnlock} className="max-w-xs mx-auto space-y-3">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                autoFocus
                className="w-full text-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-base font-mono font-bold tracking-widest text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
              />

              {pinError && (
                <p className="text-xs text-red-500 font-bold">{pinError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#0F7A44] hover:bg-[#0c6237] text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Verify & Open Editor
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Portal Content */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Navigation Tabs */}
            <div className="flex items-center border-b border-gray-200 px-6 pt-3 bg-white space-x-2">
              <button
                onClick={() => {
                  setActiveTab('bookings');
                  loadBookings();
                }}
                className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition ${
                  activeTab === 'bookings'
                    ? 'border-[#0F7A44] text-[#0F7A44]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Calendar size={14} />
                <span>Customer Bookings ({bookings.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('pricing')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition ${
                  activeTab === 'pricing'
                    ? 'border-[#0F7A44] text-[#0F7A44]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Tag size={14} />
                <span>Edit Service Prices</span>
              </button>
            </div>

            {/* TAB 1: CUSTOMER BOOKINGS LIST */}
            {activeTab === 'bookings' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900">Incoming Orders & Bookings</h4>
                    <p className="text-gray-500 text-[11px]">All customer bookings received via website and WhatsApp</p>
                  </div>
                  <button
                    onClick={loadBookings}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-[11px]"
                  >
                    Refresh
                  </button>
                </div>

                {isLoadingBookings ? (
                  <div className="py-12 text-center text-gray-400">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0F7A44] flex items-center justify-center mx-auto">
                      <Check size={24} />
                    </div>
                    <div className="font-bold text-gray-800 text-sm">No Bookings Yet</div>
                    <p className="text-gray-500 text-xs max-w-sm mx-auto">
                      Whenever a customer submits a booking, their details (Name, Phone, Car Number, Date, Time, and Address) will immediately appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {bookings.map((b, idx) => (
                      <div key={b.id || idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-2.5 hover:border-emerald-300 transition">
                        
                        {/* Top row: Customer Name & Amount */}
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-black text-sm text-gray-900 block flex items-center gap-1.5">
                              <User size={14} className="text-[#0F7A44]" />
                              {b.customerName || 'Customer'}
                            </span>
                            <span className="text-[11px] text-gray-500 font-medium">
                              ID: <strong className="text-gray-800">{b.id}</strong> • {new Date(b.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-black text-[#0F7A44] block">
                              ₹ {(b.amount || 0).toLocaleString('en-IN')}
                            </span>
                            {b.paymentStatus === 'Payment Verified' ? (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0F7A44] inline-flex items-center gap-1">
                                <Check size={11} strokeWidth={3} />
                                <span>Payment Verified</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                {b.paymentStatus || 'Verification Pending'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-600 pt-1 border-t border-gray-200/60">
                          <div className="flex items-center space-x-1.5">
                            <Car size={13} className="text-gray-400" />
                            <span>Vehicle: <strong className="text-gray-900">{b.carModel || b.carNumber || 'N/A'}</strong></span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Clock size={13} className="text-gray-400" />
                            <span>Slot: <strong className="text-gray-900">{b.startDate} ({b.timeSlot})</strong></span>
                          </div>
                          <div className="flex items-center space-x-1.5 sm:col-span-2">
                            <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">Address: <strong className="text-gray-900">{b.address || 'Doorstep'}</strong></span>
                          </div>
                        </div>

                        {/* Action buttons (Verify Payment, Call, WhatsApp) */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                          <div>
                            <button
                              onClick={() => handleToggleVerification(b.id, b.paymentStatus)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 transition shadow-xs ${
                                b.paymentStatus === 'Payment Verified'
                                  ? 'bg-emerald-50 text-[#0F7A44] border border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-[#0F7A44] hover:bg-[#0c6237] text-white active:scale-95'
                              }`}
                              title={b.paymentStatus === 'Payment Verified' ? 'Click to revert to pending' : 'Click to mark verified once payment screenshot is checked'}
                            >
                              <Check size={13} strokeWidth={2.5} />
                              <span>{b.paymentStatus === 'Payment Verified' ? 'Payment Verified' : 'Verify Payment'}</span>
                            </button>
                          </div>

                          <div className="flex items-center space-x-2">
                            {b.customerPhone && (
                              <>
                                <a
                                  href={`tel:${b.customerPhone}`}
                                  className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl font-bold text-gray-700 flex items-center space-x-1"
                                >
                                  <Phone size={12} />
                                  <span>Call</span>
                                </a>
                                <a
                                  href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${b.customerName || 'Customer'}, this is Tisna Car Care regarding your booking (${b.id}).`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-xl font-bold text-[#0F7A44] flex items-center space-x-1"
                                >
                                  <MessageCircle size={12} />
                                  <span>WhatsApp</span>
                                </a>
                              </>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PRICING EDITOR FORM */}
            {activeTab === 'pricing' && (
              <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-5 flex-1 text-xs">
                
                {/* Live Indicator */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-[#0F7A44] font-bold">
                  <span>Owner Mode Active — You can update any price live</span>
                  <span className="text-[10px] bg-[#0F7A44] text-white px-2 py-0.5 rounded-full">Unlocked</span>
                </div>

                {/* Section 1: Basic Service Daily Rates */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                  <h4 className="font-bold text-gray-900 text-xs">Basic Service (Daily Rates by Car Segment)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Small Car / Hatchback (₹)</label>
                      <input
                        type="number"
                        value={pricing.carTypePricing?.basic?.hatchback ?? 500}
                        onChange={(e) => handleNestedPriceChange('carTypePricing', 'basic', 'hatchback', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Sedan (₹)</label>
                      <input
                        type="number"
                        value={pricing.carTypePricing?.basic?.sedan ?? 600}
                        onChange={(e) => handleNestedPriceChange('carTypePricing', 'basic', 'sedan', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">SUV (₹)</label>
                      <input
                        type="number"
                        value={pricing.carTypePricing?.basic?.suv ?? 700}
                        onChange={(e) => handleNestedPriceChange('carTypePricing', 'basic', 'suv', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Luxury (₹)</label>
                      <input
                        type="number"
                        value={pricing.carTypePricing?.basic?.luxury ?? 850}
                        onChange={(e) => handleNestedPriceChange('carTypePricing', 'basic', 'luxury', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Premium Service Daily Rates */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                  <h4 className="font-bold text-gray-900 text-xs">Premium Service (Daily Rates by Car Segment)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Small Car / Hatchback (₹)</label>
                      <input
                        type="number"
                        value={pricing.carTypePricing?.premium?.hatchback ?? 800}
                        onChange={(e) => handleNestedPriceChange('carTypePricing', 'premium', 'hatchback', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Sedan (₹)</label>
                      <input
                        type="number"
                        value={pricing.carTypePricing?.premium?.sedan ?? 1100}
                        onChange={(e) => handleNestedPriceChange('carTypePricing', 'premium', 'sedan', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">SUV (₹)</label>
                      <input
                        type="number"
                        value={pricing.carTypePricing?.premium?.suv ?? 1300}
                        onChange={(e) => handleNestedPriceChange('carTypePricing', 'premium', 'suv', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Luxury (₹)</label>
                      <input
                        type="number"
                        value={pricing.carTypePricing?.premium?.luxury ?? 1600}
                        onChange={(e) => handleNestedPriceChange('carTypePricing', 'premium', 'luxury', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: One-Time Add-on Services */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                  <h4 className="font-bold text-gray-900 text-xs">One-Time Add-On Services (₹)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Jet Spray Wash (₹)</label>
                      <input
                        type="number"
                        value={pricing.otherServices?.['jet-spray'] ?? 500}
                        onChange={(e) => handlePriceChange('otherServices', 'jet-spray', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Interior Dry Clean (₹)</label>
                      <input
                        type="number"
                        value={pricing.otherServices?.['dry-clean'] ?? 1200}
                        onChange={(e) => handlePriceChange('otherServices', 'dry-clean', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Car Polishing (₹)</label>
                      <input
                        type="number"
                        value={pricing.otherServices?.['polishing'] ?? 400}
                        onChange={(e) => handlePriceChange('otherServices', 'polishing', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Glass Cleaning (₹)</label>
                      <input
                        type="number"
                        value={pricing.otherServices?.['glass-cleaning'] ?? 300}
                        onChange={(e) => handlePriceChange('otherServices', 'glass-cleaning', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[11px] text-gray-600 block mb-1">Engine Bay Clean (₹)</label>
                      <input
                        type="number"
                        value={pricing.otherServices?.['engine-bay-clean'] ?? 500}
                        onChange={(e) => handlePriceChange('otherServices', 'engine-bay-clean', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Duration Discounts & Live Calculated Rates */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 text-xs">Duration Discounts (% छूट) & Dynamic Prices</h4>
                    <span className="text-[10px] text-[#0F7A44] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      100% Calculated From Daily Price
                    </span>
                  </div>

                  {/* Discount Percentage Setters */}
                  <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/80 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-950 block">Set Duration Discount Percentages (% छूट):</span>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] text-gray-600 block mb-1">1 Month Discount (% off)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={pricing.discounts?.['1m'] ?? 0}
                            onChange={(e) => handleDiscountChange('1m', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-xl font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                          />
                          <span className="absolute right-2.5 top-1.5 text-xs font-bold text-emerald-700">%</span>
                        </div>
                        <span className="text-[9px] text-gray-400">30 days wash</span>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-600 block mb-1">3 Months Discount (% off)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={pricing.discounts?.['3m'] ?? 7}
                            onChange={(e) => handleDiscountChange('3m', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-xl font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                          />
                          <span className="absolute right-2.5 top-1.5 text-xs font-bold text-emerald-700">%</span>
                        </div>
                        <span className="text-[9px] text-gray-400">90 days wash</span>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-600 block mb-1">6 Months Discount (% off)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={pricing.discounts?.['6m'] ?? 11}
                            onChange={(e) => handleDiscountChange('6m', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-xl font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                          />
                          <span className="absolute right-2.5 top-1.5 text-xs font-bold text-emerald-700">%</span>
                        </div>
                        <span className="text-[9px] text-gray-400">180 days wash</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-emerald-800">
                      Formula: <strong>Daily Rate × Days × (1 - Discount%)</strong>. Monthly, 3-Month, and 6-Month prices are calculated live from the daily rates above!
                    </p>
                  </div>

                  {/* Live Calculated Price Breakdown Table */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-gray-800 block">Live Price Calculations by Car Segment:</span>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                      <table className="w-full text-[11px] text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-[10px] uppercase font-bold">
                          <tr>
                            <th className="px-3 py-2">Car Segment</th>
                            <th className="px-3 py-2">Plan</th>
                            <th className="px-3 py-2">Daily (1d)</th>
                            <th className="px-3 py-2">1 Month (30d)</th>
                            <th className="px-3 py-2">3 Months (90d)</th>
                            <th className="px-3 py-2">6 Months (180d)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { id: 'hatchback', label: 'Hatchback / Small' },
                            { id: 'sedan', label: 'Sedan' },
                            { id: 'suv', label: 'SUV' },
                            { id: 'luxury', label: 'Luxury' }
                          ].map(car => {
                            const bDaily = Number(pricing.carTypePricing?.basic?.[car.id] ?? 600);
                            const b1m = storage.calculatePlanPrice('basic', '1m', car.id, pricing);
                            const b3m = storage.calculatePlanPrice('basic', '3m', car.id, pricing);
                            const b6m = storage.calculatePlanPrice('basic', '6m', car.id, pricing);

                            const pDaily = Number(pricing.carTypePricing?.premium?.[car.id] ?? 1100);
                            const p1m = storage.calculatePlanPrice('premium', '1m', car.id, pricing);
                            const p3m = storage.calculatePlanPrice('premium', '3m', car.id, pricing);
                            const p6m = storage.calculatePlanPrice('premium', '6m', car.id, pricing);

                            return (
                              <React.Fragment key={car.id}>
                                <tr className="hover:bg-emerald-50/40">
                                  <td className="px-3 py-1.5 font-bold text-gray-900 border-r border-gray-100" rowSpan={2}>{car.label}</td>
                                  <td className="px-3 py-1.5 font-semibold text-[#0F7A44]">Basic</td>
                                  <td className="px-3 py-1.5 font-bold">₹{bDaily}</td>
                                  <td className="px-3 py-1.5 font-bold text-gray-900">₹{b1m.toLocaleString('en-IN')}</td>
                                  <td className="px-3 py-1.5 font-bold text-emerald-700">₹{b3m.toLocaleString('en-IN')}</td>
                                  <td className="px-3 py-1.5 font-bold text-emerald-800">₹{b6m.toLocaleString('en-IN')}</td>
                                </tr>
                                <tr className="hover:bg-amber-50/40 bg-gray-50/30">
                                  <td className="px-3 py-1.5 font-semibold text-amber-700">Premium</td>
                                  <td className="px-3 py-1.5 font-bold">₹{pDaily}</td>
                                  <td className="px-3 py-1.5 font-bold text-gray-900">₹{p1m.toLocaleString('en-IN')}</td>
                                  <td className="px-3 py-1.5 font-bold text-amber-700">₹{p3m.toLocaleString('en-IN')}</td>
                                  <td className="px-3 py-1.5 font-bold text-amber-800">₹{p6m.toLocaleString('en-IN')}</td>
                                </tr>
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Section 5: Client WhatsApp & UPI */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                  <h4 className="font-bold text-gray-900 text-xs">Contact, Header Phone & WhatsApp Details</h4>
                  
                  <div>
                    <label className="text-[11px] text-gray-600 block mb-1">
                      Header / Support Phone Number (e.g. +91 70420 62926)
                    </label>
                    <input
                      type="text"
                      value={pricing.payment?.paymentPhone || ''}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="+91 70420 62926"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900"
                    />
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      This number is displayed at the top header for calls.
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-600 block mb-1">
                      WhatsApp Number (for wa.me links, e.g. 917042062926)
                    </label>
                    <input
                      type="text"
                      value={pricing.payment?.whatsappNumber || ''}
                      onChange={(e) => handlePaymentChange('whatsappNumber', e.target.value)}
                      placeholder="917042062926"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900"
                    />
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      Customer booking notifications and screenshots will be sent here.
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-600 block mb-1">UPI ID (e.g. tisnacarcare@upi)</label>
                    <input
                      type="text"
                      value={pricing.payment?.upiId || 'tisnacarcare@upi'}
                      onChange={(e) => handlePaymentChange('upiId', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#0F7A44] hover:bg-[#0c6237] active:scale-[0.99] text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition flex items-center justify-center space-x-2"
                  >
                    {saveSuccess ? (
                      <>
                        <Check size={18} />
                        <span>Prices Saved & Live on Website!</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save & Update All Prices Live</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full py-2 bg-white hover:bg-gray-100 text-gray-600 font-semibold rounded-xl text-xs border border-gray-200 transition flex items-center justify-center space-x-1.5"
                  >
                    <RotateCcw size={14} />
                    <span>Reset to Default Prices</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
