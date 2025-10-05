import { useState, useCallback } from 'react';
import { Responsive, WidthProvider, type Layout as RGLLayout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { DndContext, useDroppable, type DragEndEvent } from '@dnd-kit/core';
import { useDashboardStore } from '@/store/dashboardStore';
import { useKpiData } from '@/hooks/useKpiData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ComponentSelector } from '@/components/dashboard/ComponentSelector';
import { KpiCard } from '@/components/widgets/KpiCard';
import { ElectricityChart } from '@/components/widgets/ElectricityChart';
import { DepartmentChart } from '@/components/widgets/DepartmentChart';
import { CapacitiveGauge } from '@/components/widgets/CapacitiveGauge';

const ResponsiveGridLayout = WidthProvider(Responsive);

export const DashboardGrid = () => {
    const [isComponentSelectorVisible, setIsComponentSelectorVisible] = useState(false);
    const { layouts, setLayouts, activeWidgets, isEditMode, toggleWidget } = useDashboardStore();

    const onLayoutChange = useCallback((_: RGLLayout[], allLayouts: { [key: string]: RGLLayout[] }) => {
        setLayouts(allLayouts);
    }, [setLayouts]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && over.id === 'dashboard-droppable' && active.data.current?.widgetId) {
            const widgetId = active.data.current.widgetId;
            toggleWidget(widgetId);
        }
    };

    const renderWidget = (widgetId: string) => {
        if (widgetId === 'electricityChart') {
            return <ElectricityChart widgetId={widgetId} />;
        }
        if (widgetId === 'departmentConsumption') {
            return <DepartmentChart widgetId={widgetId} />;
        }
        if (widgetId === 'capacitiveGauge') {
            return <CapacitiveGauge widgetId={widgetId} />;
        }

        return <KpiWidget widgetId={widgetId} />;
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8 font-sans transition-colors">
                <div className="max-w-screen-2xl mx-auto">
                    <DashboardHeader
                        isComponentSelectorVisible={isComponentSelectorVisible}
                        setIsComponentSelectorVisible={setIsComponentSelectorVisible}
                    />
                    {isComponentSelectorVisible && <ComponentSelector />}

                    <DroppableDashboard
                        activeWidgets={activeWidgets}
                        renderWidget={renderWidget}
                        layouts={layouts}
                        onLayoutChange={onLayoutChange}
                        isEditMode={isEditMode}
                    />
                </div>
            </div>
        </DndContext>
    );
};

interface DroppableDashboardProps {
    activeWidgets: string[];
    renderWidget: (widgetId: string) => React.ReactElement | null;
    layouts: { [key: string]: RGLLayout[] };
    onLayoutChange: (_: RGLLayout[], allLayouts: { [key: string]: RGLLayout[] }) => void;
    isEditMode: boolean;
}

const DroppableDashboard = ({ activeWidgets, renderWidget, layouts, onLayoutChange, isEditMode }: DroppableDashboardProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'dashboard-droppable',
    });

    return (
        <div
            ref={setNodeRef}
            className={`transition-all ${isOver ? 'ring-2 ring-custom-cyan ring-opacity-50 rounded-lg' : ''}`}
        >
            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1280, md: 768, sm: 640, xs: 0 }}
                cols={{ lg: 15, md: 8, sm: 4, xs: 1 }}
                rowHeight={80}
                onLayoutChange={onLayoutChange}
                isDraggable={isEditMode}
                isResizable={isEditMode}
                margin={[12, 12]}
                containerPadding={[0, 0]}
                compactType="vertical"
                preventCollision={false}
                allowOverlap={false}
                useCSSTransforms={true}
            >
                {activeWidgets.map((widgetId) => (
                    <div key={widgetId} className="widget-container">
                        {renderWidget(widgetId)}
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
};

const KpiWidget = ({ widgetId }: { widgetId: string }) => {
    const kpiItem = useKpiData(widgetId);

    if (!kpiItem) return null;

    return <KpiCard item={kpiItem} widgetId={widgetId} />;
};
