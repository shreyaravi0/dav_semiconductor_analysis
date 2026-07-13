'use client';
import React from 'react';
import { getRiskColor } from '@/lib/data';

interface RiskBadgeProps {
  risk: string;
  size?: 'sm' | 'md';
}

export default function RiskBadge({ risk, size = 'md' }: RiskBadgeProps) {
  const color = getRiskColor(risk);
  const cls = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${cls}`}
      style={{
        background: `${color}18`,
        border: `1px solid ${color}50`,
        color: color,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {risk}
    </span>
  );
}
