import React from 'react';

export default function Navbar({ step = 1, onBack, onReset, onOpenAdmin }) {
  return (
    <nav className="navbar">
      <div className="navbar-left-action">
        <button
          className="navbar-icon-btn"
          onClick={step > 1 ? onBack : onOpenAdmin}
          aria-label={step > 1 ? "Back" : "Menu"}
          title={step > 1 ? "Go Back" : "Menu"}
        >
          {step > 1 ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      <div className="navbar-brand-logo" onClick={onReset} style={{ cursor: 'pointer' }} title="Tisna Car Home">
        <img
          src="/assets/tisna-car-logo.png"
          alt="Tisna Car"
          className="navbar-brand-img"
        />
        <div className="navbar-tagline">
          Your Doorstep Car Solution
        </div>
      </div>

      <div className="navbar-right-action">
        <a
          href="https://wa.me/917042062926?text=Hi%20Tisna%20Car%2C%20I%20have%20a%20query"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-icon-btn"
          aria-label="Notification"
          title="Notification & Help"
          style={{ position: 'relative', color: '#0F172A' }}
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, background: '#0072F5', borderRadius: '50%' }} />
        </a>
      </div>
    </nav>
  );
}
