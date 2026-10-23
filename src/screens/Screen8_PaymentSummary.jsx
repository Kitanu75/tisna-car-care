import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, QrCode, Phone, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import appConfig from '../data/appConfig';
import { storage } from '../utils/storage';

export default function Screen8_PaymentSummary({ 
  bookingData, 
  onBack, 
  onConfirmBooking 
}) {
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const payment = appConfig.getPaymentDetails();
  const amount = bookingData?.amount || 1499;
  const platformFee = payment.platformFee;
  const totalAmount = amount + platformFee;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(payment.whatsappNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Service display string with add-ons
      const serviceDisplay = bookingData?.selectedAddons && bookingData.selectedAddons.length > 0
        ? `${bookingData?.serviceName || 'Regular Service'} (+ Add-ons: ${bookingData.selectedAddons.map(a => a.name).join(', ')})`
        : (bookingData?.serviceName || 'Basic Service (Monthly)');

      // Create confirmed booking
      const newBooking = storage.addBooking({
        customerName: bookingData?.customerName || 'Customer',
        customerPhone: bookingData?.customerPhone || '',
        serviceName: serviceDisplay,
        serviceType: bookingData?.serviceType || 'Regular Subscription',
        subtitle: bookingData?.serviceSubtitle || 'Doorstep Cleaning',
        startDate: bookingData?.startDate || 'Tomorrow',
        timeSlot: bookingData?.timeSlot || '8:00 AM - 11:00 AM (Morning)',
        address: bookingData?.serviceAddress || '',
        amount: totalAmount,
        carNumber: bookingData?.carNumber || '',
        carModel: bookingData?.carModel || '',
        carSegment: bookingData?.carSegment || 'sedan',
        addons: bookingData?.selectedAddons?.map(a => a.name) || [],
        paymentStatus: 'Payment Pending Verification',
        paymentMethod: 'Static UPI QR'
      });

      // Direct WhatsApp redirect with clean pre-filled details (NO emojis)
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

      // Direct redirect to WhatsApp
      window.open(whatsappUrl, '_blank');

      setIsProcessing(false);
      onConfirmBooking(newBooking);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      
      {/* Top Header */}
      <div className="flex items-center space-x-3 pb-2 border-b border-gray-200">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 bg-white hover:bg-gray-100 transition shadow-xs"
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Payment Summary</h2>
          <p className="text-xs sm:text-sm text-gray-500">Scan QR code to pay and confirm your booking</p>
        </div>
      </div>

      {/* 2-Column Responsive Layout on Desktop/Laptop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Order & Address Details */}
        <div className="md:col-span-6 space-y-4">
          
          {/* Selected Service Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-14 bg-gray-50 rounded-2xl p-1 flex items-center justify-center border border-gray-100 flex-shrink-0">
                <img 
                  src={appConfig.getCarImage(bookingData?.carSegment)} 
                  alt="Car" 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 leading-tight">
                  {bookingData?.serviceName || 'Basic Service'}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {bookingData?.serviceSubtitle || 'Doorstep Service'}
                </p>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  Vehicle: {bookingData?.carModel} ({bookingData?.carNumber})
                </span>
                {bookingData?.selectedAddons && bookingData.selectedAddons.length > 0 && (
                  <span className="text-[10px] text-[#0F7A44] font-bold block mt-1">
                    + Add-ons: {bookingData.selectedAddons.map(a => a.name).join(', ')}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-[#0F7A44]">
                ₹ {amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Schedule & Address Details */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">
              Appointment Schedule
            </h4>
            <div className="flex justify-between items-start">
              <span className="text-gray-500 font-medium">Service Date:</span>
              <span className="text-gray-900 font-bold">{bookingData?.startDate || 'Tomorrow'}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-500 font-medium">Preferred Time Slot:</span>
              <span className="text-gray-900 font-bold">{bookingData?.timeSlot || '8:00 AM - 11:00 AM (Morning)'}</span>
            </div>
            <div className="flex justify-between items-start pt-2 border-t border-gray-100">
              <span className="text-gray-500 font-medium">Doorstep Address:</span>
              <span className="text-gray-900 font-semibold text-right max-w-[65%]">
                {bookingData?.serviceAddress || 'Sector 76, Noida, Uttar Pradesh'}
              </span>
            </div>
          </div>

          {/* Amount Details Breakdown */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-2.5">
            <h4 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">
              Price Breakdown
            </h4>
            
            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
              <span>{bookingData?.serviceName || 'Base Plan'}</span>
              <span className="font-bold text-gray-900">
                ₹ {((bookingData?.amount || 1499) - (bookingData?.addonsTotal || 0)).toLocaleString('en-IN')}
              </span>
            </div>

            {bookingData?.selectedAddons && bookingData.selectedAddons.length > 0 && (
              <div className="space-y-1 py-1 border-t border-dashed border-gray-200">
                {bookingData.selectedAddons.map((addon) => (
                  <div key={addon.id} className="flex justify-between text-xs text-gray-600 pl-2">
                    <span>+ {addon.name}</span>
                    <span className="font-semibold text-gray-800">₹ {addon.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
              <span>Platform & Convenience Fee</span>
              <span className="font-bold text-[#0F7A44]">
                {platformFee === 0 ? '₹ 0 (Free)' : `₹ ${platformFee}`}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
              <span className="text-base font-bold text-gray-900">Total Payable Amount</span>
              <span className="text-2xl font-black text-[#0F7A44]">
                ₹ {totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Custom Static QR Payment Box in Professional English */}
        <div className="md:col-span-6 space-y-4">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-emerald-500/80 relative">
            
            {/* Header Tag */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0F7A44] flex items-center justify-center">
                  <QrCode size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">UPI QR Code Payment</h4>
                  <p className="text-[11px] text-gray-400">Google Pay • PhonePe • Paytm • BHIM</p>
                </div>
              </div>
              <span className="bg-[#0F7A44] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Instant Scan
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

              <div className="mt-3 text-center">
                <span className="text-sm font-black text-[#0F7A44]">
                  Pay Exact Amount: ₹ {totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* WhatsApp Number & Copy Button */}
            <div className="bg-[#EAF6EF] rounded-2xl p-3.5 border border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-[#0F7A44] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">WhatsApp Payment Verification</span>
                  <span className="text-sm font-black text-gray-900 tracking-wide">
                    {payment.paymentPhone}
                  </span>
                </div>
              </div>

              <button
                id="copy-whatsapp-btn"
                onClick={handleCopyPhone}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-xs ${
                  copied 
                    ? 'bg-emerald-700 text-white' 
                    : 'bg-[#0F7A44] hover:bg-[#0c6237] text-white active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Number</span>
                  </>
                )}
              </button>
            </div>

            {/* Clear 2-Step Instructions in Professional English */}
            <div className="mt-4 bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 text-left space-y-1.5">
              <div className="flex items-start space-x-2">
                <AlertCircle size={16} className="text-amber-700 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-900 font-medium leading-relaxed">
                  <p className="font-bold text-amber-950 mb-1">Payment Instructions:</p>
                  <p><strong>Step 1:</strong> Scan this QR code using any UPI application (GPay, PhonePe, Paytm, or BHIM) and pay the exact amount of <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>.</p>
                  <p className="mt-1"><strong>Step 2:</strong> Take a screenshot of your successful transaction and send it to our WhatsApp number ({payment.paymentPhone}) to verify and confirm your service slot.</p>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <div className="pt-5">
              <button
                id="payment-confirm-btn"
                disabled={isProcessing}
                onClick={handleConfirm}
                className="w-full py-4 px-6 bg-[#0F7A44] hover:bg-[#0c6237] active:scale-[0.99] text-white font-extrabold rounded-2xl text-base shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center space-x-2 tracking-wide disabled:opacity-75"
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
