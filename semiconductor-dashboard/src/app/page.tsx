'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CovidImpactAnalytics from '@/components/CovidImpactAnalytics';
import ResearchInsights from '@/components/ResearchInsights';
import ExecutiveRecommendations from '@/components/ExecutiveRecommendations';

const ExecutiveOverview = dynamic(() => import('@/components/ExecutiveOverview'), { ssr: false });
const GlobalTradeNetwork = dynamic(() => import('@/components/GlobalTradeNetwork'), { ssr: false });
const RiskIntelligenceCenter = dynamic(() => import('@/components/RiskIntelligenceCenter'), { ssr: false });
const AIRiskEngine = dynamic(() => import('@/components/AIRiskEngine'), { ssr: false });
const CountryDigitalTwin = dynamic(() => import('@/components/CountryDigitalTwin'), { ssr: false });
const EDAExplorer = dynamic(() => import('@/components/EDAExplorer'), { ssr: false });

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState('China');

  return (
    <main style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <Navigation />
      <HeroSection />
      <ExecutiveOverview />
      <GlobalTradeNetwork selectedCountry={selectedCountry} onSelectCountry={setSelectedCountry} />
      <RiskIntelligenceCenter onSelectCountry={setSelectedCountry} />
      <CovidImpactAnalytics />
      <AIRiskEngine selectedCountry={selectedCountry} />
      <CountryDigitalTwin selectedCountry={selectedCountry} onSelectCountry={setSelectedCountry} />
      <EDAExplorer />
      <ResearchInsights />
      <ExecutiveRecommendations />
    </main>
  );
}
