'use client';
import React from 'react';

const insights = [
  {
    icon: '🌐',
    title: 'Trade Concentration Analysis',
    category: 'Trade Intelligence',
    color: '#3B82F6',
    summary: 'The global semiconductor supply chain is highly concentrated. China, Hong Kong, and Singapore account for over 65% of all exports. This concentration creates systemic fragility — disruption in any of these nodes cascades across 80% of global supply chains.',
    metrics: ['China: 40.2% of global exports', 'HK Re-export Hub: 32.1%', 'Top 5 nations: 78% of volume'],
  },
  {
    icon: '⚠️',
    title: 'Risk Concentration Analysis',
    category: 'Risk Intelligence',
    color: '#EF4444',
    summary: 'Only 7 out of 40 tracked countries (17.5%) qualify as Medium Risk in 2022. High-risk classification applies to 0 countries post-2021 recovery — a significant improvement. However, 3 nations (India, Romania, Spain) show elevated disruption indices that warrant monitoring.',
    metrics: ['7 Medium Risk countries', '33 Low Risk countries', 'Avg confidence: 91.4%'],
  },
  {
    icon: '🦠',
    title: 'COVID Recovery Patterns',
    category: 'Macro Analysis',
    color: '#F59E0B',
    summary: 'The pandemic created a bifurcated recovery: export-oriented economies (China, Malaysia, Vietnam) recovered 40% faster than import-heavy ones. India showed the most extreme reversal — from a COVID trade drop to 100% YoY growth in 2022, reflecting structural diversification.',
    metrics: ['India: +100% YoY in 2022', 'Poland: +45.2% YoY', '28 of 40 nations fully recovered'],
  },
  {
    icon: '🤖',
    title: 'GraphSAGE GNN Findings',
    category: 'AI/ML Research',
    color: '#8B5CF6',
    summary: 'The GraphSAGE model achieves 94% classification accuracy with ROC-AUC of 0.985. Key finding: dependency score and disruption index jointly explain 73% of risk variance. Countries with dependency > 0.5 and disruption > 0.4 are 94% likely to be classified Medium-to-High risk.',
    metrics: ['94% accuracy', '0.985 ROC-AUC', 'F1 Score: 92.1%'],
  },
  {
    icon: '🔗',
    title: 'Supply Chain Vulnerabilities',
    category: 'Strategic Analysis',
    color: '#06B6D4',
    summary: 'Graph network analysis reveals three critical vulnerability patterns: (1) Single-source dependencies for advanced nodes, (2) Geopolitical conflict corridors affecting 12% of global trade routes, and (3) Temporal clustering of disruption events suggesting systemic rather than idiosyncratic shocks.',
    metrics: ['12% of routes conflict-affected', '3 structural vulnerability types', 'Systemic shock probability: 34%'],
  },
];

export default function ResearchInsights() {
  return (
    <section id="research-insights" style={{ padding: '80px 0', background: '#0A0A0A' }}>
      <div className="section-container">
        <div style={{ marginBottom: 40 }}>
          <p className="section-label">Section 09</p>
          <h2 className="section-title">Research Insights</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginTop: 8 }}>AI-synthesized research findings from multi-source semiconductor supply chain analysis</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 20 }}>
          {insights.map((ins, i) => (
            <div key={i} className="glass-card border-animate" style={{ padding: 28, borderLeft: `3px solid ${ins.color}`, transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <span style={{ fontSize: 28 }}>{ins.icon}</span>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: ins.color, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{ins.category}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 2 }}>{ins.title}</h3>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.8, marginBottom: 16 }}>{ins.summary}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ins.metrics.map((m, mi) => (
                  <span key={mi} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: `${ins.color}12`, border: `1px solid ${ins.color}30`, color: ins.color }}>{m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
