import React, { useState } from 'react';
import { ArrowLeft, CreditCard, ShieldAlert, FileWarning, Info, Check, Bell } from 'lucide-react';
import { storage } from '../utils/storage';

export default function Screen10_Notifications({ onBack }) {
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState(storage.getNotifications());

  const categories = ['All', 'FASTag', 'Insurance', 'Challan'];

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'All') return true;
    return notif.category?.toLowerCase() === filter.toLowerCase();
  });

  const getIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'fastag':
        return <CreditCard size={18} className="text-orange-600" />;
      case 'insurance':
        return <ShieldAlert size={18} className="text-blue-600" />;
      case 'challan':
        return <FileWarning size={18} className="text-red-600" />;
      default:
        return <Bell size={18} className="text-emerald-600" />;
    }
  };

  const getBgColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'fastag':
        return 'bg-orange-50';
      case 'insurance':
        return 'bg-blue-50';
      case 'challan':
        return 'bg-red-50';
      default:
        return 'bg-emerald-50';
    }
  };

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] pb-6 animate-fade-in">
      {/* Top Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition active:scale-95"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
        </div>
        <button
          onClick={markAllRead}
          className="text-xs font-semibold text-[#0F7A44] hover:underline"
        >
          Mark all read
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isSelected = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`py-1.5 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#0F7A44] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-2xl p-4 shadow-card border transition-all flex items-start space-x-3.5 ${
                notif.isRead ? 'border-gray-100 opacity-90' : 'border-gray-200 ring-1 ring-emerald-50'
              }`}
            >
              {/* Category Icon Badge */}
              <div className={`w-10 h-10 rounded-xl ${getBgColor(notif.category)} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                {getIcon(notif.category)}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900">{notif.title}</h4>
                  <span className="text-[10px] text-gray-400 font-medium">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
              <Bell size={28} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs font-semibold text-gray-500">No alerts in this category</p>
            </div>
          )}
        </div>

        {/* Info Banner at Bottom (From UI Mockup) */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 flex items-center space-x-3 text-left">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Info size={16} />
          </div>
          <p className="text-xs text-blue-900 font-medium">
            Recharge and payment options will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}
