import React from 'react';
import { storage } from '../utils/storage';

export default function Footer({ onOpenAdmin }) {
  const pricing = storage.getPricing();
  const phone = pricing?.payment?.paymentPhone || '+91 70420 62926';
  const wa = pricing?.payment?.whatsappNumber || '917042062926';

  return (
    <footer className="footer">
      <div className="footer-links">
        <a href={`tel:${phone.replace(/\s/g, '')}`} className="footer-link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>Call Us</span>
        </a>
        <a
          href={`https://wa.me/${wa}?text=Hi%20Tisna%20Car`}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
          </svg>
          <span>WhatsApp</span>
        </a>
      </div>
      <div className="footer-copyright">
        <span
          onClick={onOpenAdmin}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          © {new Date().getFullYear()} Tisna Car. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
