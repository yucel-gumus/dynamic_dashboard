import { useMemo } from 'react';
import { getKpiById } from '@/services/dataService';
import { KPI_ICON_MAP } from '@/constants/icons';
import { Zap } from 'lucide-react';
import type { KpiItem } from '@/types';

const formatKpiValue = (value: number, isPercentage: boolean = false): string => {
  if (isPercentage) {
    return value.toLocaleString('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
  const formatted = value.toFixed(2).replace('.', ',');
  return formatted;
};

export const useKpiData = (id: string): KpiItem | null => {
  return useMemo(() => {
    const kpi = getKpiById(id);
    if (!kpi) return null;

    const trend = kpi.delta < 0 ? 'down' : 'up';
    const icon = KPI_ICON_MAP[id] || Zap;

    return {
      id: kpi.id,
      title: kpi.title,
      value: formatKpiValue(kpi.value),
      unit: kpi.unit,
      change: `${formatKpiValue(Math.abs(kpi.delta), true)}%`,
      icon,
      color: 'text-white',
      bgColor: 'bg-custom-cyan',
      trend,
    };
  }, [id]);
};
