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
    title: 'Trade Volume Distribution',
    description: 'Distribution of total semiconductor trade volumes across all countries (2019–2022), showing heavy right-skew with a few dominant traders.',
    category: 'Trade Analysis',
  },
  {
    src: '/eda/image copy.png',
    title: 'Correlation Heatmap',
    description: 'Feature correlation matrix revealing strong interdependencies between disruption index, dependency score, and conflict ratio.',
    category: 'Correlations',
  },
  {
    src: '/eda/image copy 2.png',
    title: 'Risk Score Distribution',
    description: 'Distribution of risk scores across the semiconductor supply chain network, with clear clustering around Low and Medium risk bands.',
    category: 'Risk Analysis',
  },
  {
    src: '/eda/image copy 3.png',
    title: 'Feature Importance (GraphSAGE)',
    description: 'Top predictive features identified by the GraphSAGE model. Disruption index and dependency score are the strongest risk drivers.',
    category: 'Feature Analysis',
  },
  {
    src: '/eda/image copy 4.png',
    title: 'Trade Trend Analysis (2019–2022)',
    description: 'Year-over-year trade volume trends showing the COVID-19 shock in 2020 and subsequent recovery acceleration through 2022.',
    category: 'Trade Analysis',
  },
  {
    src: '/eda/image copy 5.png',
    title: 'ROC Curve — GraphSAGE Model',
    description: 'Receiver Operating Characteristic curves for multi-class risk classification. Model achieves AUC > 0.985 across all risk classes.',
    category: 'Model Evaluation',
  },
  {
    src: '/eda/image copy 6.png',
    title: 'Confusion Matrix',
    description: 'Classification confusion matrix for GraphSAGE predictions. High accuracy in Low and Medium risk classification; some overlap at High risk boundary.',
    category: 'Model Evaluation',
  },
  {
    src: '/eda/image copy 7.png',
    title: 'Volatility vs Disruption',
    description: 'Scatter analysis of volatility scores against disruption indices, revealing a non-linear relationship for high-dependency economies.',
    category: 'Risk Analysis',
  },
  {
    src: '/eda/image copy 8.png',
    title: 'COVID Impact by Country',
    description: 'Country-level analysis of COVID-19 trade impact (2020 drop %) versus recovery rate (2021–2022 growth %). India and Poland show strongest recoveries.',
    category: 'Trade Analysis',
  },
  {
    src: '/eda/image copy 9.png',
    title: 'GNN Probability Distributions',
    description: 'Output probability distributions from the Graph Neural Network across Low, Medium, and High risk classes for 2022 predictions.',
    category: 'Feature Analysis',
  },
  {
    src: '/eda/image.png',
    title: 'Supply Chain Network Graph',
    description: 'Graph representation of the semiconductor supply chain network used as input to the GraphSAGE model, with node features mapped to risk metrics.',
    category: 'Risk Analysis',
  },
];

export const ML_IMAGES = [
  {
    src: '/ml/ml1.png',
    title: 'GraphSAGE Model Training Results',
    description: 'Final GraphSAGE v2 training convergence, showing accuracy and loss curves across training epochs with early stopping at optimal checkpoint.',
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
