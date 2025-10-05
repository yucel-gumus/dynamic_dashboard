import { Modal } from '@/components/ui/Modal';
import { KpiCard } from '@/components/widgets/KpiCard';
import { ElectricityChart } from '@/components/widgets/ElectricityChart';
import { DepartmentChart } from '@/components/widgets/DepartmentChart';
import { CapacitiveGauge } from '@/components/widgets/CapacitiveGauge';
import { useKpiData } from '@/hooks/useKpiData';
import { useDashboardStore, type WidgetConfig } from '@/store/dashboardStore';

interface WidgetPreviewModalProps {
  widget: WidgetConfig;
  onClose: () => void;
}

export const WidgetPreviewModal = ({ widget, onClose }: WidgetPreviewModalProps) => {
  const { activeWidgets, toggleWidget } = useDashboardStore();
  const isAdded = activeWidgets.includes(widget.id);

  const handleAddToDashboard = () => {
    if (!isAdded) {
      toggleWidget(widget.id);
    }
    onClose();
  };

  const renderPreview = () => {
    if (widget.id === 'electricityChart') {
      return (
        <div className="w-full h-[400px]">
          <ElectricityChart widgetId={widget.id} />
        </div>
      );
    }
    if (widget.id === 'departmentConsumption') {
      return (
        <div className="w-full h-[400px]">
          <DepartmentChart widgetId={widget.id} />
        </div>
      );
    }
    if (widget.id === 'capacitiveGauge') {
      return (
        <div className="w-full h-[400px]">
          <CapacitiveGauge widgetId={widget.id} />
        </div>
      );
    }

    return <KpiPreview widgetId={widget.id} />;
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`${widget.title} - Önizleme`}
      size="lg"
      footer={
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Kapat
          </button>
          <button
            onClick={handleAddToDashboard}
            disabled={isAdded}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${isAdded
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-custom-cyan hover:bg-custom-cyan/90'
              }`}
          >
            {isAdded ? 'Dashboard\'da Mevcut' : 'Dashboard\'a Ekle'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {widget.description && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">{widget.description}</p>
            {widget.tags && (
              <div className="flex flex-wrap gap-2 mt-2">
                {widget.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
          {renderPreview()}
        </div>
      </div>
    </Modal>
  );
};

const KpiPreview = ({ widgetId }: { widgetId: string }) => {
  const kpiItem = useKpiData(widgetId);

  if (!kpiItem) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
        Veri yükleniyor...
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-sm">
        <KpiCard item={kpiItem} widgetId={widgetId} />
      </div>
    </div>
  );
};
