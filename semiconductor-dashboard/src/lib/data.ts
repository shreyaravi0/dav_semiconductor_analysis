import Papa from 'papaparse';
import { T1Row, T2Row, T3Row, T4Row, T5Row, T6Row, EDAImage } from './types';

async function fetchCSV<T>(path: string): Promise<T[]> {
  const res = await fetch(path);
  const text = await res.text();
  const result = Papa.parse<T>(text, { header: true, dynamicTyping: true, skipEmptyLines: true });
  return result.data;
}

export async function loadT1(): Promise<T1Row[]> {
  return fetchCSV<T1Row>('/data/T1_main.csv');
}

export async function loadT2(): Promise<T2Row[]> {
  return fetchCSV<T2Row>('/data/T2_trend.csv');
}

export async function loadT3(): Promise<T3Row[]> {
  return fetchCSV<T3Row>('/data/T3_country_summary.csv');
}

export async function loadT4(): Promise<T4Row[]> {
  return fetchCSV<T4Row>('/data/T4_phase_risk.csv');
}

export async function loadT5(): Promise<T5Row[]> {
  return fetchCSV<T5Row>('/data/T5_gnn_2022.csv');
}

export async function loadT6(): Promise<T6Row[]> {
  return fetchCSV<T6Row>('/data/T6_top10_timeline.csv');
}

export const EDA_IMAGES: EDAImage[] = [
  {
    src: '/eda/1.png',
    title: 'Global Semiconductor Trade Trend (2019–2022)',
    description: 'Year-over-year global trade volume trend showing a slight decline in 2020 due to the COVID-19 pandemic shock, followed by a sharp acceleration and recovery through 2022.',
    category: 'Trade Analysis',
  },
  {
    src: '/eda/image.png',
    title: 'Import vs Export Trade Balance',
    description: 'Comparison of global import and export volumes from 2019 to 2022, highlighting the shift in trade flows and the overall expansion of the global semiconductor market.',
    category: 'Trade Analysis',
  },
  {
    src: '/eda/image copy.png',
    title: 'Top Countries in Semiconductor Trade',
    description: 'Distribution of total semiconductor trade volumes across the leading countries (2019–2022), highlighting the heavy concentration of trade in China, Hong Kong, and other East Asian hubs.',
    category: 'Trade Analysis',
  },
  {
    src: '/eda/image copy 2.png',
    title: 'Year-wise Imports for Top Countries',
    description: 'Breakdown of semiconductor import volumes for key trading nations from 2019 to 2022, illustrating shifting dependency patterns and regional demand growth.',
    category: 'Trade Analysis',
  },
  {
    src: '/eda/image copy 3.png',
    title: 'Supply Chain Stage Impact Analysis',
    description: 'Trend analysis of trade volumes across different components of the semiconductor supply chain: raw fabrication equipment, active silicon chips, and completed consumer devices.',
    category: 'Feature Analysis',
  },
  {
    src: '/eda/image copy 4.png',
    title: 'Bilateral Trade Volume Heatmap',
    description: 'Comprehensive heatmap indicating the annual trade volume intensity for all countries from 2019 to 2022, showing major trade concentrations.',
    category: 'Trade Analysis',
  },
  {
    src: '/eda/image copy 5.png',
    title: 'Import Trajectories of Leading Nations',
    description: 'Semiconductor import trends (2019–2022) for the top importing countries, showing resilience profiles and post-COVID demand surges.',
    category: 'Trade Analysis',
  },
  {
    src: '/eda/image copy 6.png',
    title: 'Export Trajectories of Leading Nations',
    description: 'Semiconductor export trends (2019–2022) for the top exporting countries, revealing structural supply-side shifts and manufacturing dominance.',
    category: 'Trade Analysis',
  },
  {
    src: '/eda/image copy 7.png',
    title: 'Year-wise Exports for Top Countries',
    description: 'Breakdown of semiconductor export volumes for key trading nations from 2019 to 2022, illustrating shifting global supply networks.',
    category: 'Trade Analysis',
  },
  {
    src: '/eda/image copy 8.png',
    title: 'COVID Shock and Recovery Heatmap',
    description: 'Heatmap showing the percentage impact of the 2020 COVID-19 shock on semiconductor trade and the subsequent annual growth rates across major economies through 2022.',
    category: 'Risk Analysis',
  },
  {
    src: '/eda/image copy 9.png',
    title: 'Semiconductor Trade Dependency Matrix',
    description: 'Bilateral trade dependency matrix mapping reporter countries to their trade partners, identifying critical single-point vulnerabilities and supply chain linkages.',
    category: 'Correlations',
  },
];

export const ML_IMAGES = [
  {
    src: '/ml/ml1.png',
    title: 'GNN Model Evaluation (GCN vs GAT vs GraphSAGE)',
    description: 'Comparative performance evaluation of Graph Convolutional Network (GCN), Graph Attention Network (GAT), and GraphSAGE models, showing training/validation accuracy curves and prediction confusion matrices.',
  },
];

// Computed statistics
export const HERO_STATS = {
  totalTradeVolume: '$2.1T',
  numCountries: 40,
  avgDisruption: 0.24,
  avgGrowth: 4.8,
  mediumRiskCountries: 7,
  graphsageAccuracy: 94,
  rocAuc: 0.985,
};

export const GRAPHSAGE_METRICS = {
  accuracy: 94,
  precision: 92.5,
  recall: 91.8,
  f1Score: 92.1,
  rocAuc: 0.985,
};

export function getRiskColor(risk: string): string {
  if (risk === 'High') return '#EF4444';
  if (risk === 'Medium') return '#F59E0B';
  return '#10B981';
}

export function getRiskBg(risk: string): string {
  if (risk === 'High') return 'rgba(239,68,68,0.15)';
  if (risk === 'Medium') return 'rgba(245,158,11,0.15)';
  return 'rgba(16,185,129,0.15)';
}

export function formatBillions(val: number): string {
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}T`;
  if (val >= 1) return `$${val.toFixed(1)}B`;
  return `$${(val * 1000).toFixed(0)}M`;
}
