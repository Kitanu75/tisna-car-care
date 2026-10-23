import React, { useState } from 'react';
import { ArrowLeft, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import appConfig from '../data/appConfig';
import { storage } from '../utils/storage';

export default function Screen2_Login({ onBack, onLoginSuccess, onGoToSignUp }) {
  const [mobileNumber, setMobileNumber] = useState(appConfig.payment.paymentPhone);
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e?.preventDefault();
    if (!mobileNumber.trim()) {
      setErrorMessage('Please enter your mobile number');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const existingUser = storage.getUser();
      const updatedUser = {
        ...existingUser,
        phone: mobileNumber,
        isLoggedIn: true
      };
      storage.setUser(updatedUser);
      setIsLoading(false);
      onLoginSuccess();
    }, 400);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      const existingUser = storage.getUser();
      storage.setUser({
        ...existingUser,
        isLoggedIn: true,
        loginProvider: provider
      });
      setIsLoading(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto my-4 sm:my-10 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
      {/* Top Navigation */}
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition active:scale-95"
          title="Go back"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Centered Logo */}
      <div className="flex justify-center mb-4">
        <img 
          src={appConfig.brand.logoImage} 
          alt={appConfig.brand.name} 
          className="w-52 h-auto object-contain"
        />
      </div>

      {/* Heading */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Login to your account to book doorstep services</p>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Mobile Number</label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-gray-400">
              <Phone size={18} />
            </span>
            <input
              id="login-phone-input"
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-gray-400">
              <Lock size={18} />
            </span>
            <input
              id="login-password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F7A44] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs font-bold text-[#0F7A44] hover:underline"
            onClick={() => alert("Password reset instructions sent via SMS to your phone number.")}
          >
            Forgot Password?
          </button>
        </div>

        {errorMessage && (
          <p className="text-xs text-red-500 font-bold">{errorMessage}</p>
        )}

        <button
          id="login-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 bg-[#0F7A44] hover:bg-[#0c6237] active:scale-[0.99] text-white font-extrabold rounded-2xl text-sm sm:text-base shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center tracking-wide disabled:opacity-70"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Login'
          )}
        </button>
      </form>

      {/* OR Divider */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="border-t border-gray-200 w-full"></div>
        <span className="bg-white px-3 text-xs font-bold text-gray-400 uppercase tracking-wider absolute">OR</span>
      </div>

      {/* Social Logins */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => handleSocialLogin('Google')}
          className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-700 transition flex items-center justify-center space-x-2.5 shadow-xs active:scale-[0.99]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin('Apple')}
          className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-700 transition flex items-center justify-center space-x-2.5 shadow-xs active:scale-[0.99]"
        >
          <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.85-11.9-14.42-6.19-9.57-10.9-20.08-14.13-31.54-3.23-11.45-4.85-22.18-4.85-32.19 0-14.36 3.7-26.34 11.1-35.94 7.4-9.6 16.71-14.47 27.93-14.62 5.02 0 10.5 1.25 16.44 3.76 5.94 2.51 9.87 3.82 11.79 3.92 1.63 0 5.67-1.37 12.13-4.12 6.46-2.75 12.17-3.92 17.13-3.52 13.3.65 23.63 5.48 30.98 14.5-11.75 7.18-17.5 17.08-17.25 29.7.22 9.8 4.03 17.96 11.44 24.47 7.41 6.51 16.22 10.23 26.43 11.15-2.07 6.32-4.63 12.87-7.69 19.65zM119.22 31.84c0-7.39 2.66-14.31 7.98-20.77 5.32-6.46 11.87-10.36 19.64-11.7 1.09 7.07-.93 13.98-6.06 20.73-5.13 6.75-11.9 10.87-20.31 12.36-.33-.21-.83-.41-1.25-.62z" />
          </svg>
          <span>Continue with Apple</span>
        </button>
      </div>

      <div className="pt-6 text-center">
        <span className="text-xs text-gray-500">New User? </span>
        <button
          onClick={onGoToSignUp || onLoginSuccess}
          className="text-xs font-bold text-[#0F7A44] hover:underline"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
