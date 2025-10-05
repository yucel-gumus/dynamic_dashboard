import type { TooltipProps } from '@/types';

export const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-[400px] overflow-y-auto">
        <p className="font-bold text-gray-900 dark:text-gray-100 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          {`Zaman: ${label}`}
        </p>
        <div className="space-y-1">
          {payload.map((pld, index) => {
            const value = typeof pld.value === 'number' ? pld.value.toFixed(2) : pld.value;
            return (
              <div key={index} className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: pld.color }}
                  />
                  <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                    {pld.name}
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {value} kWh
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};
