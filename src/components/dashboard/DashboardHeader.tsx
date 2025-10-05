import { Grip, Moon, Sun } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { Card, CardContent } from '@/components/ui/Card';

interface DashboardHeaderProps {
  isComponentSelectorVisible: boolean;
  setIsComponentSelectorVisible: (value: boolean) => void;
}

export const DashboardHeader = ({
  isComponentSelectorVisible,
  setIsComponentSelectorVisible,
}: DashboardHeaderProps) => {
  const { setEditMode, isDarkMode, toggleDarkMode } = useDashboardStore();

  const handleToggle = (checked: boolean) => {
    setIsComponentSelectorVisible(checked);
    setEditMode(checked);
  };

  return (
    <Card className="mb-3">
      <CardContent className="flex justify-between items-center py-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Gösterge Paneli</h1>
        <div className="flex items-center gap-3">

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isDarkMode ? 'Light mode\'a geç' : 'Dark mode\'a geç'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>


          <div className="flex items-center gap-3">
            <Grip className="w-5 h-5 text-custom-cyan stroke-[2.5]" />
            <label htmlFor="component-toggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bileşenler
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                id="component-toggle"
                className="sr-only peer"
                checked={isComponentSelectorVisible}
                onChange={(e) => handleToggle(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-cyan"></div>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
