'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { EDA_IMAGES, ML_IMAGES } from '@/lib/data';
import { EDAImage } from '@/lib/types';

const CATEGORIES = ['All', 'Correlations', 'Feature Analysis', 'Trade Analysis', 'Model Evaluation', 'Risk Analysis'] as const;

export default function EDAExplorer() {
  const [category, setCategory] = useState<string>('All');
  const [selected, setSelected] = useState<EDAImage | null>(null);

  const allImages = [...EDA_IMAGES, ...ML_IMAGES.map(m => ({ ...m, category: 'Model Evaluation' as const }))];
  const filtered = category === 'All' ? allImages : allImages.filter(img => img.category === category);

  const catColors: Record<string, string> = {
    Correlations: '#3B82F6',
    'Feature Analysis': '#8B5CF6',
    'Trade Analysis': '#10B981',
    'Model Evaluation': '#F59E0B',
    'Risk Analysis': '#EF4444',
  };

  return (
    <section id="eda-explorer" style={{ padding: '80px 0', background: 'linear-gradient(180deg, #0A0A0A 0%, #0D1117 100%)' }}>
      <div className="section-container">
        <div style={{ marginBottom: 40 }}>
          <p className="section-label">Section 08</p>
          <h2 className="section-title">EDA & Research Explorer</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginTop: 8 }}>Exploratory Data Analysis visualizations and GraphSAGE model evaluations</p>
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', border: category === cat ? `1px solid ${catColors[cat] || '#3B82F6'}` : '1px solid rgba(255,255,255,0.1)', background: category === cat ? `${catColors[cat] || '#3B82F6'}18` : 'transparent', color: category === cat ? (catColors[cat] || '#3B82F6') : '#64748B' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map((img, i) => (
            <div key={i} className="glass-card border-animate" style={{ cursor: 'pointer', overflow: 'hidden', transition: 'all 0.3s ease' }} onClick={() => setSelected(img as EDAImage)}>
              <div style={{ position: 'relative', height: 200, background: '#0F172A' }}>
                <img src={img.src} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: `${catColors[img.category] || '#3B82F6'}20`, border: `1px solid ${catColors[img.category] || '#3B82F6'}40`, color: catColors[img.category] || '#3B82F6' }}>{img.category}</span>
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(10,10,10,0.8) 0%, transparent 50%)', transition: 'opacity 0.3s' }} />
              </div>
              <div style={{ padding: '16px 20px' }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{img.title}</h4>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>{img.description}</p>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, color: '#3B82F6', fontSize: 11, fontWeight: 600 }}>
                  <span>Click to expand</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setSelected(null)}>
          <div style={{ background: '#0F172A', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 16, maxWidth: 900, width: '100%', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'relative', background: '#0A0A0A', padding: 16 }}>
              <img src={selected.src} alt={selected.title} style={{ width: '100%', maxHeight: 500, objectFit: 'contain' }} />
              <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: `${catColors[selected.category] || '#3B82F6'}20`, border: `1px solid ${catColors[selected.category] || '#3B82F6'}40`, color: catColors[selected.category] || '#3B82F6', display: 'inline-block', marginBottom: 12 }}>{selected.category}</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{selected.title}</h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.8 }}>{selected.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
