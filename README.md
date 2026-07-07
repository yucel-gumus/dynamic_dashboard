# 📊 Dinamik Enerji Yönetim Dashboard (Drag & Drop React Dashboard)

Dinamik Enerji Yönetim Dashboard; enerji tüketim verilerini gerçek zamanlı olarak görselleştiren, kullanıcıların arayüzdeki grafikleri ve KPI kartlarını sürükleyip bırakmasına (drag-and-drop), yeniden boyutlandırmasına (resize) ve kendi panellerini tasarlamasına imkan tanıyan, **React 19 & Vite 7 & TypeScript** tabanlı modern bir veri izleme (monitoring) uygulamasıdır.

---

## 🌟 Öne Çıkan Özellikler

* 🧩 **Sürükle-Bırak Izgara Düzeni (`react-grid-layout`):** Tüm grafikler ve widgetlar grid tabanlı bir düzendedir. Kullanıcılar kartları istedikleri gibi yerleştirebilir, büyütebilir veya küçültebilir.
* 💾 **Kalıcı Yerel Depolama (localStorage):** Kullanıcının tasarladığı özel grid düzeni, aktif/minimize edilmiş widget bilgileri ve tema tercihleri `ew-dashboard-layout-v1` anahtarı ile tarayıcı hafızasında saklanır. Sayfa yenilendiğinde düzen kaybolmaz.
* 📈 **Zengin Recharts Grafikleri & Veri Analizi:**
  * Enerji tüketim trendlerini gösteren çizgi (line), sütun (bar) ve pasta (pie) grafikleri.
  * **Moving Average (Hareketli Ortalama)** ve **Downsampling** filtreleri ile yüksek frekanslı enerji verileri gürültüden arındırılarak akıcı bir şekilde görselleştirilir.
* ⚡ **Zustand ile Performanslı State Yönetimi:** Context API re-render problemlerinden kaçınmak için hafif ve selector-based Zustand store'ları kullanılmıştır.
* 🌙 **Kapsamlı shadcn/ui & Radix UI Entegrasyonu:** Radix UI primitives sayesinde klavye ile navigasyon, ARIA etiketleri ve focus göstergeleri gibi erişilebilirlik (WCAG 2.1 AA) özellikleri gömülü olarak gelir.
* 📱 **Tam Responsive Kolon Yapısı:**
  * **Masaüstü (≥1280px):** 15 Kolon grid düzeni.
  * **Tablet (768px - 1279px):** 8 Kolon grid düzeni.
  * **Mobil (<640px):** 1 Kolon tek sıra düzeni.

---

## 🏗️ Veri Akışı ve Durum Yönetimi

```
[ Kullanıcı Widget Sürükler/Boyutlandırır ]
                   │
                   ▼
[ react-grid-layout (OnLayoutChange) ]
                   │
                   ▼
[ Zustand Store (Persist Middleware) ] ──► [ localStorage (Kalıcı Kayıt) ]
                   │
                   ▼
[ Recharts (Dinamik Render) ] ──► [ Web Tarayıcı (60 FPS) ]
```

---

## 🛠️ Teknoloji Stack

* **Frontend Framework:** React 19.1, TypeScript 5.8, Vite 7.1.
* **Tasarım:** TailwindCSS v3.4, shadcn/ui (Radix UI), Lucide React Icons.
* **Grid Motoru:** `react-grid-layout`, `@dnd-kit/core` & `@dnd-kit/utilities`.
* **Grafik Kütüphanesi:** Recharts (SVG tabanlı duyarlı grafikler).
* **State Management:** Zustand.
* **Tarih & Zaman Yardımcıları:** date-fns.

---

## 📂 Proje Klasör Yapısı

```
dynamic_dashboard/
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui ortak arayüz bileşenleri
│   │   ├── DashboardGrid.tsx # Sürükle-bırak grid container bileşeni
│   │   └── WidgetPanel.tsx   # Yeni widget ekleme / arama paneli
│   ├── store/
│   │   └── useDashboardStore.ts # Zustand store ve localStorage persist kuralları
│   ├── types/                # Layout ve widget TypeScript tanımları
│   ├── App.tsx               # Ana React arayüz katmanı
│   └── main.tsx
├── tailwind.config.js        # Dashboard özel renk ve tasarım tokenları
└── package.json              # Deploy komutları ve drag-and-drop bağımlılıkları
```

---

## 🚀 Kurulum ve Yerel Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
git clone https://github.com/yucel-gumus/dynamic_dashboard.git
cd dynamic_dashboard
npm install
```

### 2. Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```
Uygulama `http://localhost:5173` adresinde başlayacaktır.

### 3. GitHub Pages Üzerinden Yayına Alma (Deploy)
Projenizi derleyip otomatik olarak `gh-pages` dalına göndermek için:
```bash
npm run deploy
```

---

## 🔗 Canlı Bağlantılar
* **Canlı Demo:** [https://yucel-gumus.github.io/dynamic_dashboard/](https://yucel-gumus.github.io/dynamic_dashboard/)
* **Geliştirici LinkedIn:** [https://linkedin.com/in/yucel-gumus](https://linkedin.com/in/yucel-gumus)