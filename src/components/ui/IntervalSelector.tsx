import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export type IntervalOption = '60' | '120';

interface IntervalSelectorProps {
  interval: IntervalOption;
  onIntervalChange: (interval: IntervalOption) => void;
}

const intervalOptions: { value: IntervalOption; label: string }[] = [
  { value: '60', label: '60 Dakika' },
  { value: '120', label: '120 Dakika' },
];

export const IntervalSelector = ({ interval, onIntervalChange }: IntervalSelectorProps) => {
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

  const selectedOption = intervalOptions.find((opt) => opt.value === interval);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
      >
        <span>{selectedOption?.label || '60 Dakika'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[140px]">
          <div className="p-2">
            {intervalOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onIntervalChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                  interval === option.value
                    ? 'bg-custom-cyan text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
