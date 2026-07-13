'use client';
import React, { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle system
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    // Major trade hub coordinates (lon/lat mapped to canvas)
    const hubs = [
      { label: 'USA', x: 0.18, y: 0.38 },
      { label: 'China', x: 0.75, y: 0.37 },
      { label: 'Japan', x: 0.81, y: 0.35 },
      { label: 'Germany', x: 0.50, y: 0.28 },
      { label: 'S.Korea', x: 0.80, y: 0.33 },
      { label: 'Singapore', x: 0.76, y: 0.50 },
      { label: 'Malaysia', x: 0.75, y: 0.52 },
      { label: 'Taiwan', x: 0.80, y: 0.41 },
      { label: 'UK', x: 0.47, y: 0.26 },
      { label: 'India', x: 0.67, y: 0.46 },
    ];

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(59,130,246,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,130,246,${p.alpha})`;
        ctx.fill();
      });

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${0.06 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw trade hub nodes
      hubs.forEach((hub, idx) => {
        const x = hub.x * canvas.width;
        const y = hub.y * canvas.height;
        const pulse = Math.sin(frame * 0.03 + idx * 0.8) * 0.5 + 0.5;

        // Outer glow
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 20 + pulse * 10);
        grad.addColorStop(0, 'rgba(59,130,246,0.3)');
        grad.addColorStop(1, 'rgba(59,130,246,0)');
        ctx.beginPath();
        ctx.arc(x, y, 20 + pulse * 10, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,130,246,${0.7 + pulse * 0.3})`;
        ctx.fill();

        // Trade arcs between hubs
        if (idx > 0) {
          const prev = hubs[idx - 1];
          const px = prev.x * canvas.width;
          const py = prev.y * canvas.height;
          const cp = { x: (x + px) / 2, y: Math.min(y, py) - 40 };
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.quadraticCurveTo(cp.x, cp.y, x, y);
          ctx.strokeStyle = `rgba(6,182,212,${0.06 + pulse * 0.04})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      frame++;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="hero-canvas" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />;
}
