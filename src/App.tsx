import { useEffect } from 'react';
import { DashboardGrid } from '@/components/DashboardGrid';
import { useDashboardStore } from '@/store/dashboardStore';

function App() {
  const { isDarkMode } = useDashboardStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return <DashboardGrid />;
}

export default App;
