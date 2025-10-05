import seedData from '@/data/seed.json';

export interface KpiData {
  id: string;
  title: string;
  value: number;
  unit: string;
  delta: number;
}

export interface SeriesPoint {
  time: string;
  timestamp: string;
  [key: string]: number | string;
}

export interface SeriesData {
  name: string;
  points: [string, number][];
}

export interface GaugeData {
  current: number;
  max: number;
  unit: string;
}

export const getKpis = (): KpiData[] => {
  return seedData.kpis;
};

export const getKpiById = (id: string): KpiData | undefined => {
  return seedData.kpis.find((kpi) => kpi.id === id);
};

/**
 * Grafik serilerini tarih aralığına göre filtreler ve formatlar
 * Birden fazla gün seçildiğinde, her saat için günlerin ortalamasını alır
 * @param startDate - Başlangıç tarihi
 * @param endDate - Bitiş tarihi
 * @param intervalMinutes - Veri noktaları arası dakika aralığı (downsample için)
 */
export const getSeriesData = (
  startDate?: Date,
  endDate?: Date,
  intervalMinutes: number = 60
): SeriesPoint[] => {
  const series = seedData.series;

  if (!series || series.length === 0) {
    return [];
  }

  let allPoints = series[0].points.map((_, index) => {
    const timestamp = series[0].points[index][0];
    const point: SeriesPoint = {
      time: new Date(timestamp).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: String(timestamp),
    };

    series.forEach((s) => {
      const value = s.points[index]?.[1];
      if (typeof value === 'number') {
        point[s.name] = value;
      }
    });

    return point;
  });

  if (startDate && endDate) {
    allPoints = allPoints.filter((point) => {
      const pointDate = new Date(point.timestamp);
      return pointDate >= startDate && pointDate <= endDate;
    });

    const uniqueDays = new Set(
      allPoints.map((p) => new Date(p.timestamp).toISOString().split('T')[0])
    );

    if (uniqueDays.size > 1) {
      const hourlyGroups: { [hour: string]: SeriesPoint[] } = {};

      allPoints.forEach((point) => {
        const date = new Date(point.timestamp);
        const hour = date.getHours();
        const hourKey = String(hour).padStart(2, '0') + ':00';

        if (!hourlyGroups[hourKey]) {
          hourlyGroups[hourKey] = [];
        }
        hourlyGroups[hourKey].push(point);
      });

      allPoints = Object.keys(hourlyGroups)
        .sort()
        .map((hourKey) => {
          const pointsInHour = hourlyGroups[hourKey];
          const avgPoint: SeriesPoint = {
            time: hourKey,
            timestamp: pointsInHour[0].timestamp,
          };

          series.forEach((s) => {
            const values = pointsInHour
              .map((p) => p[s.name])
              .filter((v): v is number => typeof v === 'number');

            if (values.length > 0) {
              const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
              avgPoint[s.name] = Math.round(avg * 100) / 100;
            }
          });

          return avgPoint;
        });
    }
  }

  if (intervalMinutes > 0 && allPoints.length > 0) {
    const downsampledPoints: SeriesPoint[] = [];
    const intervalMs = intervalMinutes * 60 * 1000;

    let lastTimestamp = new Date(allPoints[0].timestamp).getTime();
    downsampledPoints.push(allPoints[0]);

    for (let i = 1; i < allPoints.length; i++) {
      const currentTimestamp = new Date(allPoints[i].timestamp).getTime();

      if (currentTimestamp - lastTimestamp >= intervalMs) {
        downsampledPoints.push(allPoints[i]);
        lastTimestamp = currentTimestamp;
      }
    }

    if (downsampledPoints[downsampledPoints.length - 1] !== allPoints[allPoints.length - 1]) {
      downsampledPoints.push(allPoints[allPoints.length - 1]);
    }

    return downsampledPoints;
  }

  return allPoints;
};


export const getSeriesNames = (): string[] => {
  return seedData.series.map((s) => s.name);
};


export const getDepartmentConsumption = (): { name: string; value: number }[] => {
  const series = seedData.series;

  return series.map((s) => {
    const total = s.points.reduce((sum, point) => {
      const value = point[1];
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
    return {
      name: s.name,
      value: Math.round(total * 100) / 100,
    };
  });
};


export const getCapacitiveGauge = (): GaugeData => {
  return seedData.gauge.capacitiveUsage;
};

export const getDefaultDateRange = (): { from: Date; to: Date } => {
  return {
    from: new Date('2025-09-26T00:00:00'),
    to: new Date('2025-09-28T23:59:59'),
  };
};
