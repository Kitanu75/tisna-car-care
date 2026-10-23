import React, { useEffect } from 'react';
import { Check, Calendar, Clock, MapPin, CreditCard, Hash, MessageCircle, ExternalLink, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import appConfig from '../data/appConfig';

export default function Screen9_BookingConfirmed({ 
  booking, 
  onBookNewService, 
  onGoHome 
}) {
  const payment = appConfig.getPaymentDetails();
  const bookingId = booking?.id || 'TCC12345678';
  const serviceName = booking?.serviceName || 'Basic Service (Monthly)';
  const startDate = booking?.startDate || 'Tomorrow';
  const timeSlot = booking?.timeSlot || '8:00 AM - 11:00 AM (Morning)';
  const address = booking?.address || 'Sector 76, Noida';
  const amount = booking?.amount || 1499;
  const carNumber = booking?.carNumber || 'DL 08 AB 1234';

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.35 },
        colors: ['#0F7A44', '#10B981', '#34D399', '#059669', '#FBBF24']
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  }, []);

  const handleSendWhatsAppScreenshot = () => {
    const url = appConfig.getWhatsAppShareUrl({
      bookingId,
      customerName: booking?.customerName,
      customerPhone: booking?.customerPhone,
      carNumber: booking?.carNumber || carNumber,
      serviceName,
      startDate,
      timeSlot,
      address,
      amount
    });
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in py-6 sm:py-10 text-center">
      
      {/* Celebration Check */}
      <div className="relative inline-block my-2">
        <div className="w-24 h-24 rounded-full bg-[#EAF6EF] flex items-center justify-center animate-pulse-subtle mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#0F7A44] text-white flex items-center justify-center shadow-lg shadow-emerald-800/30">
            <Check size={36} strokeWidth={3} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Booking Confirmed!</h2>
        <p className="text-sm sm:text-base text-gray-500 mt-1 max-w-md mx-auto">
          Your car care service has been successfully scheduled.
        </p>
      </div>

      {/* Summary Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100 text-left space-y-3.5 text-xs sm:text-sm">
        
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-gray-500 flex items-center gap-2">
            <Calendar size={16} className="text-[#0F7A44]" />
            Service
          </span>
          <span className="font-bold text-gray-900 text-right">{serviceName}</span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-gray-500 flex items-center gap-2">
            <Calendar size={16} className="text-[#0F7A44]" />
            Start Date
          </span>
          <span className="font-bold text-gray-900">{startDate}</span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-gray-500 flex items-center gap-2">
            <Clock size={16} className="text-[#0F7A44]" />
            Time Slot
          </span>
          <span className="font-bold text-gray-900">{timeSlot}</span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-gray-500 flex items-center gap-2">
            <MapPin size={16} className="text-[#0F7A44]" />
            Address
          </span>
          <span className="font-bold text-gray-900 text-right max-w-[65%] truncate">{address}</span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-gray-500 flex items-center gap-2">
            <CreditCard size={16} className="text-[#0F7A44]" />
            Total Amount
          </span>
          <span className="font-black text-[#0F7A44] text-base">
            ₹ {amount.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-gray-500 flex items-center gap-2">
            <Hash size={16} className="text-[#0F7A44]" />
            Booking ID
          </span>
          <span className="font-mono font-bold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
            {bookingId}
          </span>
        </div>

      </div>

      {/* Prominent WhatsApp Screenshot Share in Professional English */}
      <div className="space-y-2">
        <button
          id="whatsapp-share-btn"
          onClick={handleSendWhatsAppScreenshot}
          className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-extrabold rounded-2xl text-base shadow-lg shadow-green-700/20 transition flex items-center justify-center space-x-2.5"
        >
          <MessageCircle size={22} className="fill-current" />
          <span>Open WhatsApp Again</span>
          <ExternalLink size={16} className="opacity-80" />
        </button>
        <p className="text-xs text-gray-500">
          WhatsApp opened automatically. Click above anytime to re-open WhatsApp and send your payment screenshot.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-3">
        <button
          onClick={onBookNewService || onGoHome}
          className="py-3 px-5 bg-[#0F7A44] hover:bg-[#0c6237] text-white font-bold rounded-2xl text-xs sm:text-sm shadow-sm transition"
        >
          Book Another Service
        </button>

        <button
          onClick={onGoHome}
          className="py-3 px-5 bg-white hover:bg-gray-50 text-[#0F7A44] font-bold rounded-2xl text-xs sm:text-sm border border-[#0F7A44] transition"
        >
          Back to Home
        </button>
      </div>

    </div>
  );
}
