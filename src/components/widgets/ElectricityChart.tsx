import { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X, Minimize2, Maximize2, RotateCw } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getSeriesData, getSeriesNames, getDefaultDateRange } from '@/services/dataService';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CustomTooltip } from '@/components/ui/CustomTooltip';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { IntervalSelector, type IntervalOption } from '@/components/ui/IntervalSelector';
import { CHART_LINE_COLORS } from '@/constants/icons';

interface ElectricityChartProps {
  widgetId?: string;
}

type DataTransformMode = 'raw' | 'ma5' | 'ma10';

// Portrait (dikey) mod kontrolü
const useIsPortrait = () => {
  const [isPortrait, setIsPortrait] = useState(
    typeof window !== 'undefined' && window.innerWidth < 640 && window.innerHeight > window.innerWidth
  );

  useEffect(() => {
    const handleResize = () => {
      const portrait = window.innerWidth < 640 && window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return isPortrait;
};

/**
 * Moving average hesaplama fonksiyonu - component dışında tanımlanarak performans artırıldı
 * @param data - Veri noktaları
 * @param windowSize - Ortalama penceresi boyutu
 * @param seriesNames - Seri isimleri
 */
const applyMovingAverage = (data: any[], windowSize: number, seriesNames: string[]) => {
  if (data.length < windowSize) return data;

  return data.map((point, index) => {
    const newPoint = { ...point };

    seriesNames.forEach((series) => {
      let sum = 0;
      let count = 0;

      for (let i = Math.max(0, index - windowSize + 1); i <= index; i++) {
        const value = data[i][series];
        if (typeof value === 'number') {
          sum += value;
          count++;
        }
      }

      newPoint[series] = count > 0 ? sum / count : point[series];
    });

    return newPoint;
  });
};

export const ElectricityChart = ({ widgetId }: ElectricityChartProps) => {
  const defaultRange = useMemo(() => getDefaultDateRange(), []);
  const [dateRange, setDateRange] = useState(defaultRange);
  const [interval, setInterval] = useState<IntervalOption>('60');
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
  const [dataMode, setDataMode] = useState<DataTransformMode>('raw');
  
  const isPortrait = useIsPortrait(); // Mobil portrait kontrolü

  const { isEditMode, minimizedWidgets, toggleMinimize, toggleWidget } = useDashboardStore();
  const isMinimized = widgetId ? minimizedWidgets.includes(widgetId) : false;

  const rawData = useMemo(() => {
    return getSeriesData(dateRange.from, dateRange.to, parseInt(interval));
  }, [dateRange, interval]);

  const seriesNames = useMemo(() => getSeriesNames(), []);

  const electricityData = useMemo(() => {
    if (dataMode === 'ma5') {
      return applyMovingAverage(rawData, 5, seriesNames);
    } else if (dataMode === 'ma10') {
      return applyMovingAverage(rawData, 10, seriesNames);
    }
    return rawData;
  }, [rawData, dataMode, seriesNames]);

  const handleLegendClick = (dataKey: string) => {
    setHiddenSeries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dataKey)) {
        newSet.delete(dataKey);
      } else {
        newSet.add(dataKey);
      }
      return newSet;
    });
  };

  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div
        className="flex flex-wrap gap-3 justify-start items-center px-2 py-2 overflow-x-auto"
        role="group"
        aria-label="Grafik serileri"
      >
        {payload.map((entry: any, index: number) => {
          const isHidden = hiddenSeries.has(entry.value);
          return (
            <button
              key={`legend-${index}`}
              onClick={() => handleLegendClick(entry.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLegendClick(entry.value);
                }
              }}
              className="flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-custom-cyan focus:ring-offset-1 rounded px-1"
              style={{
                opacity: isHidden ? 0.4 : 1,
                textDecoration: isHidden ? 'line-through' : 'none',
                transition: 'all 0.2s ease',
              }}
              tabIndex={0}
              aria-label={`${entry.value} serisi - ${isHidden ? 'gizli' : 'görünür'}. Değiştirmek için tıklayın.`}
              aria-pressed={!isHidden}
            >
              <svg width="8" height="8" style={{ marginRight: 4 }}>
                <circle cx="4" cy="4" r="4" fill={entry.color} />
              </svg>
              <span className="text-[10px]">{entry.value}</span>
            </button>
          );
        })}
      </div>
    );
  };

  // Portrait modda otomatik minimize (landscape'de açık)
  if (isPortrait) {
    return (
      <Card className="relative h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700">
        <div className="text-center p-6">
          <div className="mb-4 flex justify-center">
            <div className="bg-custom-cyan/10 p-4 rounded-full">
              <RotateCw className="w-12 h-12 text-custom-cyan animate-pulse" />
            </div>
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">Elektrik Tüketimi Grafiği</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            Grafiği görüntülemek için
          </p>
          <p className="text-base font-semibold text-custom-cyan mb-3">
            📱 Ekranınızı yan çevirin
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Landscape modda tüm özelliklerle görüntüleyebilirsiniz
          </p>
        </div>
      </Card>
    );
  }

  if (isMinimized) {
    return (
      <Card className="relative h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Elektrik Tüketimi</h2>
          {widgetId && (
            <button
              onClick={() => toggleMinimize(widgetId)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Genişlet"
            >
              <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative h-[450px] md:h-[500px] lg:h-[450px] flex flex-col">
      {isEditMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            widgetId && toggleWidget(widgetId);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 cursor-pointer hover:opacity-80 transition-opacity z-10 bg-custom-cyan rounded-full p-1 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Elektrik Tüketimi widget'ını kaldır"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      )}
      {widgetId && (
        <div className="absolute top-3 left-3 cursor-pointer hover:opacity-80 transition-opacity z-10">
          <button
            onClick={() => toggleMinimize(widgetId)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            aria-label="Küçült"
          >
            <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}
      <CardHeader className="flex flex-col gap-3 pr-4 pl-4 md:pr-8 md:pl-8 lg:pr-12 lg:pl-12 flex-shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="font-semibold text-gray-900 dark:text-white">Elektrik Tüketimi</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            <IntervalSelector interval={interval} onIntervalChange={setInterval} />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Veri Görünümü:</span>
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setDataMode('raw')}
              className={`px-2 sm:px-3 py-1 text-xs rounded transition-colors ${
                dataMode === 'raw'
                  ? 'bg-custom-cyan text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              aria-label="Ham veri görünümü"
              aria-pressed={dataMode === 'raw'}
            >
              Ham Veri
            </button>
            <button
              onClick={() => setDataMode('ma5')}
              className={`px-2 sm:px-3 py-1 text-xs rounded transition-colors ${
                dataMode === 'ma5'
                  ? 'bg-custom-cyan text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              aria-label="5 noktalı hareketli ortalama"
              aria-pressed={dataMode === 'ma5'}
            >
              5 Nokta
            </button>
            <button
              onClick={() => setDataMode('ma10')}
              className={`px-2 sm:px-3 py-1 text-xs rounded transition-colors ${
                dataMode === 'ma10'
                  ? 'bg-custom-cyan text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              aria-label="10 noktalı hareketli ortalama"
              aria-pressed={dataMode === 'ma10'}
            >
              10 Nokta
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div style={{ width: '100%', height: '100%' }} role="img" aria-label="Elektrik tüketimi zaman serisi grafiği">
          <ResponsiveContainer>
            <LineChart data={electricityData} margin={{ top: 30, right: 10, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={50}
                interval="preserveStartEnd"
                minTickGap={20}
              />
              <YAxis
                type="number"
                tick={{ fontSize: 12 }}
                domain={[0, 280]}
                ticks={[0, 70, 140, 210, 280]}
                interval={0}
                tickFormatter={(value) => `${value}\nkWh`}
                allowDataOverflow={false}
                scale="linear"
              />
              <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} />
              <Legend
                content={renderCustomLegend}
                wrapperStyle={{
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
                verticalAlign="bottom"
              />
              {seriesNames.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={CHART_LINE_COLORS[index % CHART_LINE_COLORS.length]}
                  strokeWidth={2}
                  dot={{
                    fill: 'white',
                    stroke: CHART_LINE_COLORS[index % CHART_LINE_COLORS.length],
                    strokeWidth: 2,
                    r: 4
                  }}
                  activeDot={{ r: 6 }}
                  hide={hiddenSeries.has(name)}
                  strokeOpacity={hiddenSeries.has(name) ? 0.3 : 1}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
