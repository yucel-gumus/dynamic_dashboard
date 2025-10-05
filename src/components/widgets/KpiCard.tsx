import { TrendingUp, TrendingDown, X, Minimize2, Maximize2 } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { Card, CardContent } from '@/components/ui/Card';
import type { KpiItem } from '@/types';

interface KpiCardProps {
  item: KpiItem;
  widgetId?: string;
}

export const KpiCard = ({ item, widgetId }: KpiCardProps) => {
  const { isEditMode, minimizedWidgets, toggleMinimize, toggleWidget } = useDashboardStore();
  const isTrendDown = item.trend === 'down';
  const isMinimized = widgetId ? minimizedWidgets.includes(widgetId) : false;

  if (isMinimized) {
    return (
      <Card
        className="relative h-full flex items-center justify-center"
        role="article"
        aria-label={`${item.title} KPI kartı - Küçültülmüş`}
      >
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{item.title}</h3>
          {widgetId && (
            <button
              onClick={() => toggleMinimize(widgetId)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-custom-cyan focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label={`${item.title} widget'ını genişlet`}
              aria-expanded={false}
              tabIndex={0}
            >
              <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-300" aria-hidden="true" />
            </button>
          )}
        </div>
      </Card>
    );
  }

  const trendText = isTrendDown ? 'azalış' : 'artış';
  const trendColor = isTrendDown ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  return (
    <Card
      className="relative h-full"
      role="article"
      aria-label={`${item.title}: ${item.value} ${item.unit}, ${item.change} ${trendText}`}
    >
      <div className="absolute top-1/2 -translate-y-1/2 right-2 z-10" aria-hidden="true">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.bgColor}`}>
          <item.icon className={`w-4 h-4 ${item.color}`} aria-hidden="true" />
        </div>
      </div>
      {isEditMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            widgetId && toggleWidget(widgetId);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 cursor-pointer hover:opacity-80 transition-opacity z-20 bg-custom-cyan rounded-full p-1 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-custom-cyan"
          aria-label={`${item.title} widget'ını kaldır`}
          tabIndex={0}
        >
          <X className="w-4 h-4 text-white" aria-hidden="true" />
        </button>
      )}
      {widgetId && (
        <button
          onClick={() => toggleMinimize(widgetId)}
          className="absolute top-2 left-2 cursor-pointer hover:opacity-80 transition-opacity z-20 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-custom-cyan focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label={`${item.title} widget'ını küçült`}
          aria-expanded={true}
          tabIndex={0}
        >
          <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
        </button>
      )}
      <CardContent className="pt-3 pb-2 pr-16 pl-8">
        <div className="flex flex-col gap-1">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.title}</h3>
          <div className="flex items-end gap-1.5">
            <p className="text-lg font-bold text-custom-cyan" aria-label={`Değer: ${item.value}`}>
              {item.value}
            </p>
            <span className="text-custom-cyan font-medium text-xs mb-0.5" aria-label={`Birim: ${item.unit}`}>
              {item.unit}
            </span>
            <div
              className={`flex items-center gap-0.5 text-xs mb-0.5 ${trendColor}`}
              aria-label={`${item.change} ${trendText}`}
            >
              {isTrendDown ? (
                <TrendingDown className="w-3 h-3" aria-hidden="true" />
              ) : (
                <TrendingUp className="w-3 h-3" aria-hidden="true" />
              )}
              <span>{item.change}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
