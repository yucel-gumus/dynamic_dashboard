import { create } from 'zustand';
import type { Layout, Layouts } from 'react-grid-layout';
import Swal from 'sweetalert2';

export interface WidgetConfig {
  id: string;
  title: string;
  type: 'kpi' | 'chart' | 'table';
  description?: string;
  defaultVisible?: boolean;
  tags?: string[];
}

export const availableWidgets: WidgetConfig[] = [
  { id: 'totalConsumption', title: 'Toplam Tüketim', type: 'kpi', description: 'Toplam enerji tüketimi (kWh)', defaultVisible: true, tags: ['enerji', 'tüketim'] },
  { id: 'topDebi', title: 'Tep Değeri', type: 'kpi', description: 'Ton eşdeğer petrol değeri (TEP)', defaultVisible: true, tags: ['tep', 'enerji'] },
  { id: 'carbonFootprint', title: 'Toplam Karbon Ayak İzi', type: 'kpi', description: 'CO2 emisyon miktarı (tCO2e)', defaultVisible: true, tags: ['karbon', 'çevre'] },
  { id: 'naturalGas', title: 'Toplam Doğalgaz Tüketimi', type: 'kpi', description: 'Doğalgaz tüketim miktarı (Sm³)', defaultVisible: true, tags: ['doğalgaz', 'tüketim'] },
  { id: 'steamConsumption', title: 'Toplam Buhar Tüketimi', type: 'kpi', description: 'Buhar tüketim miktarı', defaultVisible: true, tags: ['buhar', 'tüketim'] },
  { id: 'electricityConsumption', title: 'Toplam Elektrik Tüketimi', type: 'kpi', description: 'Elektrik tüketim miktarı (kWh)', defaultVisible: true, tags: ['elektrik', 'tüketim'] },
  { id: 'hotWater', title: 'Toplam Sıcak Su Tüketimi', type: 'kpi', description: 'Sıcak su tüketim miktarı (m³)', defaultVisible: true, tags: ['su', 'sıcak su'] },
  { id: 'waterConsumption', title: 'Toplam Su Tüketimi', type: 'kpi', description: 'Su tüketim miktarı (m³)', defaultVisible: true, tags: ['su', 'tüketim'] },
  { id: 'electricityProduction', title: 'Toplam Elektrik Üretimi', type: 'kpi', description: 'Elektrik üretim miktarı (kWh)', defaultVisible: true, tags: ['elektrik', 'üretim'] },

  { id: 'electricityChart', title: 'Elektrik Tüketimi Grafiği', type: 'chart', description: 'Zaman serisi elektrik tüketim grafiği', defaultVisible: true, tags: ['elektrik', 'grafik', 'tüketim'] },
  { id: 'departmentConsumption', title: 'Bölümlerin Enerji Tüketimleri', type: 'chart', description: 'Departman bazlı tüketim bar grafiği', defaultVisible: true, tags: ['elektrik', 'bölüm', 'departman'] },
  { id: 'capacitiveGauge', title: 'Kapasitif Kullanım Göstergesi', type: 'chart', description: 'Kapasitif tüketim gauge grafiği', defaultVisible: true, tags: ['elektrik', 'kapasitif', 'gauge'] },

  { id: 'electricPowerFactor', title: 'Elektrik Güç Faktörü', type: 'kpi', description: 'Anlık güç faktörü değeri', defaultVisible: false, tags: ['elektrik', 'güç faktörü'] },
  { id: 'electricVoltage', title: 'Elektrik Gerilim', type: 'kpi', description: 'Şebeke gerilim değeri (V)', defaultVisible: false, tags: ['elektrik', 'gerilim', 'voltaj'] },
  { id: 'electricCurrent', title: 'Elektrik Akım', type: 'kpi', description: 'Hat akım değeri (A)', defaultVisible: false, tags: ['elektrik', 'akım'] },
  { id: 'electricFrequency', title: 'Elektrik Frekans', type: 'kpi', description: 'Şebeke frekans değeri (Hz)', defaultVisible: false, tags: ['elektrik', 'frekans'] },
];

