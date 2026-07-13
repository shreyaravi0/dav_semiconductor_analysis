'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { loadT3, getRiskColor } from '@/lib/data';
import { T3Row } from '@/lib/types';
import RiskBadge from './RiskBadge';

// Country ISO → coordinates mapping (approximate SVG positions)
const COUNTRY_POSITIONS: Record<string, { x: number; y: number; label: string }> = {
  'United States': { x: 170, y: 230, label: 'USA' },
  'Canada': { x: 165, y: 175, label: 'Canada' },
  'Mexico': { x: 160, y: 285, label: 'Mexico' },
  'Brazil': { x: 260, y: 380, label: 'Brazil' },
  'United Kingdom': { x: 455, y: 185, label: 'UK' },
  'France': { x: 467, y: 210, label: 'France' },
  'Germany': { x: 483, y: 198, label: 'Germany' },
  'Italy': { x: 490, y: 220, label: 'Italy' },
  'Spain': { x: 454, y: 220, label: 'Spain' },
  'Netherlands': { x: 475, y: 192, label: 'NL' },
  'Belgium': { x: 472, y: 197, label: 'BE' },
  'Austria': { x: 493, y: 207, label: 'AT' },
  'Switzerland': { x: 478, y: 210, label: 'CH' },
  'Sweden': { x: 497, y: 168, label: 'SE' },
  'Denmark': { x: 485, y: 178, label: 'DK' },
  'Finland': { x: 510, y: 162, label: 'FI' },
  'Poland': { x: 507, y: 193, label: 'PL' },
  'Czechia': { x: 498, y: 200, label: 'CZ' },
  'Hungary': { x: 505, y: 207, label: 'HU' },
  'Romania': { x: 515, y: 210, label: 'RO' },
  'Bulgaria': { x: 518, y: 215, label: 'BG' },
  'Portugal': { x: 448, y: 222, label: 'PT' },
  'Slovakia': { x: 507, y: 204, label: 'SK' },
  'Malta': { x: 490, y: 235, label: 'MT' },
  'Israel': { x: 545, y: 245, label: 'IL' },
  'Turkey': { x: 535, y: 225, label: 'TR' },
  'Morocco': { x: 455, y: 248, label: 'MA' },
  'India': { x: 632, y: 280, label: 'India' },
  'China': { x: 705, y: 240, label: 'China' },
  'Japan': { x: 760, y: 228, label: 'Japan' },
  'South Korea': { x: 748, y: 232, label: 'Korea' },
  'Hong Kong': { x: 728, y: 265, label: 'HK' },
  'Singapore': { x: 715, y: 320, label: 'SG' },
  'Malaysia': { x: 710, y: 310, label: 'MY' },
  'Thailand': { x: 705, y: 293, label: 'TH' },
  'Vietnam': { x: 720, y: 285, label: 'VN' },
  'Indonesia': { x: 720, y: 335, label: 'ID' },
  'Philippines': { x: 745, y: 295, label: 'PH' },
  'Australia': { x: 750, y: 400, label: 'AUS' },
  'Ireland': { x: 448, y: 188, label: 'IE' },
};

