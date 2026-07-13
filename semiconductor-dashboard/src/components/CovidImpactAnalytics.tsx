'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { loadT3 } from '@/lib/data';
import { T3Row } from '@/lib/types';

const PHASE_COLORS = {
  'Pre-COVID (2019)': '#3B82F6',
  'COVID Shock (2020)': '#EF4444',
  'Recovery (2021)': '#F59E0B',
  'Post-COVID (2022)': '#10B981',
};

export default function CovidImpactAnalytics() {
  const [data, setData] = useState<T3Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadT3().then(d => { setData(d); setLoading(false); });
  }, []);

  const mostImpacted = useMemo(() =>
    [...data].sort((a, b) => a.covid_drop_pct - b.covid_drop_pct).slice(0, 8),
    [data]);

  const bestRecovery = useMemo(() =>
    [...data].sort((a, b) => b.recovery_pct - a.recovery_pct).slice(0, 8),
    [data]);

  const phases = [
    { key: 'Pre-COVID (2019)', color: '#3B82F6', icon: '🌐', label: 'Pre-COVID', period: '2019', desc: 'Baseline global semiconductor trade at $1.149T. Steady growth across all regions.' },
    { key: 'COVID Shock (2020)', color: '#EF4444', icon: '🦠', label: 'COVID Shock', period: '2020', desc: 'Supply chain disruption. Trade volumes declined in 28 out of 40 countries. Average drop of 2.3%.' },
    { key: 'Recovery (2021)', color: '#F59E0B', icon: '🚀', label: 'Recovery', period: '2021', desc: 'Unprecedented rebound. Total trade hit $1.575T, led by China, Malaysia, and South Korea.' },
    { key: 'Post-COVID (2022)', color: '#10B981', icon: '📈', label: 'Post-COVID', period: '2022', desc: 'New equilibrium. India and Poland emerged as fastest-growing markets with 100% and 45% YoY growth.' },
  ];

  if (loading) return <div style={{ padding: 80, textAlign: 'center', color: '#3B82F6' }}>Loading COVID data...</div>;

  return (
    <section id="covid-analytics" style={{ padding: '80px 0', background: '#0A0A0A' }}>
      <div className="section-container">
        <div style={{ marginBottom: 40 }}>
          <p className="section-label">Section 05</p>
          <h2 className="section-title">COVID-19 Impact Analytics</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginTop: 8 }}>Supply chain resilience analysis across four pandemic phases · T3 dataset</p>
        </div>

        {/* Phase Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {phases.map((ph, i) => (
            <div key={ph.key} className="glass-card" style={{ padding: 20, borderLeft: `3px solid ${ph.color}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -10, right: -10, fontSize: 60, opacity: 0.05 }}>{ph.icon}</div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{ph.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: ph.color, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>{ph.period}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{ph.label}</div>
              <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>{ph.desc}</p>
              {i < 3 && (
                <div style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', color: '#334155', fontSize: 20, zIndex: 2 }}>→</div>
              )}
            </div>
          ))}
        </div>

        {/* AI Insight Banner */}
        <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(16,185,129,0.1))', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: 20, marginBottom: 32, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 24 }}>🤖</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#10B981', marginBottom: 4 }}>AI-Generated Insight</p>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7 }}>
              India exhibited the strongest post-COVID recovery with <strong style={{ color: '#fff' }}>100% YoY growth</strong> in 2022, driven by rapid semiconductor import scaling. Poland followed with <strong style={{ color: '#fff' }}>45.2% growth</strong>. Both nations demonstrate emerging market dependency transitions, flagged by GraphSAGE as Medium Risk due to elevated disruption indices despite strong recovery momentum.
            </p>
          </div>
        </div>

        {/* Rankings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Most Impacted */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#EF4444', marginBottom: 4 }}>🔴 Most COVID-Impacted Countries</h3>
            <p style={{ fontSize: 11, color: '#475569', marginBottom: 16 }}>Ranked by 2020 trade drop percentage</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {mostImpacted.map((r, i) => (
                <div key={r.country} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 20, fontSize: 11, color: '#475569', fontWeight: 700 }}>{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 13, color: '#fff', fontWeight: 500 }}>{r.country_tableau}</span>
                  <div className="progress-bar" style={{ width: 80 }}>
                    <div className="progress-fill" style={{ width: `${Math.abs(r.covid_drop_pct) * 100}%`, background: '#EF4444' }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 600, minWidth: 50, textAlign: 'right' }}>{r.covid_drop_pct.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Best Recovery */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#10B981', marginBottom: 4 }}>🟢 Best Recovery Countries</h3>
            <p style={{ fontSize: 11, color: '#475569', marginBottom: 16 }}>Ranked by 2021–2022 recovery growth %</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {bestRecovery.map((r, i) => (
                <div key={r.country} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 20, fontSize: 11, color: '#475569', fontWeight: 700 }}>{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 13, color: '#fff', fontWeight: 500 }}>{r.country_tableau}</span>
                  <div className="progress-bar" style={{ width: 80 }}>
                    <div className="progress-fill" style={{ width: `${Math.min(100, r.recovery_pct * 8)}%`, background: '#10B981' }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600, minWidth: 60, textAlign: 'right' }}>+{r.recovery_pct.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