interface RemovedKpiPosition {
  lg: Layout;
  md: Layout;
  sm: Layout;
  xs: Layout;
}

interface DashboardState {
  layout: Layout[];
  layouts: Layouts;
  activeWidgets: string[];
  minimizedWidgets: string[];
  isEditMode: boolean;
  isDarkMode: boolean;
  availableWidgets: WidgetConfig[];
  lastRemovedKpiPositions: RemovedKpiPosition[];
  setLayout: (layout: Layout[]) => void;
  setLayouts: (layouts: Layouts) => void;
  toggleWidget: (widgetId: string) => void;
  toggleMinimize: (widgetId: string) => void;
  toggleEditMode: () => void;
  setEditMode: (value: boolean) => void;
  toggleDarkMode: () => void;
  resetLayout: () => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

const defaultLayoutLg: Layout[] = [
  { i: 'totalConsumption', x: 0, y: 0, w: 3, h: 1.25, minW: 3, minH: 1 },
  { i: 'topDebi', x: 3, y: 0, w: 3, h: 1.25, minW: 3, minH: 1 },
  { i: 'carbonFootprint', x: 6, y: 0, w: 3, h: 1.25, minW: 3, minH: 1 },
  { i: 'naturalGas', x: 9, y: 0, w: 3, h: 1.25, minW: 3, minH: 1 },
  { i: 'steamConsumption', x: 12, y: 0, w: 3, h: 1.25, minW: 3, minH: 1 },
  { i: 'electricityChart', x: 0, y: 1.25, w: 15, h: 5, minW: 10, minH: 4 },
  { i: 'departmentConsumption', x: 0, y: 6.25, w: 6, h: 5, minW: 5, minH: 4 },
  { i: 'capacitiveGauge', x: 6, y: 6.25, w: 6, h: 5, minW: 5, minH: 4 },
  { i: 'electricityConsumption', x: 12, y: 6.25, w: 3, h: 1.25, minW: 3, minH: 1 },
  { i: 'hotWater', x: 12, y: 7.5, w: 3, h: 1.25, minW: 3, minH: 1 },
  { i: 'waterConsumption', x: 12, y: 8.75, w: 3, h: 1.25, minW: 3, minH: 1 },
  { i: 'electricityProduction', x: 12, y: 10, w: 3, h: 1.25, minW: 3, minH: 1 },
];

const defaultLayoutMd: Layout[] = [
  { i: 'totalConsumption', x: 0, y: 0, w: 4, h: 1.5, minW: 3, minH: 1 },
  { i: 'topDebi', x: 4, y: 0, w: 4, h: 1.5, minW: 3, minH: 1 },
  { i: 'carbonFootprint', x: 0, y: 1.5, w: 4, h: 1.5, minW: 3, minH: 1 },
  { i: 'naturalGas', x: 4, y: 1.5, w: 4, h: 1.5, minW: 3, minH: 1 },
  { i: 'steamConsumption', x: 2, y: 3, w: 4, h: 1.5, minW: 3, minH: 1 },
  { i: 'electricityChart', x: 0, y: 4.5, w: 8, h: 5, minW: 6, minH: 4 },
  { i: 'departmentConsumption', x: 0, y: 9.5, w: 8, h: 5, minW: 6, minH: 4 },
  { i: 'capacitiveGauge', x: 0, y: 14.5, w: 8, h: 5, minW: 6, minH: 4 },

  { i: 'electricityConsumption', x: 0, y: 19.5, w: 4, h: 1.5, minW: 3, minH: 1 },
  { i: 'hotWater', x: 4, y: 19.5, w: 4, h: 1.5, minW: 3, minH: 1 },
  { i: 'waterConsumption', x: 0, y: 21, w: 4, h: 1.5, minW: 3, minH: 1 },
  { i: 'electricityProduction', x: 4, y: 21, w: 4, h: 1.5, minW: 3, minH: 1 },
];

const defaultLayoutSm: Layout[] = [
  { i: 'totalConsumption', x: 0, y: 0, w: 2, h: 1.5, minW: 2, minH: 1 },
  { i: 'topDebi', x: 2, y: 0, w: 2, h: 1.5, minW: 2, minH: 1 },
  { i: 'carbonFootprint', x: 0, y: 1.5, w: 2, h: 1.5, minW: 2, minH: 1 },
  { i: 'naturalGas', x: 2, y: 1.5, w: 2, h: 1.5, minW: 2, minH: 1 },
  { i: 'steamConsumption', x: 0, y: 3, w: 4, h: 1.5, minW: 2, minH: 1 },

  { i: 'electricityChart', x: 0, y: 4.5, w: 4, h: 5, minW: 4, minH: 4 },
  { i: 'departmentConsumption', x: 0, y: 9.5, w: 4, h: 5, minW: 4, minH: 4 },
  { i: 'capacitiveGauge', x: 0, y: 14.5, w: 4, h: 5, minW: 4, minH: 4 },

  { i: 'electricityConsumption', x: 0, y: 19.5, w: 2, h: 1.5, minW: 2, minH: 1 },
  { i: 'hotWater', x: 2, y: 19.5, w: 2, h: 1.5, minW: 2, minH: 1 },
  { i: 'waterConsumption', x: 0, y: 21, w: 2, h: 1.5, minW: 2, minH: 1 },
  { i: 'electricityProduction', x: 2, y: 21, w: 2, h: 1.5, minW: 2, minH: 1 },
];

const defaultLayoutXs: Layout[] = [
  { i: 'totalConsumption', x: 0, y: 0, w: 1, h: 1.5, minW: 1, minH: 1 },
  { i: 'topDebi', x: 0, y: 1.5, w: 1, h: 1.5, minW: 1, minH: 1 },
  { i: 'carbonFootprint', x: 0, y: 3, w: 1, h: 1.5, minW: 1, minH: 1 },
  { i: 'naturalGas', x: 0, y: 4.5, w: 1, h: 1.5, minW: 1, minH: 1 },
  { i: 'steamConsumption', x: 0, y: 6, w: 1, h: 1.5, minW: 1, minH: 1 },
  { i: 'electricityChart', x: 0, y: 7.5, w: 1, h: 5, minW: 1, minH: 4 },
  { i: 'departmentConsumption', x: 0, y: 12.5, w: 1, h: 5, minW: 1, minH: 4 },
  { i: 'capacitiveGauge', x: 0, y: 17.5, w: 1, h: 5, minW: 1, minH: 4 },
  { i: 'electricityConsumption', x: 0, y: 22.5, w: 1, h: 1.5, minW: 1, minH: 1 },
  { i: 'hotWater', x: 0, y: 24, w: 1, h: 1.5, minW: 1, minH: 1 },
  { i: 'waterConsumption', x: 0, y: 25.5, w: 1, h: 1.5, minW: 1, minH: 1 },
  { i: 'electricityProduction', x: 0, y: 27, w: 1, h: 1.5, minW: 1, minH: 1 },
];

const defaultLayouts: Layouts = {
  lg: defaultLayoutLg,
  md: defaultLayoutMd,
  sm: defaultLayoutSm,
  xs: defaultLayoutXs,
};

const defaultLayout = defaultLayoutLg;

const defaultActiveWidgets = ['totalConsumption', 'topDebi', 'carbonFootprint', 'naturalGas', 'electricityChart', 'departmentConsumption', 'capacitiveGauge', 'steamConsumption', 'electricityConsumption', 'hotWater', 'waterConsumption', 'electricityProduction'];

const STORAGE_KEY = 'ew-dashboard-layout-v1';

const loadInitialState = () => {
  if (typeof window === 'undefined') return null;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.state;
    }
  } catch (error) {
    console.error('localStorage yükleme hatası:', error);
  }
  return null;
};

