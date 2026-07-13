
'use client';
import React, { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { id: 'hero', label: 'Overview' },
  { id: 'executive-overview', label: 'Trade Trends' },
  { id: 'global-trade-network', label: 'World Map' },
  { id: 'risk-intelligence', label: 'Risk Center' },
  { id: 'covid-analytics', label: 'COVID Impact' },
  { id: 'ai-risk-engine', label: 'AI Engine' },
  { id: 'country-digital-twin', label: 'Digital Twin' },
  { id: 'eda-explorer', label: 'EDA Explorer' },
  { id: 'research-insights', label: 'Insights' },
  { id: 'recommendations', label: 'Recommendations' },
];

export default function Navigation() {
  const [active, setActive] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = NAV_ITEMS.map(n => document.getElementById(n.id));
      const scrollPos = window.scrollY + 120;
      let current = 'hero';
      sections.forEach((section) => {
        if (section && section.offsetTop <= scrollPos) current = section.id;
      });
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
      background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1E293B' }}>
            <img src="/logo.png" alt="Chipshield" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>Chipshield</div>
            <div style={{ fontSize: 9, color: '#475569', fontWeight: 500, lineHeight: 1, marginTop: 2 }}>Intelligence Platform</div>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ display: 'flex', gap: 2, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)} className={`nav-item ${active === item.id ? 'active' : ''}`}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span className="pulse-dot" />
          <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>Live</span>
        </div>
      </div>
    </nav>
  );
}
