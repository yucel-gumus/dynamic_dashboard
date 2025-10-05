import type { LucideIcon } from 'lucide-react';

export interface KpiItem {
  id: string;
  title: string;
  value: string;
  unit: string;
  change: string;
  icon: LucideIcon;
  color: string;
  bgColor?: string;
  trend?: 'up' | 'down';
}

export interface WidgetConfig {
  id: string;
  title: string;
  type: 'kpi' | 'chart' | 'table';
  description?: string;
  defaultVisible?: boolean;
  tags?: string[];
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}
