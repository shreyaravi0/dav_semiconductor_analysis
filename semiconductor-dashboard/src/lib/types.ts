export type RiskCategory = 'Low' | 'Medium' | 'High';

export interface T1Row {
  refYear: number;
  country: string;
  country_tableau: string;
  imports: number;
  exports: number;
  total_trade: number;
  imports_B: number;
  exports_B: number;
  total_trade_B: number;
  yoy_pct: number;
  disruption_index: number;
  volatility_score: number;
  dependency_score: number;
  conflict_ratio: number;
  risk_category: RiskCategory;
  confidence_pct: number;
  prob_low: number;
  prob_medium: number;
  prob_high: number;
  phase: string;
  phase_order: number;
  risk_score: number;
}

export interface T2Row {
  refYear: number;
  phase: string;
  phase_order: number;
  risk_category: RiskCategory;
  n_countries: number;
  avg_disruption: number;
  total_trade_B: number;
  avg_yoy_pct: number;
  avg_confidence_pct: number;
  avg_volatility: number;
}

export interface T3Row {
  country: string;
  country_tableau: string;
  risk_2022: RiskCategory;
  confidence_2022: number;
  disruption_2022: number;
  total_trade_B_2022: number;
  avg_disruption: number;
  max_disruption: number;
  avg_trade_B: number;
  volatility_score: number;
  avg_yoy_pct: number;
  covid_drop_pct: number;
  recovery_pct: number;
  dependency_score: number;
  risk_score: number;
}

export interface T4Row {
  phase: string;
  phase_order: number;
  risk_category: RiskCategory;
  n_countries: number;
  avg_disruption: number;
  avg_volatility: number;
  avg_dependency: number;
  avg_trade_B: number;
  avg_yoy_pct: number;
  avg_conflict: number;
}

export interface T5Row {
  country: string;
  country_tableau: string;
  total_trade_B: number;
  imports_B: number;
  exports_B: number;
  disruption_index: number;
  volatility_score: number;
  dependency_score: number;
  conflict_ratio: number;
  risk_category: RiskCategory;
  confidence_pct: number;
  prob_low_pct: number;
  prob_medium_pct: number;
  prob_high_pct: number;
  yoy_pct: number;
  risk_score: number;
}

export interface T6Row {
  country: string;
  country_tableau: string;
  refYear: number;
  phase: string;
  disruption_index: number;
  total_trade_B: number;
  yoy_pct: number;
  risk_category: RiskCategory;
  volatility_score: number;
}

export interface EDAImage {
  src: string;
  title: string;
  description: string;
  category: 'Correlations' | 'Feature Analysis' | 'Trade Analysis' | 'Model Evaluation' | 'Risk Analysis';
}

export interface DashboardState {
  selectedCountry: string;
  setSelectedCountry: (c: string) => void;
}
