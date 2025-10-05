import { useMemo } from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getCapacitiveGauge } from '@/services/dataService';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CAPACITIVE_COLORS } from '@/constants/icons';

interface CapacitiveGaugeProps {
  widgetId?: string;
}

export const CapacitiveGauge = ({ widgetId }: CapacitiveGaugeProps) => {
  const { isEditMode, minimizedWidgets, toggleMinimize, toggleWidget } = useDashboardStore();
  const isMinimized = widgetId ? minimizedWidgets.includes(widgetId) : false;

  const gaugeData = useMemo(() => getCapacitiveGauge(), []);
  const capacitiveValue = gaugeData.current;

  if (isMinimized) {
    return (
      <Card
        className="relative h-full flex items-center justify-center"
        role="region"
        aria-label="Kapasitif Göstergesi - Küçültülmüş"
      >
        <div className="text-center">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Kapasitif</h2>
          {widgetId && (
            <button
              onClick={() => toggleMinimize(widgetId)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-custom-cyan focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Kapasitif göstergesini genişlet"
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

  const startAngleDeg = 180;
  const totalAngle = 180;
  const needleAngle = startAngleDeg + (capacitiveValue * totalAngle / 100) + 90;

  const centerX = 200;
  const centerY = 180;
  const radius = 140;
  const innerRadius = 110;

  const createArcPath = (startAngle: number, endAngle: number, innerR: number, outerR: number) => {
    const startOuter = polarToCartesian(centerX, centerY, outerR, endAngle);
    const endOuter = polarToCartesian(centerX, centerY, outerR, startAngle);
    const startInner = polarToCartesian(centerX, centerY, innerR, endAngle);
    const endInner = polarToCartesian(centerX, centerY, innerR, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", startOuter.x, startOuter.y,
      "A", outerR, outerR, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      "L", endInner.x, endInner.y,
      "A", innerR, innerR, 0, largeArcFlag, 1, startInner.x, startInner.y,
      "Z"
    ].join(" ");
  };

  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  const labelRadius = radius + 25;
  const labelPositions = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(percent => {
    const angle = startAngleDeg + (percent * totalAngle / 100);
    return polarToCartesian(centerX, centerY, labelRadius, angle);
  });

  return (
    <Card
      className="flex flex-col items-center justify-center relative h-[450px]"
      role="region"
      aria-label={`Kapasitif kullanım göstergesi - Mevcut değer: ${capacitiveValue}%`}
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
          aria-label="Kapasitif Gösterge widget'ını kaldır"
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
            aria-label="Kapasitif göstergesini küçült"
            aria-expanded={true}
            tabIndex={0}
          >
            <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
          </button>
        </div>
      )}
      <CardHeader className="pr-12 pl-12 flex-shrink-0">
        <h2 className="font-semibold text-gray-900 dark:text-white text-center">Kapasitif</h2>
      </CardHeader>
      <CardContent className="relative flex-1 flex flex-col items-center justify-center">
        <svg
          width="400"
          height="300"
          viewBox="0 0 400 300"
          className="mx-auto"
          role="img"
          aria-label={`Kapasitif gösterge grafiği: ${capacitiveValue}% kullanımda`}
        >
          {CAPACITIVE_COLORS.map((segment, index) => {
            const segmentAngle = totalAngle / CAPACITIVE_COLORS.length;
            const startAngle = startAngleDeg + (index * segmentAngle);
            const endAngle = startAngleDeg + ((index + 1) * segmentAngle);
            return (
              <path
                key={index}
                d={createArcPath(startAngle, endAngle, innerRadius, radius)}
                fill={segment.fill}
              />
            );
          })}

          {labelPositions.map((pos, index) => (
            <text
              key={index}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              className="text-xs fill-current text-gray-600 font-medium"
            >
              {index * 10}%
            </text>
          ))}

          <line
            x1={centerX}
            y1={centerY}
            x2={centerX}
            y2={centerY - 95}
            stroke="#22c55e"
            strokeWidth="4"
            transform={`rotate(${needleAngle} ${centerX} ${centerY})`}
            strokeLinecap="round"
          />
          <circle cx={centerX} cy={centerY} r="10" fill="#22c55e" />

          <text
            x={centerX}
            y="240"
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-bold text-3xl fill-current text-gray-800 dark:text-gray-100"
          >
            {capacitiveValue}%
          </text>
          <text
            x={centerX}
            y="270"
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-medium text-base fill-current text-gray-500 dark:text-gray-400"
          >
            Kapasitif
          </text>
        </svg>
      </CardContent>
    </Card>
  );
};
