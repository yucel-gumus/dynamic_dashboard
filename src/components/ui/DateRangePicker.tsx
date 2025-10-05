import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';

interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const DATA_END_DATE = new Date('2025-09-28T23:59:59');
const DATA_START_DATE = new Date('2025-09-26T00:00:00');

const presetRanges = [
  { label: '28 Eylül', days: 1 },
  { label: '27-28 Eylül', days: 2 },
  { label: '26-28 Eylül', days: 3 },
];

export const DateRangePicker = ({ dateRange, onDateRangeChange }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePresetSelect = (days: number) => {
    let from: Date;
    let to: Date = endOfDay(DATA_END_DATE);

    if (days === 1) {
      from = startOfDay(new Date('2025-09-28'));
    } else if (days === 2) {
      from = startOfDay(new Date('2025-09-27'));
    } else {
      from = startOfDay(DATA_START_DATE);
    }

    const newRange = { from, to };
    onDateRangeChange(newRange);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <CalendarIcon className="w-4 h-4" />
        <span>
          {dateRange?.from && dateRange?.to ? (
            <>
              {format(dateRange.from, "dd MMM yyyy", { locale: tr })} -{' '}
              {format(dateRange.to, "dd MMM yyyy", { locale: tr })}
            </>
          ) : (
            'Tarih Seç'
          )}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[200px]">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 px-2">
              Hızlı Seçim
            </div>
            {presetRanges.map((preset) => (
              <button
                key={preset.days}
                onClick={() => handlePresetSelect(preset.days)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
