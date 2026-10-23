import React, { useState } from 'react';
import { 
  Car, Calendar, CreditCard, MapPin, 
  HelpCircle, Settings, LogOut, ChevronRight, 
  X, Check, Edit3, Phone, ShieldCheck 
} from 'lucide-react';
import appConfig from '../data/appConfig';
import { storage } from '../utils/storage';

export default function Screen12_Profile({
  onNavigate,
  onOpenAdminPricing,
  onLogout
}) {
  const [user, setUser] = useState(storage.getUser());
  const [cars] = useState(storage.getCars());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [activeModal, setActiveModal] = useState(null);

  const payment = appConfig.getPaymentDetails();

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: editName,
      phone: editPhone
    };
    storage.setUser(updated);
    setUser(updated);
    setIsEditModalOpen(false);
  };

  const menuItems = [
    {
      id: 'my-cars',
      label: 'My Garage (Registered Vehicles)',
      icon: Car,
      badge: `${cars.length} Vehicle${cars.length > 1 ? 's' : ''}`,
      action: () => onNavigate('screen-3')
    },
    {
      id: 'my-bookings',
      label: 'My Bookings History',
      icon: Calendar,
      action: () => onNavigate('screen-11')
    },
    {
      id: 'admin-pricing',
      label: 'Admin Price Manager (Live Price Updates)',
      icon: Settings,
      badge: 'Admin',
      badgeColor: 'bg-emerald-100 text-[#0F7A44]',
      action: onOpenAdminPricing
    },
    {
      id: 'payment-methods',
      label: 'Payment Methods & UPI Info',
      icon: CreditCard,
      action: () => setActiveModal('payment')
    },
    {
      id: 'service-address',
      label: 'Service Doorstep Address',
      icon: MapPin,
      action: () => setActiveModal('address')
    },
    {
      id: 'help-support',
      label: 'Help & Customer Support',
      icon: HelpCircle,
      action: () => setActiveModal('support')
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Green Header Banner */}
      <div className="bg-[#0F7A44] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5 relative z-10 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-white/20 p-1 border-2 border-white/60 shadow-lg flex-shrink-0 overflow-hidden mx-auto">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
            <p className="text-sm text-emerald-100 font-medium mt-0.5">{user.phone}</p>
            <button
              id="profile-edit-btn"
              onClick={() => setIsEditModalOpen(true)}
              className="mt-2.5 inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition"
            >
              <Edit3 size={13} />
              <span>Edit Profile Details</span>
            </button>
          </div>
        </div>

        <div className="relative z-10 self-center sm:self-auto">
          <button
            onClick={onLogout}
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl flex items-center space-x-2 transition"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Menu Options List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition text-left group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-700 flex items-center justify-center group-hover:bg-[#EAF6EF] group-hover:text-[#0F7A44] transition-colors">
                  <Icon size={19} />
                </div>
                <span className="text-sm font-bold text-gray-800 group-hover:text-gray-900">
                  {item.label}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {item.badge && (
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-base">Edit Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-bold mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#0F7A44] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[#0c6237] mt-3 transition"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Methods Modal */}
      {activeModal === 'payment' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scale-up space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Payment Methods</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs space-y-1">
              <div className="font-bold text-[#0F7A44] text-sm">Static UPI QR Code</div>
              <p className="text-gray-700">UPI ID: <span className="font-bold">{payment.upiId}</span></p>
              <p className="text-gray-700">WhatsApp: <span className="font-bold">{payment.paymentPhone}</span></p>
            </div>
            <p className="text-xs text-gray-500">Scan & pay with GPay, PhonePe, Paytm, or BHIM.</p>
          </div>
        </div>
      )}

      {/* Service Address Modal */}
      {activeModal === 'address' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scale-up space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Doorstep Service Address</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-xs flex items-start space-x-2.5">
              <MapPin size={18} className="text-[#0F7A44] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block mb-0.5">Primary Residence / Apartment</span>
                <span className="text-gray-600 leading-relaxed">{storage.getServiceAddress()}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">Service available across Noida, Greater Noida, and Delhi NCR.</p>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {activeModal === 'support' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scale-up space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Customer Support</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <a
                href={`https://wa.me/${payment.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-full p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center justify-between text-[#0F7A44] font-bold"
              >
                <span>WhatsApp Instant Support</span>
                <Phone size={16} />
              </a>
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-gray-700">
                <span className="font-bold block">Support Hotline</span>
                <span className="font-bold text-sm text-gray-900">{payment.paymentPhone}</span>
                <span className="text-[11px] text-gray-500 block mt-0.5">8:00 AM - 7:00 PM (All 7 Days)</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
