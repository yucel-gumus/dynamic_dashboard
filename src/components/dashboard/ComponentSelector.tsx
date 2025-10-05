import { useState } from 'react';
import { SquarePlus, Eye } from 'lucide-react';
import { useDashboardStore, type WidgetConfig } from '@/store/dashboardStore';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { WidgetPreviewModal } from '@/components/widgets/WidgetPreviewModal';

export const ComponentSelector = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredWidget, setHoveredWidget] = useState<string | null>(null);
  const [previewWidget, setPreviewWidget] = useState<WidgetConfig | null>(null);
  const { activeWidgets, toggleWidget, resetLayout, availableWidgets, saveToLocalStorage } = useDashboardStore();
  const inactiveWidgets = availableWidgets.filter((widget) => !activeWidgets.includes(widget.id));

  const filteredWidgets = inactiveWidgets.filter((widget) =>
    widget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    widget.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    widget.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="mb-3">
      <CardHeader className="pb-4">
        <div className="flex flex-row items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Bileşenler</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Alttaki menüden dilediğiniz bileşeni yanındaki <SquarePlus className="inline w-4 h-4 text-custom-cyan mx-1" /> butonuna tıklayarak ya da sürükleyerek <b>İzleme Sayfanıza</b> ekleyebilirsiniz.
            </p>
          </div>
          <div className="relative ml-4">
            <input
              type="text"
              placeholder="Bileşen ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64 focus:ring-2 focus:ring-custom-cyan focus:border-custom-cyan outline-none"
              aria-label="Bileşen ara"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {filteredWidgets.length > 0 ? (
            filteredWidgets.map((widget) => (
              <DraggableWidgetCard
                key={widget.id}
                widget={widget}
                hoveredWidget={hoveredWidget}
                setHoveredWidget={setHoveredWidget}
                toggleWidget={toggleWidget}
                onPreview={setPreviewWidget}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-2">
              {searchTerm ? 'Arama sonucu bulunamadı.' : 'Tüm bileşenler dashboard\'a eklenmiş.'}
            </p>
          )}
        </div>

        {previewWidget && (
          <WidgetPreviewModal
            widget={previewWidget}
            onClose={() => setPreviewWidget(null)}
          />
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex gap-2 justify-end">
          <button
            onClick={resetLayout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            aria-label="Düzeni sıfırla"
          >
            Sıfırla
          </button>
          <button
            onClick={saveToLocalStorage}
            className="px-4 py-2 text-sm font-medium text-white bg-custom-cyan rounded-md hover:bg-custom-cyan/90"
            aria-label="Değişiklikleri kaydet"
          >
            Kaydet
          </button>
          <button
            onClick={() => {
              activeWidgets.forEach((id) => toggleWidget(id));
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
            aria-label="Tüm bileşenleri kaldır"
          >
            Tüm Bileşenleri Kaldır
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

interface DraggableWidgetCardProps {
  widget: WidgetConfig;
  hoveredWidget: string | null;
  setHoveredWidget: (id: string | null) => void;
  toggleWidget: (id: string) => void;
  onPreview: (widget: WidgetConfig) => void;
}

const DraggableWidgetCard = ({ widget, hoveredWidget, setHoveredWidget, toggleWidget, onPreview }: DraggableWidgetCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `draggable-${widget.id}`,
    data: { widgetId: widget.id },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setHoveredWidget(widget.id)}
      onMouseLeave={() => setHoveredWidget(null)}
    >
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        <button
          onClick={() => toggleWidget(widget.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleWidget(widget.id);
            }
          }}
          className="focus:outline-none focus:ring-2 focus:ring-custom-cyan rounded"
          aria-label={`${widget.title} widget'ını ekle`}
          tabIndex={0}
        >
          <SquarePlus className="w-4 h-4 text-custom-cyan" />
        </button>
        <span
          className="flex-1 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          {widget.title}
        </span>
        <button
          onClick={() => onPreview(widget)}
          className="focus:outline-none focus:ring-2 focus:ring-custom-cyan rounded"
          aria-label={`${widget.title} önizlemesini gör`}
          title="Önizleme"
          tabIndex={0}
        >
          <Eye className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
        </button>
      </div>

      {hoveredWidget === widget.id && widget.description && !isDragging && (
        <div className="absolute z-50 top-full mt-2 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md p-3 w-64 text-sm">
          <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{widget.title}</div>
          <div className="text-gray-600 dark:text-gray-400 mb-2">{widget.description}</div>
          {widget.tags && (
            <div className="flex flex-wrap gap-1">
              {widget.tags.map((tag, idx) => (
                <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
