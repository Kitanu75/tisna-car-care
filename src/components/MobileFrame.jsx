import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export default function MobileFrame({ children, showStatusBar = true, darkStatus = false }) {
  // Current time in 12-hour format e.g. 9:41
  const currentTime = "9:41";

  return (
    <div className="min-h-screen bg-[#E2E8E4] flex justify-center items-start sm:py-6 selection:bg-[#0F7A44] selection:text-white">
      {/* Phone container */}
      <div className="w-full sm:max-w-md bg-[#F4F7F5] min-h-screen sm:min-h-[844px] sm:max-h-[920px] sm:rounded-[36px] shadow-2xl flex flex-col relative overflow-hidden sm:border-[8px] sm:border-[#1E293B]">
        
        {/* Dynamic Island / Speaker Notch (Desktop preview only) */}
        <div className="hidden sm:flex justify-center pt-2 pb-1 bg-transparent z-50">
          <div className="h-4 w-28 bg-[#0F172A] rounded-full flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#1E293B] mr-3"></div>
            <div className="h-1.5 w-8 rounded-full bg-[#334155]"></div>
          </div>
        </div>

        {/* Status Bar */}
        {showStatusBar && (
          <div className={`px-6 pt-2 pb-1.5 flex justify-between items-center text-xs font-semibold select-none z-40 transition-colors ${
            darkStatus ? 'text-white bg-[#0F7A44]' : 'text-gray-800 bg-white'
          }`}>
            <span className="font-semibold tracking-tight">{currentTime}</span>
            <div className="flex items-center space-x-1.5">
              <Signal size={12} strokeWidth={2.5} />
              <Wifi size={12} strokeWidth={2.5} />
              <div className="flex items-center space-x-0.5">
                <Battery size={15} strokeWidth={2.5} className="fill-current" />
              </div>
            </div>
          </div>
        )}

        {/* Screen Content Container with auto scroll */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
          {children}
        </div>

        {/* Home indicator bar (iPhone style) */}
        <div className="w-full py-1.5 flex justify-center bg-transparent z-40 pointer-events-none">
          <div className="w-32 h-1 bg-gray-400/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
