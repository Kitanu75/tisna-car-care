import React, { useState } from 'react';
import { 
  ArrowLeft, Check, Calendar, Clock, MapPin, 
  QrCode, Copy, Phone, ShieldCheck, ArrowRight, 
  AlertCircle, MessageCircle, ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import appConfig from '../data/appConfig';
import { storage } from '../utils/storage';

export default function Screen7_BookSchedule({ 
  selectedItem, 
  initialCarSegment = 'sedan',
  onBack, 
  onGoHome
}) {
  const payment = appConfig.getPaymentDetails();

  // Pre-fill from Step 1 & 2 (Customer Phone is entered on this final step)
  const [customerName, setCustomerName] = useState(storage.getUser()?.name || 'Customer');
  const [customerPhone, setCustomerPhone] = useState(selectedItem?.customerPhone || storage.getUser()?.phone || '9876543210');
  const [carNumber, setCarNumber] = useState(selectedItem?.carNumber || 'DL 08 AB 1234');
  const [carSegment, setCarSegment] = useState(selectedItem?.carSegment || initialCarSegment || 'sedan');
  const [serviceAddress, setServiceAddress] = useState(storage.getServiceAddress() || 'Sector 76, Noida, Uttar Pradesh');

  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Dynamic live calendar dates
  const today = new Date();
  const formatDateISO = (d) => d.toISOString().split('T')[0];
  const formatDisplayDate = (d) => {
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const [dateType, setDateType] = useState('tomorrow'); // 'today' | 'tomorrow' | 'dayAfter' | 'custom'
  const [customDate, setCustomDate] = useState(formatDateISO(tomorrow));
  const [selectedSlotId, setSelectedSlotId] = useState('morning');

  const getEffectiveDateString = () => {
    if (dateType === 'today') return formatDisplayDate(today);
    if (dateType === 'tomorrow') return formatDisplayDate(tomorrow);
    if (dateType === 'dayAfter') return formatDisplayDate(dayAfter);
    const parsed = new Date(customDate);
    return isNaN(parsed.getTime()) ? formatDisplayDate(tomorrow) : formatDisplayDate(parsed);
  };

  const itemName = selectedItem?.planName || 'Basic Service';
  const itemSubtitle = selectedItem?.durationLabel || (selectedItem?.isDaily ? 'Daily Doorstep Wash' : 'Subscription Plan');
  const totalAmount = selectedItem?.amount || 1499;
  const addonsTotal = selectedItem?.addonsTotal || 0;
  const basePlanAmount = totalAmount - addonsTotal;
  const selectedAddons = selectedItem?.selectedAddons || [];

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(payment.whatsappNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitAndOpenWhatsApp = () => {
    setIsProcessing(true);
    storage.setServiceAddress(serviceAddress);

    const selectedSlot = appConfig.timeSlots.find(s => s.id === selectedSlotId) || appConfig.timeSlots[0];
    const finalDateStr = getEffectiveDateString();

    const serviceDisplay = selectedAddons.length > 0
      ? `${itemName} (+ Add-ons: ${selectedAddons.map(a => a.name).join(', ')})`
      : itemName;

    setTimeout(() => {
      // 1. Create and save permanent booking
      const newBooking = storage.addBooking({
        customerName: customerName.trim() || 'Customer',
        customerPhone: customerPhone.trim(),
        serviceName: serviceDisplay,
        serviceType: selectedItem?.serviceType || 'regular',
        subtitle: itemSubtitle,
        startDate: finalDateStr,
        timeSlot: `${selectedSlot.timeRange} (${selectedSlot.title})`,
        address: serviceAddress.trim(),
        amount: totalAmount,
        carNumber: carNumber.trim(),
        carModel: `${carSegment.toUpperCase()} (${carNumber.trim()})`,
        carSegment: carSegment,
        addons: selectedAddons.map(a => a.name),
        paymentStatus: 'Payment Pending Verification',
        paymentMethod: 'Static UPI QR'
      });

      // 2. Build clean WhatsApp pre-filled message (no emojis)
      const whatsappUrl = appConfig.getWhatsAppShareUrl({
        bookingId: newBooking.id,
        customerName: newBooking.customerName,
        customerPhone: newBooking.customerPhone,
        carNumber: newBooking.carNumber,
        serviceName: serviceDisplay,
        startDate: newBooking.startDate,
        timeSlot: newBooking.timeSlot,
        address: newBooking.address,
        amount: newBooking.amount
      });

      // 3. Open WhatsApp directly
      window.open(whatsappUrl, '_blank');

      setIsProcessing(false);
      setConfirmedBooking(newBooking);

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.35 },
          colors: ['#0F7A44', '#10B981', '#34D399', '#059669', '#FBBF24']
        });
      } catch (e) {}

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  // IF BOOKING IS CONFIRMED, DISPLAY CONFIRMATION VIEW
  if (confirmedBooking) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in py-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#EAF6EF] flex items-center justify-center mx-auto">
          <div className="w-14 h-14 rounded-full bg-[#0F7A44] text-white flex items-center justify-center shadow-lg">
            <Check size={32} strokeWidth={3} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Booking Confirmed!</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Your doorstep slot has been reserved. WhatsApp chat opened automatically.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-left space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between border-b border-gray-100 pb-2.5">
            <span className="text-gray-500">Booking ID:</span>
            <span className="font-mono font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded border">
              {confirmedBooking.id}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2.5">
            <span className="text-gray-500">Service:</span>
            <span className="font-bold text-gray-900 text-right">{confirmedBooking.serviceName}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2.5">
            <span className="text-gray-500">Vehicle:</span>
            <span className="font-bold text-gray-900">{confirmedBooking.carModel}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2.5">
            <span className="text-gray-500">Date & Slot:</span>
            <span className="font-bold text-gray-900">{confirmedBooking.startDate} • {confirmedBooking.timeSlot}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2.5">
            <span className="text-gray-500">Address:</span>
            <span className="font-bold text-gray-900 text-right max-w-[65%] truncate">{confirmedBooking.address}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-gray-700 font-bold">Total Amount:</span>
            <span className="text-lg font-black text-[#0F7A44]">₹ {confirmedBooking.amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Re-open WhatsApp Button */}
        <div className="space-y-2">
          <button
            onClick={() => {
              const url = appConfig.getWhatsAppShareUrl({
                bookingId: confirmedBooking.id,
                customerName: confirmedBooking.customerName,
                customerPhone: confirmedBooking.customerPhone,
                carNumber: confirmedBooking.carNumber,
                serviceName: confirmedBooking.serviceName,
                startDate: confirmedBooking.startDate,
                timeSlot: confirmedBooking.timeSlot,
                address: confirmedBooking.address,
                amount: confirmedBooking.amount
              });
              window.open(url, '_blank');
            }}
            className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold rounded-2xl text-sm sm:text-base shadow-lg transition flex items-center justify-center space-x-2"
          >
            <MessageCircle size={20} className="fill-current" />
            <span>Open WhatsApp Again</span>
            <ExternalLink size={16} />
          </button>
          <p className="text-[11px] text-gray-400">Send your payment screenshot on WhatsApp to verify slot</p>
        </div>

        <button
          onClick={onGoHome}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl text-xs sm:text-sm transition"
        >
          Back to Homepage
        </button>
      </div>
    );
  }

  // STANDARD STEP 3 VIEW: DETAILS, QR CODE & SUBMIT
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      
      {/* 3-Step Progress Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
            title="Back to Step 2"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="text-xs uppercase tracking-wider font-extrabold text-[#0F7A44] block">Step 3 of 3</span>
            <h2 className="text-sm sm:text-base font-black text-gray-900">Final Details & UPI Payment</h2>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-xs font-bold text-gray-400">
          <span className="text-emerald-700 font-bold">1. Car & Plan ✓</span>
          <span>→</span>
          <span className="text-emerald-700 font-bold">2. Other Services ✓</span>
          <span>→</span>
          <span className="text-gray-900 font-extrabold">3. Details & Payment</span>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: CONTACT, CAR & ADDRESS DETAILS */}
        <div className="md:col-span-6 space-y-4">
          
          {/* Order Summary Pill */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-16 h-12 bg-emerald-50 rounded-2xl p-1 flex items-center justify-center border border-emerald-100 flex-shrink-0">
                <img src={appConfig.getCarImage(carSegment)} alt={carSegment} className="max-h-full max-w-full object-contain" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-gray-900 leading-tight">
                  {carNumber} • {carSegment.toUpperCase()}
                </h4>
                <p className="text-[11px] text-gray-500 capitalize">{itemName} ({itemSubtitle})</p>
                {selectedAddons.length > 0 && (
                  <span className="text-[10px] text-[#0F7A44] font-bold block mt-0.5">
                    + Add-ons: {selectedAddons.map(a => a.name).join(', ')}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-[#0F7A44]">
                ₹ {totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Form: Customer Details */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100 space-y-3.5">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Your Details & Address</h4>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Mobile / WhatsApp Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                />
              </div>

              {/* Service Date Selector */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1 flex items-center space-x-1">
                  <Calendar size={13} className="text-[#0F7A44]" />
                  <span>Select Service Date</span>
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setDateType('today')}
                    className={`py-2 px-1 rounded-xl border text-center transition text-xs font-bold ${
                      dateType === 'today'
                        ? 'border-[#0F7A44] bg-[#EAF6EF] text-[#0F7A44] ring-1 ring-[#0F7A44]'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div>Today</div>
                    <div className="text-[10px] text-gray-500 font-normal">{today.getDate()} {today.toLocaleString('en-IN', { month: 'short' })}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDateType('tomorrow')}
                    className={`py-2 px-1 rounded-xl border text-center transition text-xs font-bold ${
                      dateType === 'tomorrow'
                        ? 'border-[#0F7A44] bg-[#EAF6EF] text-[#0F7A44] ring-1 ring-[#0F7A44]'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div>Tomorrow</div>
                    <div className="text-[10px] text-gray-500 font-normal">{tomorrow.getDate()} {tomorrow.toLocaleString('en-IN', { month: 'short' })}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDateType('dayAfter')}
                    className={`py-2 px-1 rounded-xl border text-center transition text-xs font-bold ${
                      dateType === 'dayAfter'
                        ? 'border-[#0F7A44] bg-[#EAF6EF] text-[#0F7A44] ring-1 ring-[#0F7A44]'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div>In 2 Days</div>
                    <div className="text-[10px] text-gray-500 font-normal">{dayAfter.getDate()} {dayAfter.toLocaleString('en-IN', { month: 'short' })}</div>
                  </button>
                </div>

                <input
                  type="date"
                  min={formatDateISO(today)}
                  value={customDate}
                  onChange={(e) => { setCustomDate(e.target.value); setDateType('custom'); }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                />
              </div>

              {/* Time Slot Selector */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1 flex items-center space-x-1">
                  <Clock size={13} className="text-[#0F7A44]" />
                  <span>Preferred Time Slot</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {appConfig.timeSlots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`p-2 rounded-xl border text-left transition ${
                          isSelected
                            ? 'border-[#0F7A44] bg-[#EAF6EF] text-[#0F7A44] ring-1 ring-[#0F7A44] font-bold'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{slot.title}</div>
                        <div className="text-[10px] text-gray-500 truncate">{slot.timeRange}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Doorstep Address Input */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1 flex items-center space-x-1">
                  <MapPin size={13} className="text-[#0F7A44]" />
                  <span>Doorstep Address</span>
                </label>
                <input
                  type="text"
                  value={serviceAddress}
                  onChange={(e) => setServiceAddress(e.target.value)}
                  placeholder="Flat No., Society Name, Sector/City"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                />
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100 space-y-2 text-xs">
            <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Price Breakdown</h4>
            
            <div className="flex justify-between text-gray-600">
              <span>{itemName} ({itemSubtitle})</span>
              <span className="font-bold text-gray-900">₹ {basePlanAmount.toLocaleString('en-IN')}</span>
            </div>

            {selectedAddons.map(addon => (
              <div key={addon.id} className="flex justify-between text-gray-600 pl-2">
                <span>+ {addon.name}</span>
                <span className="font-semibold text-gray-900">₹ {addon.price.toLocaleString('en-IN')}</span>
              </div>
            ))}

            <div className="flex justify-between text-gray-600">
              <span>Platform & Convenience Fee</span>
              <span className="font-bold text-[#0F7A44]">₹ 0 (Free)</span>
            </div>

            <div className="pt-2.5 border-t border-gray-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-gray-900">Total Payable Amount</span>
              <span className="text-xl font-black text-[#0F7A44]">₹ {totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE QR CODE & SUBMIT BUTTON */}
        <div className="md:col-span-6 space-y-4">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-emerald-500/80 text-center">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-left">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0F7A44] flex items-center justify-center">
                  <QrCode size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">UPI QR Code Payment</h4>
                  <p className="text-[10px] text-gray-400">GPay • PhonePe • Paytm • BHIM</p>
                </div>
              </div>
              <span className="bg-[#0F7A44] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Scan to Pay
              </span>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center my-4">
              <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-md">
                <img 
                  src={payment.qrCodeImage || "/assets/client-qr.png"} 
                  alt="Tisna Payment QR Code" 
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl"
                />
                <div className="text-center mt-2">
                  <span className="text-xs font-bold text-gray-700 tracking-wider font-mono">
                    UPI ID: {payment.upiId}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-base font-black text-[#0F7A44]">
                  Pay Exact Amount: ₹ {totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* WhatsApp Verification Number & Copy Button */}
            <div className="bg-[#EAF6EF] rounded-2xl p-3 border border-emerald-200/80 flex items-center justify-between text-left">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#0F7A44] text-white flex items-center justify-center flex-shrink-0">
                  <Phone size={14} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-500 block">WhatsApp Payment Number</span>
                  <span className="text-xs sm:text-sm font-black text-gray-900">
                    {payment.paymentPhone}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyPhone}
                className="py-1.5 px-3 bg-[#0F7A44] hover:bg-[#0c6237] text-white text-xs font-bold rounded-xl transition"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* 2-Step Payment Instructions */}
            <div className="mt-3 bg-amber-50/80 border border-amber-200 rounded-2xl p-3 text-left space-y-1 text-xs text-amber-900">
              <div className="flex items-start space-x-2">
                <AlertCircle size={15} className="text-amber-700 mt-0.5 flex-shrink-0" />
                <div>
                  <p><strong>Step 1:</strong> Scan QR code & pay <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>.</p>
                  <p className="mt-0.5"><strong>Step 2:</strong> Click the button below to submit and send screenshot on WhatsApp ({payment.paymentPhone}).</p>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON TO DIRECT OPEN WHATSAPP */}
            <div className="pt-4">
              <button
                id="submit-booking-whatsapp-btn"
                disabled={isProcessing}
                onClick={handleSubmitAndOpenWhatsApp}
                className="w-full py-4 px-6 bg-[#0F7A44] hover:bg-[#0c6237] active:scale-[0.99] text-white font-extrabold rounded-2xl text-base shadow-lg shadow-emerald-900/20 transition flex items-center justify-center space-x-2.5 disabled:opacity-75"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Submit Booking & Open WhatsApp</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
