# 📊 Dynamic Energy Dashboard - Drag & Drop Analytics & Monitoring Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite 7](https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![dnd-kit](https://img.shields.io/badge/Drag_%26_Drop-@dnd--kit-FF5722?style=for-the-badge)](https://dndkit.com/)
[![Portfolio](https://img.shields.io/badge/Portfolio-yucelgumus.dev-2563EB?style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.yucelgumus.dev/)

> Enerji tüketim ve üretim verilerini gerçek zamanlı izleyen, kullanıcıların bileşenleri sürükleyip bırakarak (**Drag & Drop**) kendi izleme panellerini oluşturmasına olanak tanıyan, modern **React 19, Vite 7 ve @dnd-kit** tabanlı dinamik gösterge paneli (dashboard).

---

## 🌟 Öne Çıkan Özellikler

- 🧱 **Sürükle & Bırak Grid Düzeni (@dnd-kit):** Kullanıcıların widget kartlarını serbestçe taşımasına, sıralamasını değiştirmesine ve paneli kişiselleştirmesine imkan tanır (`DashboardGrid.tsx`).
- ⚡ **Zengin Enerji Widget Yelpazesi:**
  - `KpiCard`: Anlık tüketim, reaktif güç ve maliyet KPI kartları.
  - `ElectricityChart`: Zaman serisi bazlı elektrik tüketim eğrileri.
  - `CapacitiveGauge`: Kapasitif/Endüktif ceza oranlarını gösteren radyal göstergeler.
  - `DepartmentChart`: Departmanlar arası enerji dağılım pasta/çubuk grafikleri.
- 🎛️ **Bileşen Seçici & Önizleme Modalı:** Kullanıcıların yeni grafik ve KPI'ları panele eklemeden önce canlı önizleme yapabilmesi (`ComponentSelector.tsx`).
- 📅 **Zaman Aralığı & Çözünürlük Seçici:** Günlük, haftalık, aylık zaman filtreleri ve anlık veri periyodu seçimi (`DateRangePicker.tsx`, `IntervalSelector.tsx`).
- 💾 **Zustand Tabanlı Durum Saklama:** Kullanıcının oluşturduğu grid düzenini ve filtre tercihlerini tarayıcıda kalıcı olarak saklama (`dashboardStore.ts`).

---

## 🏗️ Mimari & Modül Şeması

```mermaid
graph TD
    User([Kullanıcı / Enerji Yöneticisi]) --> Header[Dashboard Header: Tarih & Aralık Seçimi]
    User --> Selector[Widget Ekleme Modali]
    Selector --> Store[Zustand dashboardStore]
    Store --> Grid[DndContext & Sortable DashboardGrid]
    Grid --> W1[KPI Widget'ları]
    Grid --> W2[Elektrik Tüketim Grafikleri]
    Grid --> W3[Kapasitif / Endüktif Sayaçlar]
    Grid --> W4[Departman Analiz Grafikleri]
    DataService[dataService.ts & seed.json] --> Store
```

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- **Node.js**: v18.0 veya üstü

### Kurulum

```bash
git clone https://github.com/yucel-gumus/dynamic_dashboard.git
cd dynamic_dashboard

npm install
```

### Başlatma

```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

---

## 📂 Proje Dizin Yapısı

```
dynamic_dashboard/
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── store/
    │   └── dashboardStore.ts       # Grid yerleşimi ve widget durumları
    ├── services/
    │   └── dataService.ts          # Enerji veri servis katmanı
    ├── data/
    │   └── seed.json               # Örnek enerji telemetri verisi
    ├── components/
    │   ├── DashboardGrid.tsx       # Sürükle-bırak ana grid konteyneri
    │   ├── dashboard/              # Başlık ve bileşen seçici
    │   ├── widgets/                # Enerji grafikleri, sayaçlar ve KPI kartları
    │   └── ui/                     # Tooltip, modal ve tarih seçici
    └── types/
        └── index.ts                # Widget ve veri tipleri
```

---

## 📄 Lisans
Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

---

## 👨‍💻 Geliştirici & İletişim

**Yücel Gümüş** - Full Stack Developer

- 🌐 **Web Sitesi / Portfolyo:** [yucelgumus.dev](https://www.yucelgumus.dev/)
- 💼 **LinkedIn:** [linkedin.com/in/yucel-gumus](https://www.linkedin.com/in/yucel-gumus/)
- 🐙 **GitHub:** [@yucel-gumus](https://github.com/yucel-gumus)

<p align="left">
  <a href="https://www.yucelgumus.dev/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Developed%20by-Yücel%20Gümüş-blue?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Yücel Gümüş Portfolio" />
  </a>
</p>