# Enerji Yönetim Dashboard

Enerji tüketim verilerini görselleştiren, sürükle-bırak özellikli dashboard uygulaması.

## Proje Hakkında

Enerji yönetimi için geliştirilmiş interaktif kontrol paneli. KPI kartları ve grafikleri sürükleyip düzenleyebilir, widget ekleyip çıkarabilir, ayarları kaydedebilirsiniz.

**Özellikler:** Sürükle-bırak, resize, localStorage, responsive, dark mode, klavye navigasyonu, erişilebilirlik

## Kurulum

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
```

## Kullanım

1. Header'dan "Bileşenler" toggle'ını aç
2. Panel'den widget ara ve ekle
3. Widget'ları sürükle, boyutlandır
4. Değişiklikler otomatik kaydedilir

## Teknoloji Seçimleri ve Gerekçeleri

### Zorunlu Teknolojiler (Case Gereksinimleri)

#### React 19.1.1
**Seçim:** Case zorunluluğu  
**Neden Uygun:** Component-based mimari, geniş ekosistem, güçlü community desteği, hooks API ile modern state yönetimi. Dashboard gibi interaktif uygulamalar için ideal.

#### TypeScript 5.8.3
**Seçim:** Case zorunluluğu  
**Neden Uygun:** Compile-time tip kontrolü, IDE autocomplete desteği, refactoring güvenliği. Büyük projelerde hata oranını %15-40 azaltır. Interface'ler ile API contract'ları net tanımlanabilir.

#### Vite 7.1.7
**Seçim:** Case zorunluluğu  
**Neden Uygun:** Webpack'e göre 10-100x hızlı HMR (~50ms), native ESM desteği, optimized production build. Development deneyimini dramatik şekilde iyileştirir.

### UI Framework & Styling

#### Tailwind CSS 3.4.1
**Alternatifleri:** Styled Components, Emotion, CSS Modules, Material-UI  
**Neden Tailwind:**
- **Zero Runtime:** CSS-in-JS kütüphanelerinden farklı olarak runtime overhead yok
- **Bundle Size:** PurgeCSS ile kullanılmayan stiller otomatik temizlenir, final CSS ~15-20KB
- **Development Speed:** Utility-first yaklaşım, component'e özel CSS yazmaya gerek kalmaz
- **Consistency:** Design token'lar (spacing, colors) otomatik tutarlılık sağlar
- **Dark Mode:** `dark:` prefix ile built-in dark mode desteği
- **Responsive:** `sm:` `md:` `lg:` ile kolay responsive design

#### shadcn/ui
**Alternatifleri:** Material-UI, Ant Design, Chakra UI  
**Neden shadcn/ui:**
- **Not a Library:** NPM package olarak gelmiyor, kod direkt projeye kopyalanıyor - %100 kontrol
- **Customization:** Her component'in tüm kodu projede, istediğiniz gibi değiştirilebilir
- **Radix UI Primitives:** Erişilebilirlik ve keyboard navigation built-in
- **Bundle Size:** Sadece kullandığınız component'ler bundle'a dahil edilir
- **Tailwind Native:** Tailwind ile perfect entegrasyon
- **No Version Conflicts:** Dependency hell'den muaf

#### Lucide React 0.544.0
**Alternatifleri:** React Icons, Font Awesome, Heroicons  
**Neden Lucide:**
- **Tree Shakeable:** Sadece kullanılan ikonlar bundle'a dahil, her ikon ~1KB
- **Consistent Design:** 1400+ ikon, hepsi aynı design language
- **TypeScript:** Full TypeScript desteği, autocomplete
- **Customizable:** Size, color, stroke-width prop'larıyla kolay özelleştirme
- **Modern:** Feather Icons'un fork'u, daha aktif maintained

### State Management

#### Zustand 5.0.8
**Alternatifleri:** Redux Toolkit, MobX, Jotai, Recoil, Context API  
**Neden Zustand:**
- **Minimal Boilerplate:** Redux'a göre %90 daha az kod (~100 satır vs ~1000 satır)
- **Bundle Size:** 1.2KB (gzip), Redux Toolkit 12KB
- **No Provider Hell:** Context API gibi provider wrapper'lara gerek yok
- **Simple API:** `create()` ile store, `useStore()` ile kullanım - 5 dakikada öğrenilir
- **Middleware Ecosystem:** persist, devtools, immer desteği
- **Performance:** Selector-based subscriptions, gereksiz re-render yok
- **TypeScript:** Mükemmel tip çıkarımı

**Kodda Kullanımı:**
```typescript
const useStore = create(persist((set) => ({
  layouts: {},
  setLayouts: (layouts) => set({ layouts })
})))
```

### Grid & Drag-Drop

#### react-grid-layout 1.5.2
**Alternatifleri:** react-beautiful-dnd, react-dnd, @dnd-kit/sortable  
**Neden react-grid-layout:**
- **Purpose-Built:** Dashboard grid layout için özel tasarlanmış
- **Responsive:** Built-in responsive breakpoints (lg, md, sm, xs)
- **Mature:** 11+ yıl, 1M+ haftalık indirme, battle-tested
- **Features:** Resize, drag-drop, collision detection, compact mode
- **Performance:** Virtual rendering, 60 FPS
- **Auto-layout:** Boşlukları otomatik doldurur

#### @dnd-kit/core 6.3.1
**Alternatifleri:** react-beautiful-dnd, react-dnd  
**Neden @dnd-kit:**
- **Accessibility:** Keyboard navigation, screen reader, WCAG 2.1 AA
- **Touch Support:** Mobile cihazlarda smooth touch gestures
- **Sensors:** Mouse, touch, keyboard - tüm input metodları
- **Zero Layout Shift:** Dragging sırasında layout thrashing yok
- **Modular:** Core + Sortable + Utilities, sadece gerekenleri import
- **TypeScript:** Full type safety

**Not:** Widget listesi için @dnd-kit, grid için react-grid-layout kombinasyonu kullanıldı.

### Charting

#### Recharts 3.2.1
**Alternatifleri:** Chart.js, Victory, Nivo, Apache ECharts, D3.js  
**Neden Recharts:**
- **React-Native API:** Declarative JSX syntax, React component gibi kullanılır
- **Composition:** `<LineChart><Line/><XAxis/></LineChart>` - her parça ayrı component
- **Responsive:** ResponsiveContainer ile otomatik resize
- **Customization:** Custom tooltips, legends, axes kolay implement edilir
- **Animation:** Built-in smooth animations, transition'lar
- **TypeScript:** İyi tip desteği
- **Bundle:** ~95KB (gzip ~30KB), D3 full bundle 250KB

**Kodda Kullanımı:**
```tsx
<LineChart data={data}>
  <Line dataKey="value" stroke="#8884d8" />
  <Tooltip content={<CustomTooltip />} />
