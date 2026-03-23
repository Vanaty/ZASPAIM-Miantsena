export const lightTheme = {
  background: '#ffffff',
  surface: '#f8fafc',
  card: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
  primary: '#2563eb',
  primaryLight: '#dbeafe',
  accent: '#10b981',
  border: '#e2e8f0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  searchBackground: '#f1f5f9',
  chipBackground: '#f1f5f9',
  chipSelected: '#2563eb',
  chipText: '#475569',
  chipSelectedText: '#ffffff',
};

export const darkTheme = {
  background: '#0f172a',
  surface: '#1e293b',
  card: '#334155',
  text: '#f8fafc',
  textSecondary: '#cbd5e1',
  primary: '#3b82f6',
  primaryLight: '#1e40af',
  accent: '#34d399',
  border: '#475569',
  shadow: 'rgba(0, 0, 0, 0.3)',
  searchBackground: '#475569',
  chipBackground: '#475569',
  chipSelected: '#3b82f6',
  chipText: '#cbd5e1',
  chipSelectedText: '#ffffff',
};

export type Theme = typeof lightTheme;