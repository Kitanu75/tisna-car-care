import React from 'react';

export default function Navbar({ step = 1, onBack, onReset }) {
  return (
    <nav className="navbar">
      <div className="navbar-left-action">
        {step > 1 ? (
          <button
            className="navbar-icon-btn"
            onClick={onBack}
            aria-label="Back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        ) : (
          <div style={{ width: 32 }} />
        )}
      </div>

      <div className="navbar-brand-logo" onClick={onReset} style={{ cursor: 'pointer' }}>
        <img
          src="/assets/tisna-car-logo.png"
          alt="Tisna Car"
          className="navbar-brand-img"
        />
      </div>

      <div className="navbar-right-action">
        {step > 1 ? (
          <button
            className="navbar-icon-btn"
            onClick={onReset}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : (
          <div style={{ width: 32 }} />
        )}
      </div>
    </nav>
  );
}
