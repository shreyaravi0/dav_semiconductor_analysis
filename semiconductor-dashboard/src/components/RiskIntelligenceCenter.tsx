'use client';
import React, { useEffect, useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, ScatterChart,
  Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Legend
} from 'recharts';
import { loadT3, loadT5, getRiskColor, formatBillions } from '@/lib/data';
import { T3Row, T5Row } from '@/lib/types';
import RiskBadge from './RiskBadge';

const COLORS = { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' };

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 10, padding: '12px 16px', minWidth: 200 }}>
      <p style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>{d.country}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 12, color: '#94A3B8' }}>
        <span>Trade: </span><span style={{ color: '#3B82F6', fontWeight: 600 }}>{formatBillions(d.tradeVol)}</span>
        <span>Disruption: </span><span style={{ color: '#F59E0B', fontWeight: 600 }}>{d.disruption?.toFixed(3)}</span>
        <span>Dependency: </span><span style={{ color: '#8B5CF6', fontWeight: 600 }}>{d.dependency?.toFixed(3)}</span>
      </div>
    </div>
  );
};

type SortKey = 'country' | 'risk_category' | 'confidence_2022' | 'disruption_2022';

export default function RiskIntelligenceCenter({ onSelectCountry }: { onSelectCountry: (c: string) => void }) {
  const [t3, setT3] = useState<T3Row[]>([]);
  const [t5, setT5] = useState<T5Row[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('disruption_2022');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadT3(), loadT5()]).then(([d3, d5]) => {
      setT3(d3);
      setT5(d5);
      setLoading(false);
    });
  }, []);

  const distribution = useMemo(() => {
    const counts: Record<string, number> = { Low: 0, Medium: 0, High: 0 };
    t3.forEach(r => { counts[r.risk_2022] = (counts[r.risk_2022] || 0) + 1; });
    return Object.entries(counts).map(([k, v]) => ({ name: k, value: v }));
  }, [t3]);

  const scatterData = useMemo(() =>
    t3.map(r => ({
      country: r.country_tableau,
      tradeVol: r.total_trade_B_2022,
      disruption: r.disruption_2022,
      dependency: r.dependency_score,
      risk: r.risk_2022,
      size: Math.max(40, r.dependency_score * 300),
    })), [t3]);

  const sortedT3 = useMemo(() => {
    return [...t3].sort((a, b) => {
      const av = a[sortKey as keyof T3Row] as number | string;
      const bv = b[sortKey as keyof T3Row] as number | string;
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [t3, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const getQuadrant = (d: number, t: number) => {
    if (d > 0.3 && t > 50) return 'High Risk Hub';
    if (d <= 0.3 && t > 50) return 'Stable Leader';
    if (d > 0.3 && t <= 50) return 'Vulnerable Economy';
    return 'Emerging Market';
  };

  if (loading) return <div style={{ padding: 80, textAlign: 'center', color: '#3B82F6' }}>Loading risk data...</div>;

  return (
    <section id="risk-intelligence" style={{ padding: '80px 0', background: 'linear-gradient(180deg, #0A0A0A 0%, #0D1117 100%)' }}>
      <div className="section-container">
        <div style={{ marginBottom: 40 }}>
          <p className="section-label">Section 04</p>
          <h2 className="section-title">Risk Intelligence Center</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginTop: 8 }}>Multi-dimensional risk analysis powered by T2, T5, T6 datasets and GraphSAGE GNN outputs</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, marginBottom: 24 }}>
          {/* Donut Chart */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={distribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {distribution.map((entry, i) => (
                    <Cell key={i} fill={COLORS[entry.name as keyof typeof COLORS]} stroke="rgba(0,0,0,0.3)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip formatter={(val, name) => [`${val} countries`, name]} contentStyle={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {distribution.map(d => (
                <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <RiskBadge risk={d.name} size="sm" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scatter Chart */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Disruption vs Trade Volume</h3>
            <p style={{ fontSize: 11, color: '#475569', marginBottom: 16 }}>Bubble size = Dependency Score · Color = Risk Category · Click country to drill down</p>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" dataKey="tradeVol" name="Trade Volume" unit="B" tick={{ fill: '#475569', fontSize: 10 }} label={{ value: 'Trade Volume (B)', fill: '#475569', fontSize: 10, position: 'insideBottom', offset: -10 }} />
                <YAxis type="number" dataKey="disruption" name="Disruption Index" tick={{ fill: '#475569', fontSize: 10 }} label={{ value: 'Disruption', fill: '#475569', fontSize: 10, angle: -90, position: 'insideLeft' }} />
                <ZAxis type="number" dataKey="size" range={[30, 300]} />
                <Tooltip content={<CustomTooltip />} />
                {(['High', 'Medium', 'Low'] as const).map(risk => (
                  <Scatter key={risk} name={risk} data={scatterData.filter(d => d.risk === risk)} fill={COLORS[risk]} fillOpacity={0.75} onClick={(d: any) => onSelectCountry(d.country)} style={{ cursor: 'pointer' }} />
                ))}
                <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              </ScatterChart>
            </ResponsiveContainer>
            {/* Quadrant labels */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
              {['🟢 Stable Leaders', '🔴 High Risk Hubs', '🟡 Emerging Markets', '🟠 Vulnerable Economies'].map(q => (
                <span key={q} style={{ fontSize: 10, color: '#475569', textAlign: 'center', padding: '4px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>{q}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Leaderboard */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Country Risk Ranking — 2022</h3>
            <span style={{ fontSize: 11, color: '#475569' }}>Click column headers to sort · Click row to explore country</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  {[['#', ''], ['Country', 'country'], ['Risk', 'risk_category'], ['Confidence', 'confidence_2022'], ['Disruption Index', 'disruption_2022'], ['Trade Volume', ''], ['Dependency', '']].map(([label, key]) => (
                    <th key={label} onClick={() => key && handleSort(key as SortKey)} style={{ cursor: key ? 'pointer' : 'default', userSelect: 'none' }}>
                      {label} {key && sortKey === key ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedT3.map((row, i) => (
                  <tr key={row.country} onClick={() => onSelectCountry(row.country_tableau)} style={{ cursor: 'pointer' }}>
                    <td style={{ color: '#475569', fontSize: 12 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>{row.country_tableau}</td>
                    <td><RiskBadge risk={row.risk_2022} size="sm" /></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${row.confidence_2022}%`, background: row.confidence_2022 > 80 ? '#10B981' : row.confidence_2022 > 50 ? '#F59E0B' : '#EF4444' }} />
                        </div>
                        <span style={{ fontSize: 12 }}>{row.confidence_2022.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td style={{ color: row.disruption_2022 > 0.4 ? '#EF4444' : row.disruption_2022 > 0.25 ? '#F59E0B' : '#10B981', fontWeight: 600 }}>{row.disruption_2022.toFixed(4)}</td>
                    <td style={{ color: '#3B82F6' }}>{formatBillions(row.total_trade_B_2022)}</td>
                    <td style={{ color: '#8B5CF6' }}>{row.dependency_score.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
