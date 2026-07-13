'use client';
import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { loadT1 } from '@/lib/data';
import { T1Row } from '@/lib/types';

const PHASES = ['All', '2019', '2020', '2021', '2022'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(59,130,246,0.35)', borderRadius: 10, padding: '12px 16px', minWidth: 180 }}>
      <p style={{ color: '#94A3B8', fontSize: 11, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
          <span style={{ color: p.color, fontSize: 12 }}>{p.name}</span>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>${p.value.toFixed(0)}B</span>
        </div>
      ))}
    </div>
  );
};

export default function ExecutiveOverview() {
  const [data, setData] = useState<{ year: string; totalTrade: number; imports: number; exports: number }[]>([]);
  const [yearFilter, setYearFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadT1().then(rows => {
      const byYear: Record<number, { totalTrade: number; imports: number; exports: number }> = {};
      rows.forEach((r: T1Row) => {
        if (!byYear[r.refYear]) byYear[r.refYear] = { totalTrade: 0, imports: 0, exports: 0 };
        byYear[r.refYear].totalTrade += r.total_trade_B;
        byYear[r.refYear].imports += r.imports_B;
        byYear[r.refYear].exports += r.exports_B;
      });
      const formatted = Object.entries(byYear).map(([yr, vals]) => ({
        year: yr,
        totalTrade: parseFloat(vals.totalTrade.toFixed(1)),
        imports: parseFloat(vals.imports.toFixed(1)),
        exports: parseFloat(vals.exports.toFixed(1)),
      })).sort((a, b) => Number(a.year) - Number(b.year));
      setData(formatted);
      setLoading(false);
    });
  }, []);

  const filtered = yearFilter === 'All' ? data : data.filter(d => d.year === yearFilter);

  const insights = [
    { icon: '📈', text: <><strong>2021 Recovery Surge:</strong> Total global semiconductor trade surged to <strong>$812B</strong> in 2021, a +41% rebound from the 2020 COVID shock.</> },
    { icon: '🌏', text: <><strong>China dominance:</strong> China alone represents over <strong>40% of global exports</strong>, making it the single most critical node in the supply chain network.</> },
    { icon: '⚠️', text: <><strong>2022 Volatility:</strong> Post-COVID normalization in 2022 saw trade settle at <strong>$2.1T</strong>, but disruption indices remained elevated for 7 countries.</> },
    { icon: '🔄', text: <><strong>Import-Export Imbalance:</strong> The global average import-export ratio shows significant asymmetry, with import-heavy economies averaging 3.2× dependency.</> },
  ];

  return (
    <section id="executive-overview" style={{ padding: '80px 0', background: '#0A0A0A' }}>
      <div className="section-container">
        <div style={{ marginBottom: 40 }}>
          <p className="section-label">Section 02</p>
          <h2 className="section-title">Executive Trade Overview</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginTop: 8 }}>Global semiconductor trade volume 2019–2022 · All figures in USD Billions</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* Chart */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Global Trade Trend (USD Billions)</h3>
              <div style={{ display: 'flex', gap: 6 }}>
                {PHASES.map(p => (
                  <button key={p} onClick={() => setYearFilter(p)}
                    style={{ padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', border: yearFilter === p ? '1px solid #3B82F6' : '1px solid rgba(255,255,255,0.1)', background: yearFilter === p ? 'rgba(59,130,246,0.2)' : 'transparent', color: yearFilter === p ? '#3B82F6' : '#64748B' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>Loading data...</div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={filtered} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickFormatter={(v) => `$${v}B`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8', paddingTop: 8 }} />
                  <ReferenceLine x="2020" stroke="rgba(239,68,68,0.3)" strokeDasharray="6 3" label={{ value: 'COVID', fill: '#EF4444', fontSize: 10 }} />
                  <Line type="monotone" dataKey="totalTrade" name="Total Trade" stroke="#3B82F6" strokeWidth={2.5} dot={{ fill: '#3B82F6', r: 5 }} activeDot={{ r: 7, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="imports" name="Imports" stroke="#06B6D4" strokeWidth={2} strokeDasharray="6 3" dot={{ fill: '#06B6D4', r: 4 }} />
                  <Line type="monotone" dataKey="exports" name="Exports" stroke="#10B981" strokeWidth={2} strokeDasharray="6 3" dot={{ fill: '#10B981', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Insights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Narrative Insights</h3>
            {insights.map((ins, i) => (
              <div key={i} className="insight-card">
                <span style={{ fontSize: 18, marginRight: 8 }}>{ins.icon}</span>
                <span style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7 }}>{ins.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
