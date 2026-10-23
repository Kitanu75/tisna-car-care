import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Calendar, Clock, MapPin, X, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import appConfig from '../data/appConfig';
import { storage } from '../utils/storage';

export default function Screen11_MyBookings({ onBack, onBookNewService }) {
  const [tab, setTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const bookings = storage.getBookings();

  const displayedBookings = bookings.filter((b) => {
    if (tab === 'upcoming') {
      return b.status === 'Active' || b.status === 'Scheduled' || b.isUpcoming;
    } else {
      return b.status === 'Completed' || b.status === 'Cancelled' || !b.isUpcoming;
    }
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return (
          <span className="bg-emerald-100 text-[#0F7A44] border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
            Active
          </span>
        );
      case 'scheduled':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
            Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
            Completed
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  const openWhatsAppHelp = (b) => {
    const url = appConfig.getWhatsAppShareUrl({
      bookingId: b.id,
      carNumber: b.carNumber || 'DL 08 AB 1234',
      serviceName: b.serviceName,
      amount: b.amount
    });
    window.open(url, '_blank');
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
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">My Bookings</h2>
          <p className="text-xs sm:text-sm text-gray-500">Track and manage your scheduled doorstep services</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-200/70 p-1.5 rounded-2xl flex items-center max-w-xs">
        <button
          onClick={() => setTab('upcoming')}
          className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            tab === 'upcoming'
              ? 'bg-[#0F7A44] text-white shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Upcoming Bookings
        </button>
        <button
          onClick={() => setTab('past')}
          className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            tab === 'past'
              ? 'bg-[#0F7A44] text-white shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Past History
        </button>
      </div>

      {/* Bookings Responsive Cards */}
      <div className="space-y-4">
        {displayedBookings.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-14 bg-gray-50 rounded-2xl p-1 flex items-center justify-center border border-gray-100">
                  <img
                    src="/assets/honda-city.png"
                    alt="Car"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 leading-tight">
                    {item.serviceName}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    {item.startDate} • {item.timeSlot}
                  </p>
                </div>
              </div>

              <div className="self-start sm:self-center">
                {getStatusBadge(item.status)}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">Total Amount</span>
                <span className="text-base font-black text-gray-900">
                  ₹ {item.amount?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openWhatsAppHelp(item)}
                  className="hidden sm:inline-flex items-center space-x-1.5 py-2 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  <MessageCircle size={14} className="fill-current" />
                  <span>WhatsApp Updates</span>
                </button>

                <button
                  onClick={() => setSelectedBooking(item)}
                  className="inline-flex items-center space-x-1 text-xs sm:text-sm font-bold text-[#0F7A44] hover:text-[#0c6237] py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition"
                >
                  <span>View Details</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {displayedBookings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
            <Calendar size={36} className="mx-auto text-gray-300" />
            <p className="text-base font-bold text-gray-700">No {tab} bookings found</p>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
              Schedule your doorstep car service today with Tisna Car Care
            </p>
            <button
              onClick={onBookNewService}
              className="mt-3 py-2.5 px-6 bg-[#0F7A44] hover:bg-[#0c6237] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition"
            >
              Book a Service
            </button>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden animate-scale-up p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Booking Details</span>
                <h3 className="text-lg font-extrabold text-gray-900">{selectedBooking.serviceName}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Booking ID</span>
                <span className="font-mono font-bold text-gray-900">{selectedBooking.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Status</span>
                <span>{getStatusBadge(selectedBooking.status)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Vehicle</span>
                <span className="font-bold text-gray-900">{selectedBooking.carModel || 'Honda City'} ({selectedBooking.carNumber || 'DL 08 AB 1234'})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Service Date</span>
                <span className="font-bold text-gray-900">{selectedBooking.startDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Time Slot</span>
                <span className="font-bold text-gray-900">{selectedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Address</span>
                <span className="font-medium text-gray-900 text-right max-w-[60%]">{selectedBooking.address}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-black text-[#0F7A44] text-base">₹ {selectedBooking.amount?.toLocaleString('en-IN')}</span>
              </div>

              {/* WhatsApp Verification Button */}
              <button
                onClick={() => openWhatsAppHelp(selectedBooking)}
                className="w-full mt-4 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-sm text-xs sm:text-sm"
              >
                <MessageCircle size={18} className="fill-current" />
                <span>Chat or Send Screenshot on WhatsApp</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
