import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chipshield | AI-Powered Semiconductor Supply Chain Risk Intelligence',
  description: 'Executive-level semiconductor supply chain risk intelligence dashboard powered by GraphSAGE Graph Neural Networks. Monitor global trade flows, disruption indices, and AI-driven risk predictions across 40 countries (2019–2022).',
  keywords: 'semiconductor, supply chain, risk intelligence, GraphSAGE, GNN, trade analytics, disruption monitoring',
  openGraph: {
    title: 'Chipshield',
    description: 'AI-Powered Global Trade, Disruption and Risk Monitoring System',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#0A0A0A' }}>
        {children}
      </body>
    </html>
  );
}
