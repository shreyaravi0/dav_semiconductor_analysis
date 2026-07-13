'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import AnimatedCounter from './AnimatedCounter';
import { HERO_STATS } from '@/lib/data';

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

const stats = [
  { label: 'Total Trade Volume', value: 2.1, prefix: '$', suffix: 'T', decimals: 1, icon: '📊', color: '#3B82F6' },
  { label: 'Countries Tracked', value: HERO_STATS.numCountries, prefix: '', suffix: '', decimals: 0, icon: '🌍', color: '#06B6D4' },
  { label: 'Avg Disruption Index', value: HERO_STATS.avgDisruption, prefix: '', suffix: '', decimals: 2, icon: '⚡', color: '#F59E0B' },
  { label: 'Avg YoY Growth', value: HERO_STATS.avgGrowth, prefix: '', suffix: '%', decimals: 1, icon: '📈', color: '#10B981' },
  { label: 'Medium Risk Nations', value: HERO_STATS.mediumRiskCountries, prefix: '', suffix: '', decimals: 0, icon: '🔶', color: '#F59E0B' },
  { label: 'GraphSAGE Accuracy', value: HERO_STATS.graphsageAccuracy, prefix: '', suffix: '%', decimals: 1, icon: '🤖', color: '#8B5CF6' },
  { label: 'ROC-AUC Score', value: HERO_STATS.rocAuc, prefix: '', suffix: '', decimals: 2, icon: '🎯', color: '#EC4899' },
];

export default function HeroSection() {
  return (
    <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden', background: 'linear-gradient(180deg, #0A0A0A 0%, #0F172A 50%, #0A0A0A 100%)' }}>
      <HeroCanvas />

      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />

      <div className="section-container" style={{ position: 'relative', zIndex: 1, paddingTop: 100, paddingBottom: 60 }}>
        {/* Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <span className="pulse-dot" />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#06B6D4', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Live Intelligence Platform — 2022 Data
          </span>
        </div>

        {/* Main title */}
        <h1 className="gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 16, maxWidth: 900 }}>
          Chipshield<br />
          <span style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 600 }}>Risk Intelligence Platform</span>
        </h1>
        <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: '#94A3B8', marginBottom: 16, maxWidth: 700, lineHeight: 1.6 }}>
          AI-Powered Global Trade, Disruption and Risk Monitoring System for Semiconductor Supply Chains
        </p>
        <p style={{ fontSize: 13, color: '#475569', marginBottom: 56, maxWidth: 650 }}>
          Powered by GraphSAGE Graph Neural Networks · 40 Countries · 4-Year Analysis (2019–2022)
        </p>

        {/* KPI grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card border-animate" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: s.color, background: `${s.color}18`, padding: '2px 8px', borderRadius: 20, border: `1px solid ${s.color}30` }}>
                  LIVE
                </span>
              </div>
              <div style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", color: s.color, lineHeight: 1, marginBottom: 6 }}>
                <AnimatedCounter end={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} duration={1800} />
              </div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
              <div className="progress-bar" style={{ marginTop: 12 }}>
                <div className="progress-fill" style={{ width: `${Math.min(100, s.value * (s.suffix === '%' ? 1 : 30))}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}80)` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#475569', letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll to explore</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg, #3B82F6, transparent)', margin: '0 auto', animation: 'fadeIn 2s ease infinite alternate' }} />
        </div>
      </div>
    </section>
  );
}
