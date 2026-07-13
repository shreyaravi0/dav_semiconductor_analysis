'use client';
import React, { useEffect, useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { loadT1, loadT5, getRiskColor, formatBillions } from '@/lib/data';
import { T1Row, T5Row } from '@/lib/types';
import RiskBadge from './RiskBadge';

const RISK_COLORS = { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' };

export default function CountryDigitalTwin({ selectedCountry, onSelectCountry }: { selectedCountry: string; onSelectCountry: (c: string) => void }) {
  const [t1, setT1] = useState<T1Row[]>([]);
  const [t5, setT5] = useState<T5Row[]>([]);
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadT1(), loadT5()]).then(([d1, d5]) => {
      setT1(d1);
      setT5(d5);
      const defaultCountry = selectedCountry || d5[0]?.country_tableau || 'China';
      setCountry(defaultCountry);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedCountry) setCountry(selectedCountry);
  }, [selectedCountry]);

  const countries = useMemo(() => [...new Set(t5.map(r => r.country_tableau))].sort(), [t5]);

  const countryT1 = useMemo(() =>
    t1.filter(r => r.country_tableau === country).sort((a, b) => a.refYear - b.refYear),
    [t1, country]);

  const countryT5 = useMemo(() =>
    t5.find(r => r.country_tableau === country),
    [t5, country]);

  const tradeTrend = useMemo(() =>
    countryT1.map(r => ({ year: String(r.refYear), trade: r.total_trade_B, imports: r.imports_B, exports: r.exports_B, yoy: r.yoy_pct })),
    [countryT1]);

  // Global averages for benchmark
  const globalAvg = useMemo(() => {
    if (!t5.length) return { disruption: 0.24, dependency: 0.35, volatility: 0.08, conflict: 0.65, risk: 38 };
    return {
      disruption: t5.reduce((s, r) => s + r.disruption_index, 0) / t5.length,
      dependency: t5.reduce((s, r) => s + r.dependency_score, 0) / t5.length,
      volatility: t5.reduce((s, r) => s + r.volatility_score, 0) / t5.length,
      conflict: t5.reduce((s, r) => s + r.conflict_ratio, 0) / t5.length,
      risk: t5.reduce((s, r) => s + r.risk_score, 0) / t5.length,
    };
  }, [t5]);

  const radarData = useMemo(() => !countryT5 ? [] : [
    { metric: 'Disruption', country: countryT5.disruption_index * 100, global: globalAvg.disruption * 100 },
    { metric: 'Dependency', country: countryT5.dependency_score * 100, global: globalAvg.dependency * 100 },
    { metric: 'Volatility', country: countryT5.volatility_score * 100, global: globalAvg.volatility * 100 },
    { metric: 'Conflict', country: countryT5.conflict_ratio * 100, global: globalAvg.conflict * 100 },
    { metric: 'Risk Score', country: countryT5.risk_score, global: globalAvg.risk },
  ], [countryT5, globalAvg]);

  const pieData = useMemo(() => !countryT5 ? [] : [
    { name: 'Low', value: countryT5.prob_low_pct },
    { name: 'Medium', value: countryT5.prob_medium_pct },
    { name: 'High', value: countryT5.prob_high_pct },
  ], [countryT5]);

  if (loading) return <div style={{ padding: 80, textAlign: 'center', color: '#06B6D4' }}>Loading Digital Twin...</div>;
  if (!countryT5) return <div style={{ padding: 80, textAlign: 'center', color: '#475569' }}>No data for {country}</div>;

  return (
    <section id="country-digital-twin" style={{ padding: '80px 0', background: '#0A0A0A' }}>
      <div className="section-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <p className="section-label">Section 07</p>
            <h2 className="section-title">Country Digital Twin</h2>
            <p style={{ color: '#64748B', fontSize: 14, marginTop: 8 }}>Live country intelligence · T4 + T5 · Click any metric to deep-dive</p>
          </div>
          <select value={country} onChange={e => { setCountry(e.target.value); onSelectCountry(e.target.value); }}
            style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(59,130,246,0.4)', color: '#fff', padding: '10px 16px', borderRadius: 10, fontSize: 14, cursor: 'pointer', outline: 'none', minWidth: 200 }}>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Profile Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Risk Category', val: <RiskBadge risk={countryT5.risk_category} />, color: getRiskColor(countryT5.risk_category) },
            { label: 'Confidence', val: `${countryT5.confidence_pct?.toFixed(1)}%`, color: '#3B82F6' },
            { label: 'Trade Volume', val: formatBillions(countryT5.total_trade_B), color: '#06B6D4' },
            { label: 'Dependency Score', val: countryT5.dependency_score.toFixed(3), color: '#8B5CF6' },
            { label: 'Volatility Score', val: countryT5.volatility_score.toFixed(4), color: '#F59E0B' },
            { label: 'Disruption Index', val: countryT5.disruption_index.toFixed(4), color: '#EF4444' },
          ].map((m, i) => (
            <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontSize: typeof m.val === 'string' ? 20 : 14, fontWeight: 700, color: m.color, fontFamily: "'Space Grotesk', sans-serif" }}>{m.val}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          {/* Trade Trend */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Trade Trend 2019–2022</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={tradeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 10 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickFormatter={v => `$${v}B`} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8 }} />
                <Line type="monotone" dataKey="trade" name="Trade" stroke="#3B82F6" strokeWidth={2.5} dot={{ fill: '#3B82F6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Imports vs Exports */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Imports vs Exports</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={tradeTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 10 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickFormatter={v => `$${v}B`} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8 }} />
                <Bar dataKey="imports" name="Imports" fill="#3B82F6" radius={[3, 3, 0, 0]} fillOpacity={0.85} />
                <Bar dataKey="exports" name="Exports" fill="#10B981" radius={[3, 3, 0, 0]} fillOpacity={0.85} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94A3B8' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Risk Metrics Radar</h3>
            <p style={{ fontSize: 10, color: '#475569', marginBottom: 8 }}>vs Global Benchmark</p>
            <ResponsiveContainer width="100%" height={210}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748B', fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fill: '#64748B', fontSize: 8 }} />
                <Radar name={country} dataKey="country" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} strokeWidth={2} />
                <Radar name="Global Avg" dataKey="global" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.12} strokeWidth={1.5} strokeDasharray="5 3" />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94A3B8' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GNN Probability */}
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>GNN Probability</h3>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={55} innerRadius={30} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${Number(v).toFixed(1)}%`]} contentStyle={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Country vs Global Benchmark</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Disruption Index', country: countryT5.disruption_index, global: globalAvg.disruption, color: '#EF4444' },
                { label: 'Dependency Score', country: countryT5.dependency_score, global: globalAvg.dependency, color: '#8B5CF6' },
                { label: 'Volatility Score', country: countryT5.volatility_score, global: globalAvg.volatility, color: '#F59E0B' },
                { label: 'Conflict Ratio', country: countryT5.conflict_ratio, global: globalAvg.conflict, color: '#06B6D4' },
              ].map(m => (
                <div key={m.label} style={{ padding: '12px 16px', background: 'rgba(15,23,42,0.5)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 11, color: '#475569', marginBottom: 8 }}>{m.label}</div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#64748B' }}>This Country</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: m.color }}>{m.country.toFixed(3)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: '#64748B' }}>Global Avg</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#94A3B8' }}>{m.global.toFixed(3)}</div>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(m.country / Math.max(m.country, m.global, 0.001)) * 100}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