const initialState = loadInitialState();

export const useDashboardStore = create<DashboardState>()((set, get) => ({
  layout: initialState?.layout || defaultLayout,
  layouts: initialState?.layouts || defaultLayouts,
  activeWidgets: initialState?.activeWidgets || defaultActiveWidgets,
  minimizedWidgets: initialState?.minimizedWidgets || [],
  isEditMode: false,
  isDarkMode: initialState?.isDarkMode || false,
  availableWidgets: availableWidgets,
  lastRemovedKpiPositions: initialState?.lastRemovedKpiPositions || [],

  setLayout: (layout) => set({ layout }),

  setLayouts: (layouts) => set({ layouts }),

  toggleWidget: (widgetId) =>
    set((state) => {
      const isActive = state.activeWidgets.includes(widgetId);

      if (isActive) {
        const widget = availableWidgets.find((w) => w.id === widgetId);
        let newRemovedKpiPositions = state.lastRemovedKpiPositions;
        if (widget?.type === 'kpi') {
          const removedLg = state.layouts.lg?.find((item) => item.i === widgetId);
          const removedMd = state.layouts.md?.find((item) => item.i === widgetId);
          const removedSm = state.layouts.sm?.find((item) => item.i === widgetId);
          const removedXs = state.layouts.xs?.find((item) => item.i === widgetId);

          if (removedLg && removedMd && removedSm && removedXs) {
            newRemovedKpiPositions = [
              { lg: removedLg, md: removedMd, sm: removedSm, xs: removedXs },
              ...state.lastRemovedKpiPositions
            ].slice(0, 4);
          }
        }

        return {
          activeWidgets: state.activeWidgets.filter((id) => id !== widgetId),
          layout: state.layout.filter((item) => item.i !== widgetId),
          layouts: {
            lg: state.layouts.lg?.filter((item) => item.i !== widgetId) || [],
            md: state.layouts.md?.filter((item) => item.i !== widgetId) || [],
            sm: state.layouts.sm?.filter((item) => item.i !== widgetId) || [],
            xs: state.layouts.xs?.filter((item) => item.i !== widgetId) || [],
          },
          lastRemovedKpiPositions: newRemovedKpiPositions,
        };
      } else {
        const widget = availableWidgets.find((w) => w.id === widgetId);
        if (!widget) return state;

        const currentKpiCount = state.activeWidgets.filter((id) => {
          const w = availableWidgets.find((widget) => widget.id === id);
          return w?.type === 'kpi';
        }).length;

        if (widget.type === 'kpi' && currentKpiCount >= 9) {
          Swal.fire({
            icon: 'warning',
            title: 'Maksimum Limit',
            text: 'Maksimum 9 KPI kartı ekleyebilirsiniz. Yeni bir kart eklemek için önce bir tanesini kaldırın.',
            confirmButtonText: 'Tamam',
            confirmButtonColor: '#00d1d2',
          });
          return state;
        }

        let newLayoutItemLg: Layout;
        let newLayoutItemMd: Layout;
        let newLayoutItemSm: Layout;
        let newLayoutItemXs: Layout;
        let updatedRemovedPositions = state.lastRemovedKpiPositions;

        if (widget.type === 'kpi' && state.lastRemovedKpiPositions.length > 0) {
          const savedPosition = state.lastRemovedKpiPositions[0];

          newLayoutItemLg = { ...savedPosition.lg, i: widgetId };
          newLayoutItemMd = { ...savedPosition.md, i: widgetId };
          newLayoutItemSm = { ...savedPosition.sm, i: widgetId };
          newLayoutItemXs = { ...savedPosition.xs, i: widgetId };

          updatedRemovedPositions = state.lastRemovedKpiPositions.slice(1);
        } else {
          const defaultItemLg = defaultLayoutLg.find((item) => item.i === widgetId);
          const defaultItemMd = defaultLayoutMd.find((item) => item.i === widgetId);
          const defaultItemSm = defaultLayoutSm.find((item) => item.i === widgetId);
          const defaultItemXs = defaultLayoutXs.find((item) => item.i === widgetId);

          newLayoutItemLg = defaultItemLg ? {
            ...defaultItemLg,
            y: Infinity,
          } : {
            i: widgetId,
            x: 0,
            y: Infinity,
            w: widget.type === 'chart' ? 15 : 3,
            h: widget.type === 'chart' ? 5 : 1.25,
            minW: widget.type === 'chart' ? 10 : 3,
            minH: widget.type === 'chart' ? 4 : 1,
          };

          newLayoutItemMd = defaultItemMd ? {
            ...defaultItemMd,
            y: Infinity,
          } : {
            i: widgetId,
            x: 0,
            y: Infinity,
            w: widget.type === 'chart' ? 8 : 4,
            h: widget.type === 'chart' ? 5 : 2,
            minW: widget.type === 'chart' ? 6 : 3,
            minH: widget.type === 'chart' ? 4 : 1,
          };

          newLayoutItemSm = defaultItemSm ? {
            ...defaultItemSm,
            y: Infinity,
          } : {
            i: widgetId,
            x: 0,
            y: Infinity,
            w: widget.type === 'chart' ? 4 : 2,
            h: widget.type === 'chart' ? 5 : 2,
            minW: widget.type === 'chart' ? 4 : 2,
            minH: widget.type === 'chart' ? 4 : 1,
          };

          newLayoutItemXs = defaultItemXs ? {
            ...defaultItemXs,
            y: Infinity,
          } : {
            i: widgetId,
            x: 0,
            y: Infinity,
            w: 1,
            h: widget.type === 'chart' ? 5 : 2,
            minW: 1,
            minH: widget.type === 'chart' ? 4 : 1,
          };
        }

        return {
          activeWidgets: [...state.activeWidgets, widgetId],
          layout: [...state.layout, newLayoutItemLg],
          layouts: {
            lg: [...(state.layouts.lg || []), newLayoutItemLg],
            md: [...(state.layouts.md || []), newLayoutItemMd],
            sm: [...(state.layouts.sm || []), newLayoutItemSm],
            xs: [...(state.layouts.xs || []), newLayoutItemXs],
          },
          lastRemovedKpiPositions: updatedRemovedPositions,
        };
      }
    }),

  toggleMinimize: (widgetId) =>
    set((state) => ({
      minimizedWidgets: state.minimizedWidgets.includes(widgetId)
        ? state.minimizedWidgets.filter((id) => id !== widgetId)
        : [...state.minimizedWidgets, widgetId],
    })),

  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),

  setEditMode: (value) => set({ isEditMode: value }),

  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.isDarkMode;
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDarkMode: newDarkMode };
  }),

  resetLayout: () =>
    set({
      layout: defaultLayout,
      layouts: defaultLayouts,
      activeWidgets: defaultActiveWidgets,
      minimizedWidgets: [],
      lastRemovedKpiPositions: [],
    }),

  saveToLocalStorage: () => {
    const state = get();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        state: {
          layout: state.layout,
          layouts: state.layouts,
          activeWidgets: state.activeWidgets,
          minimizedWidgets: state.minimizedWidgets,
          isDarkMode: state.isDarkMode,
          lastRemovedKpiPositions: state.lastRemovedKpiPositions,
        }
      }));

      Swal.fire({
        icon: 'success',
        title: 'Kaydedildi',
        text: 'Değişiklikler başarıyla kaydedildi.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('localStorage kaydetme hatası:', error);
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Kaydetme sırasında bir hata oluştu.',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#00d1d2',
      });
    }
  },

  loadFromLocalStorage: () => {
    const saved = loadInitialState();
    if (saved) {
      set({
        layout: saved.layout || defaultLayout,
        layouts: saved.layouts || defaultLayouts,
        activeWidgets: saved.activeWidgets || defaultActiveWidgets,
        minimizedWidgets: saved.minimizedWidgets || [],
        isDarkMode: saved.isDarkMode || false,
        lastRemovedKpiPositions: saved.lastRemovedKpiPositions || [],
      });
    }
  },
}));
