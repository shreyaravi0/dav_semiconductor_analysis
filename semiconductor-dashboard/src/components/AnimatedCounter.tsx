'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function AnimatedCounter({
  end, duration = 2000, prefix = '', suffix = '', decimals = 0, className = ''
}: AnimatedCounterProps) {
  const [value, setValue] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!inView) return;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, end, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  );
}
