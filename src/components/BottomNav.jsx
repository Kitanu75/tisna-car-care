import React from 'react';
import { Home, CalendarDays, Sparkles, Bell, User } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange, unreadNotificationsCount = 1 }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, screenId: 'screen-4' },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays, screenId: 'screen-11' },
    { id: 'services', label: 'Services', icon: Sparkles, screenId: 'screen-6' },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount, screenId: 'screen-10' },
    { id: 'profile', label: 'Profile', icon: User, screenId: 'screen-12' },
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 py-2 px-4 flex justify-around items-center z-40 shadow-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`bottom-nav-${item.id}`}
            onClick={() => onTabChange(item.id, item.screenId)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 relative ${
              isActive ? 'text-[#0F7A44]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="relative">
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 1.8} 
                className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
              />
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center border-2 border-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[11px] mt-1 font-medium tracking-tight ${
              isActive ? 'font-bold text-[#0F7A44]' : 'text-gray-500'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
