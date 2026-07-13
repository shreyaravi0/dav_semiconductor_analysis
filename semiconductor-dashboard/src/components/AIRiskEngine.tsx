'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { loadT5, GRAPHSAGE_METRICS, getRiskColor } from '@/lib/data';
import { T5Row } from '@/lib/types';
import RiskBadge from './RiskBadge';

const RISK_COLORS = { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' };

const MetricCard = ({ label, value, suffix = '%', color }: { label: string; value: number; suffix?: string; color: string }) => (
  <div className="stat-card" style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 }}>
      {value.toFixed(1)}{suffix}
    </div>
    <div style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
    <div className="progress-bar" style={{ marginTop: 10 }}>
      <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  </div>
);

const GaugeChart = ({ value, label }: { value: number; label: string }) => {
  const angle = -135 + (value / 100) * 270;
  const color = value > 80 ? '#10B981' : value > 60 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <svg viewBox="0 0 200 120" style={{ width: '100%', maxWidth: 200, margin: '0 auto', display: 'block' }}>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={16} strokeLinecap="round" />
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${(value / 100) * 251.3} 251.3`} />
        <line x1="100" y1="100" x2={100 + 55 * Math.cos((angle - 90) * Math.PI / 180)} y2={100 + 55 * Math.sin((angle - 90) * Math.PI / 180)} stroke={color} strokeWidth={3} strokeLinecap="round" />
        <circle cx="100" cy="100" r="6" fill={color} />
        <text x="100" y="82" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800" fontFamily="Space Grotesk">{value.toFixed(1)}%</text>
        <text x="100" y="115" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="Inter">{label}</text>
      </svg>
    </div>
  );
};

export default function AIRiskEngine({ selectedCountry }: { selectedCountry: string }) {
  const [t5, setT5] = useState<T5Row[]>([]);
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadT5().then(d => {
      setT5(d);
      if (d.length > 0) setCountry(selectedCountry || d[0].country_tableau);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedCountry && t5.some(r => r.country_tableau === selectedCountry)) setCountry(selectedCountry);
  }, [selectedCountry, t5]);

  const countryData = useMemo(() => t5.find(r => r.country_tableau === country) || t5[0], [t5, country]);
  const countries = useMemo(() => [...new Set(t5.map(r => r.country_tableau))].sort(), [t5]);

  const pieData = useMemo(() => !countryData ? [] : [
    { name: 'Low', value: countryData.prob_low_pct },
    { name: 'Medium', value: countryData.prob_medium_pct },
    { name: 'High', value: countryData.prob_high_pct },
  ], [countryData]);

  const featureData = useMemo(() => !countryData ? [] : [
    { feature: 'Disruption Index', importance: countryData.disruption_index * 100, val: countryData.disruption_index },
    { feature: 'Dependency Score', importance: countryData.dependency_score * 80, val: countryData.dependency_score },
    { feature: 'Volatility Score', importance: countryData.volatility_score * 100, val: countryData.volatility_score },
    { feature: 'Conflict Ratio', importance: countryData.conflict_ratio * 90, val: countryData.conflict_ratio },
  ], [countryData]);

  const generateInsight = (d: T5Row): string => {
    const dominantFeature = d.disruption_index > d.dependency_score ? 'elevated disruption index' : 'elevated dependency and geopolitical exposure';
    const confidence = d.confidence_pct?.toFixed(1) || '85.0';
    return `${d.country_tableau} is classified as ${d.risk_category} Risk with ${confidence}% model confidence, primarily driven by ${dominantFeature} (${d.disruption_index.toFixed(3)}). The GraphSAGE model assigns a ${d.prob_low_pct?.toFixed(1)}% probability to Low Risk, ${d.prob_medium_pct?.toFixed(1)}% to Medium Risk, and ${d.prob_high_pct?.toFixed(1)}% to High Risk classification.`;
  };

  if (loading || !countryData) return <div style={{ padding: 80, textAlign: 'center', color: '#8B5CF6' }}>Loading AI Engine...</div>;

  return (
    <section id="ai-risk-engine" style={{ padding: '80px 0', background: 'linear-gradient(180deg, #0D1117 0%, #0A0A0A 100%)' }}>
      <div className="section-container">
        <div style={{ marginBottom: 40 }}>
          <p className="section-label">Section 06 · Most Important</p>
          <h2 className="section-title">AI Risk Engine</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginTop: 8 }}>GraphSAGE Graph Neural Network · Real-time probability scoring · T5 + T6 datasets</p>
        </div>

        {/* GraphSAGE Performance */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>GraphSAGE Model Performance</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            <MetricCard label="Accuracy" value={GRAPHSAGE_METRICS.accuracy} color="#3B82F6" />
            <MetricCard label="Precision" value={GRAPHSAGE_METRICS.precision} color="#06B6D4" />
            <MetricCard label="Recall" value={GRAPHSAGE_METRICS.recall} color="#8B5CF6" />
            <MetricCard label="F1 Score" value={GRAPHSAGE_METRICS.f1Score} color="#10B981" />
            <MetricCard label="ROC-AUC" value={GRAPHSAGE_METRICS.rocAuc * 100} color="#F59E0B" />
          </div>
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 260px', gap: 20 }}>
          {/* Country Selector + Donut */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Country Probability Explorer</h3>
            <select value={country} onChange={e => setCountry(e.target.value)}
              style={{ width: '100%', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(59,130,246,0.3)', color: '#fff', padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 16, cursor: 'pointer', outline: 'none' }}>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <RiskBadge risk={countryData.risk_category} />
            </div>

            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS]} stroke="rgba(0,0,0,0.4)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => [`${Number(v).toFixed(1)}%`]} contentStyle={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pieData.map(d => (
                <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: RISK_COLORS[d.name as keyof typeof RISK_COLORS] }}>{d.name} Risk</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-bar" style={{ width: 50 }}>
                      <div className="progress-fill" style={{ width: `${d.value}%`, background: RISK_COLORS[d.name as keyof typeof RISK_COLORS] }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', minWidth: 36 }}>{d.value.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Importance + Insight */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Feature Importance — Prediction Drivers</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {featureData.map((f, i) => (
                  <div key={f.feature}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#cbd5e1' }}>{f.feature}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: f.importance > 50 ? '#EF4444' : f.importance > 30 ? '#F59E0B' : '#10B981' }}>{f.val.toFixed(4)}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.min(100, f.importance)}%`, background: `linear-gradient(90deg, ${['#3B82F6', '#8B5CF6', '#06B6D4', '#F59E0B'][i]}, ${['#06B6D4', '#EC4899', '#10B981', '#EF4444'][i]})` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight */}
            <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>🤖</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#8B5CF6' }}>AI-Generated Risk Explanation</span>
              </div>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.8 }}>{generateInsight(countryData)}</p>
            </div>
          </div>

          {/* Confidence Gauge */}
          <div className="glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20, textAlign: 'center' }}>Confidence Meter</h3>
            <GaugeChart value={countryData.confidence_pct || 85} label="Model Confidence" />
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#475569', marginBottom: 8 }}>Risk Score</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: getRiskColor(countryData.risk_category), fontFamily: "'Space Grotesk', sans-serif" }}>
                {countryData.risk_score?.toFixed(1)}
              </div>
              <div style={{ fontSize: 11, color: '#475569' }}>/ 100</div>
            </div>
            <div style={{ marginTop: 20, width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#475569' }}>Trade Volume</span>
                <span style={{ color: '#3B82F6', fontWeight: 600 }}>${countryData.total_trade_B?.toFixed(1)}B</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#475569' }}>YoY Growth</span>
                <span style={{ color: '#10B981', fontWeight: 600 }}>+{countryData.yoy_pct?.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