export default function GlobalTradeNetwork({ onSelectCountry, selectedCountry }: { onSelectCountry: (c: string) => void; selectedCountry: string }) {
  const [data, setData] = useState<T3Row[]>([]);
  const [hovered, setHovered] = useState<T3Row | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [colorBy, setColorBy] = useState<'risk' | 'trade'>('risk');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadT3().then(d => { setData(d); setLoading(false); });
  }, []);

  const maxTrade = useMemo(() => data.length > 0 ? Math.max(...data.map(d => d.total_trade_B_2022)) : 1, [data]);

  const top10Data = useMemo(() => {
    return [...data].sort((a, b) => b.total_trade_B_2022 - a.total_trade_B_2022).slice(0, 10);
  }, [data]);

  const mapNodesData = useMemo(() => {
    const nodesMap = new Map<string, T3Row>();
    top10Data.forEach(d => nodesMap.set(d.country_tableau, d));
    
    if (selectedCountry) {
      const selectedData = data.find(d => d.country_tableau === selectedCountry);
      if (selectedData) nodesMap.set(selectedData.country_tableau, selectedData);
    }
    
    return Array.from(nodesMap.values());
  }, [top10Data, data, selectedCountry]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return data.filter(d => 
      d.country_tableau.toLowerCase().includes(searchQuery.toLowerCase()) && 
      !top10Data.find(t => t.country_tableau === d.country_tableau)
    ).slice(0, 8);
  }, [data, searchQuery, top10Data]);

  const getNodeColor = (row: T3Row) => {
    if (colorBy === 'risk') return getRiskColor(row.risk_2022);
    const ratio = row.total_trade_B_2022 / maxTrade;
    if (ratio > 0.5) return '#3B82F6';
    if (ratio > 0.1) return '#06B6D4';
    if (ratio > 0.02) return '#8B5CF6';
    return '#475569';
  };

  const getNodeSize = (row: T3Row) => {
    const ratio = row.total_trade_B_2022 / maxTrade;
    return Math.max(5, ratio * 28 + 4);
  };

  return (
    <section id="global-trade-network" style={{ padding: '80px 0', background: 'linear-gradient(180deg, #0D1117 0%, #0A0A0A 100%)' }}>
      <div className="section-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="section-label">Section 03 · Visual Centerpiece</p>
            <h2 className="section-title">Global Trade Network</h2>
            <p style={{ color: '#64748B', fontSize: 14, marginTop: 8 }}>Interactive semiconductor supply chain map · Top 10 countries displayed · Search for others</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['Risk Level', 'risk'], ['Trade Volume', 'trade']].map(([label, key]) => (
              <button key={key} onClick={() => setColorBy(key as 'risk' | 'trade')}
                style={{ padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', border: colorBy === key ? '1px solid #3B82F6' : '1px solid rgba(255,255,255,0.1)', background: colorBy === key ? 'rgba(59,130,246,0.2)' : 'transparent', color: colorBy === key ? '#3B82F6' : '#64748B' }}>
                Color by {label}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
          {loading ? (
            <div style={{ height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>Loading trade network...</div>
          ) : (
            <div style={{ position: 'relative' }} onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}>
              
              {/* Search Bar overlay */}
              <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Search other countries..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      background: 'rgba(15,23,42,0.8)',
                      border: '1px solid rgba(59,130,246,0.3)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: '#fff',
                      fontSize: 13,
                      width: 220,
                      outline: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  {searchResults.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, width: '100%', background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                      {searchResults.map(res => (
                        <div key={res.country_tableau} 
                             onClick={() => { onSelectCountry(res.country_tableau); setSearchQuery(''); }}
                             style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 13, color: '#94A3B8', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                             onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
                             onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          {res.country_tableau}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SVG World Map Area */}
              <svg viewBox="0 0 950 520" style={{ width: '100%', background: 'linear-gradient(180deg, #0A0F1E 0%, #070B14 100%)' }}>
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59,130,246,0.04)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="950" height="520" fill="url(#grid)" />

                {/* Real World Map Background */}
                <image href="/world-map.svg" width="950" height="620" x="0" y="-40" opacity="0.15" style={{ filter: 'invert(1) brightness(2)' }} />

                {/* Longitude/Latitude lines */}
                {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(x => (
                  <line key={x} x1={x} y1={0} x2={x} y2={520} stroke="rgba(59,130,246,0.03)" strokeWidth={0.5} />
                ))}
                {[0, 80, 160, 240, 320, 400, 480].map(y => (
                  <line key={y} x1={0} y1={y} x2={950} y2={y} stroke="rgba(59,130,246,0.03)" strokeWidth={0.5} />
                ))}

                {/* Trade flow arcs */}
                {mapNodesData.map((row, i) => {
                  const pos = COUNTRY_POSITIONS[row.country_tableau];
                  const usaPos = COUNTRY_POSITIONS['United States'];
                  if (!pos || !usaPos || pos.label === 'USA') return null;
                  const cpx = (pos.x + usaPos.x) / 2;
                  const cpy = Math.min(pos.y, usaPos.y) - 60;
                  return (
                    <path key={`arc-${i}`} d={`M ${usaPos.x} ${usaPos.y} Q ${cpx} ${cpy} ${pos.x} ${pos.y}`}
                      fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth={row.total_trade_B_2022 / maxTrade * 3 + 0.3} />
                  );
                })}

                {/* Country nodes */}
                {mapNodesData.map((row, i) => {
                  const pos = COUNTRY_POSITIONS[row.country_tableau];
                  if (!pos) return null;
                  const size = getNodeSize(row);
                  const color = getNodeColor(row);
                  const isSelected = selectedCountry === row.country_tableau;
                  const isHovered = hovered?.country_tableau === row.country_tableau;

                  return (
                    <g key={`node-${i}`} style={{ cursor: 'pointer' }}
                      onClick={() => onSelectCountry(row.country_tableau)}
                      onMouseEnter={() => setHovered(row)}
                      onMouseLeave={() => setHovered(null)}>
                      {/* Selection ring */}
                      {isSelected && <circle cx={pos.x} cy={pos.y} r={size + 6} fill="none" stroke={color} strokeWidth={2} opacity={0.7} strokeDasharray="4 2" />}
                      {/* Hover glow */}
                      {(isSelected || isHovered) && <circle cx={pos.x} cy={pos.y} r={size + 12} fill={color} opacity={0.08} />}
                      {/* Main node */}
                      <circle cx={pos.x} cy={pos.y} r={size} fill={color} opacity={0.85} stroke="rgba(0,0,0,0.5)" strokeWidth={1.5} />
                      {/* Label */}
                      <text x={pos.x} y={pos.y + size + 11} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={9} fontFamily="Inter">{pos.label}</text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip */}
              {hovered && (
                <div style={{ position: 'fixed', left: mousePos.x + 12, top: mousePos.y - 80, background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 10, padding: '12px 16px', zIndex: 100, pointerEvents: 'none', minWidth: 200 }}>
                  <p style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 8 }}>{hovered.country_tableau}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: 12, color: '#94A3B8' }}>
                    <span>Risk</span><RiskBadge risk={hovered.risk_2022} size="sm" />
                    <span>Trade</span><span style={{ color: '#3B82F6', fontWeight: 600 }}>${hovered.total_trade_B_2022.toFixed(1)}B</span>
                    <span>Disruption</span><span style={{ color: '#F59E0B', fontWeight: 600 }}>{hovered.disruption_2022.toFixed(3)}</span>
                    <span>Confidence</span><span style={{ color: '#10B981', fontWeight: 600 }}>{hovered.confidence_2022.toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>Legend:</span>
            {colorBy === 'risk' ? (
              ['Low', 'Medium', 'High'].map(r => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: getRiskColor(r), display: 'inline-block' }} />
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>{r} Risk</span>
                </div>
              ))
            ) : (
              [['> $100B', '#3B82F6'], ['$10–100B', '#06B6D4'], ['$1–10B', '#8B5CF6'], ['< $1B', '#475569']].map(([label, color]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>{label}</span>
                </div>
              ))
            )}
            <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>Node size = Trade volume · Only Top 10 + selected are shown</span>
          </div>
        </div>
      </div>
    </section>
  );
}