</LineChart>
```

D3.js gibi imperative API yerine declarative approach, React paradigmasına daha uygun.

### Utility Libraries

#### date-fns 4.1.0
**Alternatifleri:** Moment.js, Day.js, Luxon  
**Neden date-fns:**
- **Tree Shakeable:** Sadece kullanılan fonksiyonlar import edilir, Moment.js bundle'ın tamamını içerir
- **Immutable:** Date objelerini mutate etmez, safer
- **Bundle:** İhtiyaca göre 2-10KB, Moment.js 70KB+
- **Functional:** Pure functions, composable
- **TypeScript:** Excellent type definitions
- **Simple:** `format(date, 'yyyy-MM-dd')` - kolay API

#### SweetAlert2 11.23.0
**Alternatifleri:** react-toastify, sonner, react-hot-toast  
**Neden SweetAlert2:**
- **Beautiful:** Modern, customizable, accessible modal'lar
- **Features:** Confirm, error, success, input modals
- **Keyboard:** ESC to close, Enter to confirm
- **Promise-based:** Async/await ile kullanılır
- **Customizable:** Tailwind class'larıyla özelleştirilebilir
- **No Dependencies:** Vanilla JS, framework agnostic

### Neden Kullanılmadı?

**Redux Toolkit:** Overkill - bu proje için complex state yönetimi gerekmedi, Zustand yeterli  
**Material-UI:** Opinionated design system, customization zor, bundle size büyük  
**Styled Components:** Runtime overhead, Tailwind daha performant  
**Chart.js:** Imperative API, React paradigmasına uygun değil  
**Moment.js:** Deprecated, bundle size çok büyük, tree-shaking yok

## Yapı

```
src/
├── components/
│   ├── dashboard/    # Kontroller
│   ├── widgets/      # Widget'lar
│   └── ui/           # UI
├── hooks/            # Custom hooks
├── services/         # Servisler
├── store/            # Zustand
├── types/            # Tipler
├── constants/        # Sabitler
├── data/             # seed.json
└── lib/              # Utils
```

## Özellikler

**Widget'lar**
- 9 KPI kartı
- Elektrik grafiği (14 seri)
- Departman grafiği
- Kapasitif gauge

**Fonksiyonlar**
- Sürükle-bırak & resize
- Maksimum 9 KPI
- Minimize/expand
- Arama & filtreleme
- Dark/Light tema
- Responsive (desktop, tablet, mobil)

## Responsive

- Desktop (≥1280px): 15 kolon
- Tablet (768-1279px): 8 kolon
- Mobile Landscape (640-767px): 4 kolon
- Mobile Portrait (<640px): 1 kolon

**Not:** Case 12 kolon istiyor, Figma için 15 kolon kullanıldı.

## Performans

- Build: 2.4s
- Bundle: 820 kB (gzip: 242 kB)
- First Load: <2s
- FPS: 60

## Erişilebilirlik

- Klavye navigasyonu
- ARIA labels
- Focus indicators
- Screen reader
- WCAG 2.1 AA

## localStorage

Key: `ew-dashboard-layout-v1`

- Widget düzeni
- Aktif widget'lar
- Minimize edilmiş
- Dark mode
- KPI pozisyonları

## Kararlar

**15 Kolon:** Figma tasarımı için  
**Gauge %0:** Müşteri talebi  
**Zustand:** Minimal kod  
**Tailwind:** Zero runtime

## Case Uyumluluk

**Zorunlu ✓**
- React + TypeScript + Vite
- Tailwind + shadcn/ui
- react-grid-layout
- Recharts
- Zustand
- localStorage
- Responsive
- Erişilebilirlik

**Bonus ✓**
- Minimize/expand
- Dark mode
- Moving Average
- Downsample