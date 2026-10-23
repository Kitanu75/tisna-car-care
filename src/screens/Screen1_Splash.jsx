import React from 'react';
import { Sparkles, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import appConfig from '../data/appConfig';

export default function Screen1_Splash({ onGetStarted, onLogin }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Brand, Tagline & CTAs */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="w-56 sm:w-64 mx-auto lg:mx-0">
            <img 
              src={appConfig.brand.logoImage} 
              alt={appConfig.brand.name} 
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-[#0F7A44] border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold">
              <Sparkles size={14} />
              <span>Doorstep Professional Auto Detailing</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Clean. Protect. <br className="hidden sm:inline" />
              <span className="text-[#0F7A44]">Drive Better.</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Premium doorstep car cleaning, routine daily wash plans, interior deep sanitization, and machine polishing delivered directly at your residence.
            </p>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0 text-left text-xs font-semibold text-gray-700 pt-1">
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-[#0F7A44]" />
              <span>Doorstep Washing</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-[#0F7A44]" />
              <span>Verified Specialists</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-[#0F7A44]" />
              <span>Daily Routine Care</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-[#0F7A44]" />
              <span>Static UPI QR Pay</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 max-w-md mx-auto lg:mx-0">
            <button
              id="splash-get-started-btn"
              onClick={onGetStarted}
              className="flex-1 py-4 px-7 bg-[#0F7A44] hover:bg-[#0c6237] active:scale-[0.99] text-white font-extrabold rounded-2xl text-base shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center tracking-wide"
            >
              Get Started
            </button>

            <button
              id="splash-login-btn"
              onClick={onLogin}
              className="flex-1 py-4 px-7 bg-white hover:bg-gray-50 active:scale-[0.99] text-gray-800 font-extrabold rounded-2xl text-base border border-gray-300 transition-all flex items-center justify-center tracking-wide shadow-xs"
            >
              Login
            </button>
          </div>
        </div>

        {/* Right Column: Hero Visual Image */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative group">
            <img 
              src="/assets/hero-car.jpg" 
              alt="Tisna Car Care Wash" 
              className="w-full h-80 sm:h-[480px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6">
              <span className="text-white text-xs sm:text-sm font-semibold flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                Trusted by 5,000+ car owners across Delhi NCR
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
