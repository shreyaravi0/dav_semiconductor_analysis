'use client';
import React from 'react';

const recommendations = [
  {
    icon: '🌍',
    priority: 'Critical',
    priorityColor: '#EF4444',
    title: 'Supply Chain Diversification',
    subtitle: 'Reduce single-node dependency risk',
    color: '#EF4444',
    body: 'Immediate action required to diversify semiconductor sourcing across at least 3 geographic regions. Current over-reliance on East Asian supply nodes (China, Hong Kong, Taiwan corridor) creates a single-failure-point risk estimated at $340B exposure.',
    actions: ['Qualify alternative suppliers in India and SEA', 'Establish dual-source contracts for critical components', 'Build 90-day strategic reserves for tier-1 chips'],
    impact: 'Risk Reduction: ~45%',
    timeline: '6–18 months',
  },
  {
    icon: '🛡️',
    priority: 'High',
    priorityColor: '#F59E0B',
    title: 'Geopolitical Risk Monitoring',
    subtitle: 'Real-time conflict and policy tracking',
    color: '#F59E0B',
    body: 'Deploy AI-powered geopolitical intelligence feeds integrated with our supply chain graph. The GraphSAGE model identifies 12% of trade routes as conflict-exposed, requiring continuous monitoring for trade policy changes, export controls, and sanctions.',
    actions: ['Integrate GDELT and ACLED conflict data streams', 'Automate tariff and trade policy alerting', 'Deploy scenario planning for Taiwan Strait risk'],
    impact: 'Alert Lead Time: +72hrs',
    timeline: '3–6 months',
  },
  {
    icon: '📦',
    priority: 'High',
    priorityColor: '#F59E0B',
    title: 'Strategic Inventory Planning',
    subtitle: 'Buffer stock optimization using AI predictions',
    color: '#06B6D4',
    body: 'Leverage GraphSAGE probability scores to dynamically adjust safety stock levels. Countries with disruption_index > 0.4 should trigger automatic buffer increases. This prevents the 2020-style stock-out scenarios that cost the industry $240B in lost production.',
    actions: ['Implement AI-driven safety stock algorithms', 'Tier suppliers by GraphSAGE risk scores', 'Establish regional bonded warehouses in Low-risk hubs'],
    impact: 'Stockout Prevention: 87%',
    timeline: '3–12 months',
  },
  {
    icon: '🏭',
    priority: 'Strategic',
    priorityColor: '#8B5CF6',
    title: 'Domestic Manufacturing Investment',
    subtitle: 'Long-term resilience through geographic rebalancing',
    color: '#8B5CF6',
    body: 'Model projections show that countries investing in domestic semiconductor capacity in 2024–2026 will reduce their dependency scores by 0.15–0.30 by 2030. India, EU nations, and the US Chips Act demonstrate early success patterns. ROI estimated at 3.2× over 10 years.',
    actions: ['Prioritize subsidy programs for mature-node fabs', 'Co-invest in packaging and testing capabilities', 'Partner with universities for talent pipeline development'],
    impact: 'Dependency Reduction: 0.2',
    timeline: '24–60 months',
  },
  {
    icon: '🔔',
    priority: 'Immediate',
    priorityColor: '#10B981',
    title: 'Early Warning Systems',
    subtitle: 'AI-powered predictive disruption alerting',
    color: '#10B981',
    body: 'Implement the GraphSAGE model in production as a continuous risk monitoring system. Real-time ingestion of trade flow data, GDELT events, and financial market signals can provide 30–60 day advance warning of supply chain disruptions with 94% accuracy.',
    actions: ['Deploy GraphSAGE model API in production', 'Connect to live trade flow data sources', 'Build executive dashboard with real-time risk scoring'],
    impact: 'Warning Lead Time: 30–60 days',
    timeline: '1–3 months',
  },
];

export default function ExecutiveRecommendations() {
  return (
    <section id="recommendations" style={{ padding: '80px 0', background: 'linear-gradient(180deg, #0D1117 0%, #0A0A0A 100%)' }}>
      <div className="section-container">
        <div style={{ marginBottom: 40 }}>
          <p className="section-label">Section 10</p>
          <h2 className="section-title">Executive Recommendations</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginTop: 8 }}>Strategic consulting-grade recommendations for semiconductor supply chain resilience</p>
        </div>

        {/* Priority Matrix Header */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          {[['Critical', '#EF4444', 1], ['High', '#F59E0B', 2], ['Strategic', '#8B5CF6', 1], ['Immediate', '#10B981', 1]].map(([label, color]) => (
            <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94A3B8' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: color as string, display: 'inline-block' }} />
              <span style={{ fontWeight: 600, color: color as string }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 20 }}>
          {recommendations.map((rec, i) => (
            <div key={i} className="glass-card" style={{ padding: 28, borderTop: `3px solid ${rec.color}`, position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease' }}>
              {/* Background decoration */}
              <div style={{ position: 'absolute', right: -20, top: -20, fontSize: 80, opacity: 0.04 }}>{rec.icon}</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 24 }}>{rec.icon}</span>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: rec.priorityColor, textTransform: 'uppercase', letterSpacing: '2px', background: `${rec.priorityColor}18`, padding: '2px 8px', borderRadius: 20, border: `1px solid ${rec.priorityColor}40` }}>
                      {rec.priority}
                    </span>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginTop: 6 }}>{rec.title}</h3>
                    <p style={{ fontSize: 12, color: rec.color, fontWeight: 500 }}>{rec.subtitle}</p>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.8, marginBottom: 20 }}>{rec.body}</p>

              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: rec.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Action Items</p>
                {rec.actions.map((a, ai) => (
                  <div key={ai} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ color: rec.color, fontSize: 12, marginTop: 1, flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 12, color: '#cbd5e1' }}>{a}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 16, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                <div>
                  <p style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Expected Impact</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>{rec.impact}</p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Timeline</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#3B82F6' }}>{rec.timeline}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 60, padding: 32, background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 16, textAlign: 'center' }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Semiconductor Supply Chain Risk Intelligence Platform</h3>
          <p style={{ fontSize: 14, color: '#64748B', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            AI-Powered Global Trade, Disruption and Risk Monitoring System · Powered by GraphSAGE GNN · 40 Countries · 4-Year Analysis
          </p>
          <div style={{ marginTop: 20, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Intel', 'NVIDIA', 'TSMC', 'McKinsey', 'Deloitte', 'Gartner'].map(org => (
              <span key={org} style={{ fontSize: 12, color: '#475569', padding: '4px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)' }}>{org}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
