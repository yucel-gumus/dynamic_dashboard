import { Cable, Fuel, Footprints, Flame, Waves, Zap, Dam, Droplet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const KPI_ICON_MAP: Record<string, LucideIcon> = {
  totalConsumption: Cable,
  topDebi: Fuel,
  carbonFootprint: Footprints,
  naturalGas: Flame,
  steamConsumption: Waves,
  electricityConsumption: Zap,
  hotWater: Dam,
  waterConsumption: Droplet,
  electricityProduction: Zap,
  electricPowerFactor: Zap,
  electricVoltage: Zap,
  electricCurrent: Zap,
  electricFrequency: Zap,
};

export const CHART_LINE_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#a4de6c',
  '#d0ed57',
  '#8dd1e1',
  '#d88884',
  '#ffa07a',
  '#9370db',
];

export const CAPACITIVE_COLORS = [
  { name: '0-10%', value: 10, fill: '#22c55e' },
  { name: '10-20%', value: 10, fill: '#65a30d' },
  { name: '20-30%', value: 10, fill: '#84cc16' },
  { name: '30-40%', value: 10, fill: '#a3e635' },
  { name: '40-50%', value: 10, fill: '#facc15' },
  { name: '50-60%', value: 10, fill: '#fbbf24' },
  { name: '60-70%', value: 10, fill: '#fb923c' },
  { name: '70-80%', value: 10, fill: '#f97316' },
  { name: '80-90%', value: 10, fill: '#ef4444' },
  { name: '90-100%', value: 10, fill: '#dc2626' },
];
