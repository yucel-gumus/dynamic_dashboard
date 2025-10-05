import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getDepartmentConsumption } from '@/services/dataService';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

interface DepartmentChartProps {
  widgetId?: string;
}

export const DepartmentChart = ({ widgetId }: DepartmentChartProps) => {
  const { isEditMode, minimizedWidgets, toggleMinimize, toggleWidget } = useDashboardStore();
  const isMinimized = widgetId ? minimizedWidgets.includes(widgetId) : false;

  const departmentEnergyData = useMemo(() => getDepartmentConsumption(), []);

  if (isMinimized) {
    return (
      <Card
        className="relative h-full flex items-center justify-center"
        role="region"
        aria-label="Bölümlerin Enerji Tüketimleri - Küçültülmüş"
      >
        <div className="text-center">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Bölümlerin Enerji Tüketimleri</h2>
          {widgetId && (
            <button
              onClick={() => toggleMinimize(widgetId)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-custom-cyan focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Bölümlerin Enerji Tüketimleri grafiğini genişlet"
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

  return (
    <Card
      className="flex flex-col relative h-[450px]"
      role="region"
      aria-label="Bölümlerin enerji tüketim bar grafiği"
    >
      {isEditMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            widgetId && toggleWidget(widgetId);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 cursor-pointer hover:opacity-80 transition-opacity z-10 bg-custom-cyan rounded-full p-1 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-custom-cyan"
          aria-label="Departman Tüketimi widget'ını kaldır"
          tabIndex={0}
        >
          <X className="w-4 h-4 text-white" aria-hidden="true" />
        </button>
      )}
      {widgetId && (
        <div className="absolute top-3 left-3 cursor-pointer hover:opacity-80 transition-opacity z-10">
          <button
            onClick={() => toggleMinimize(widgetId)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-custom-cyan focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label="Bölümlerin Enerji Tüketimleri grafiğini küçült"
            aria-expanded={true}
            tabIndex={0}
          >
            <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
          </button>
        </div>
      )}
      <CardHeader className="pr-12 pl-12 flex-shrink-0">
        <h2 className="font-semibold text-gray-900 dark:text-white">Bölümlerin Enerji Tüketimleri</h2>
      </CardHeader>
      <CardContent className="flex-1 bar-chart-scroll p-0 px-3 pb-3">
        <div
          style={{ width: '100%', height: `${departmentEnergyData.length * 50}px`, minHeight: '600px' }}
          role="img"
          aria-label={`Bölümlerin enerji tüketim grafiği - ${departmentEnergyData.length} departman gösteriliyor`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentEnergyData} layout="vertical" margin={{ top: 5, right: 40, left: -10, bottom: 5 }}>
              <XAxis
                type="number"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 'auto']}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={85}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }} formatter={(value) => `${value.toLocaleString()}`} />
              <Bar dataKey="value" fill="#14b8b8" barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
