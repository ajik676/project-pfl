# DESIGN.MD — SmileDental CRM
## Panduan Desain Lengkap untuk Google Stitch

---

## Ringkasan Produk

**SmileDental CRM** adalah platform SaaS berbasis web untuk manajemen klinik dokter gigi. Sistem ini mencakup dua area utama:

1. **Landing Page Publik** — Halaman promosi marketing (route `/`) yang ditujukan kepada calon pengguna (owner klinik, dokter gigi, staf kasir).
2. **Admin Dashboard** — Portal manajemen internal klinik (route `/dashboard`, `/patients`, dll) yang diakses setelah login.

**Stack**: React 19, Vite 7, Tailwind CSS v4, Recharts, react-icons/hi, React Router DOM v7, Supabase Auth.

---

## 1. Color Palette (Palet Warna)

### Warna Utama Brand

| Nama Token | Nilai Hex | Kegunaan |
|---|---|---|
| `--color-hijau` | `#00B074` | Primary green — CTA utama, badge sukses, grafik, gigi sehat, aksen keceriaan |
| `--color-biru` | `#3b82f6` | Primary blue — Tombol login, navigasi aktif sidebar, Kalkulator poin |
| `--color-merah` | `#ef4444` | Danger — Alert, gigi bermasalah, pain point sections |
| `--color-kuning` | `#f59e0b` | Warning — Badge peringatan, status "Menunggu" |
| `--color-latar` | `#f3f4f6` | Page background (admin dashboard) |
| `--color-teks` | `#374151` | Primary body text |
| `--color-teks-samping` | `#6b7280` | Secondary/muted text |
| `--color-garis` | `#e5e7eb` | Border lines, dividers |

### Warna Pelengkap (Tailwind CSS)

| Token Tailwind | Hex | Dipakai di |
|---|---|---|
| `slate-900` | `#0f172a` | Dark heading text, footer background |
| `slate-800` | `#1e293b` | Dashboard dark cards (CRM console) |
| `slate-700` | `#334155` | Secondary dark text |
| `slate-500` | `#64748b` | Muted text, icon warna default |
| `slate-200` | `#e2e8f0` | Border tipis, divider |
| `slate-100` | `#f1f5f9` | Background input, card alt |
| `slate-50` | `#f8fafc` | Page background (landing) |
| `amber-500` | `#f59e0b` | Karies, Gold tier badge |
| `red-500` | `#ef4444` | Impaksi gigi, danger |
| `blue-600` | `#2563eb` | Auth layout warna biru tua |
| `indigo-600` | `#4f46e5` | Hero dashboard gradient |
| `white` | `#ffffff` | Card background, form background |

### Gradasi Khas Proyek

```
Hero & Benefit Card   : from-biru via-hijau/90 to-hijau  (biru → hijau)
Dashboard Hero Banner : from-blue-600 via-indigo-600 to-indigo-800
CTA Final Banner      : from-biru via-hijau to-slate-900
Membership Platinum   : from-biru to-blue-400
Auth Layout BG        : #f0f7ff  (biru pucat lembut)
Auth Logo Icon BG     : #1769b0  (biru brand auth)
```

### Opacity Modifier Pattern

Proyek menggunakan sistem opacity alpha Tailwind v4 secara konsisten:

```
bg-hijau/10    → Latar badge/background ringan warna hijau
bg-hijau/20    → Hover state ringan
border-hijau/25 → Border tipis warna brand
bg-biru/10     → Latar ringan biru (kalkulator, info)
shadow-hijau/20 → Glow shadow halus
```

---

## 2. Typography (Tipografi)

### Font Families

| Nama | Font | Kelas | Kegunaan |
|---|---|---|---|
| **Poppins ExtraBold** | Poppins (local `/fonts/Poppins-ExtraBold.ttf`) | `font-poppins` | Heading h1–h5, label badge, tombol CTA, nama brand logo |
| **Barlow Regular** | Barlow (local `/fonts/Barlow-Regular.ttf`) | `font-barlow` | Body text, paragraf, deskripsi, isi chat WA, footer, FAQ body |
| **Auth Layout** | Fraunces (serif) + Geist (sans) | inline style | Dipakai eksklusif di halaman Login/Register/Forgot |

### Hierarki Ukuran Teks

| Elemen | Kelas Tailwind | Keterangan |
|---|---|---|
| Hero h1 | `text-4xl sm:text-5xl lg:text-6xl font-black font-poppins` | Headline utama Landing Page |
| Section h2 | `text-3xl font-black font-poppins` | Judul setiap section |
| Card h4 | `text-sm font-black font-poppins` | Judul fitur/benefit card |
| StatsCard value | `text-2xl font-black` | Angka KPI besar di dashboard |
| Body paragraph | `text-sm font-medium font-barlow` / `text-xs font-semibold` | Deskripsi umum |
| Label uppercase | `text-[10px] font-black uppercase tracking-wider` | Label kategori, badge mini |
| Caption/muted | `text-[9px] font-bold uppercase tracking-widest` | Sub-label kecil |
| Dropdown/Notif | `text-[11px] font-semibold` | Teks dalam dropdown kecil |

---

## 3. Border Radius & Spacing

### Radius Standar

| Elemen | Nilai | Keterangan |
|---|---|---|
| Card utama | `rounded-2xl` (`16px`) / `rounded-[22px]` | Dashboard cards |
| Card besar (Landing) | `rounded-[28px]` – `rounded-[36px]` | Landing feature/membership cards |
| Tombol default | `rounded-xl` (`12px`) | Button component default |
| Tombol besar | `rounded-2xl` | CTA hero button `size="lg"` |
| Badge/Tag | `rounded-full` | Semua badge label |
| Input field | `rounded-xl` | Form input fields |
| Sidebar brand card | `rounded-2xl` | Header brand card sidebar |
| Floating card hero | `rounded-[32px]` – `rounded-[42px]` | Elemen melayang di Hero |
| Avatar | `rounded-xl` / `rounded-full` | Avatar icon dokter |

### Spacing Rhythm

| Area | Nilai |
|---|---|
| Page padding (dashboard) | `p-4 md:p-6` |
| Card internal padding | `p-5` – `p-6` |
| Section gap (landing) | `space-y-12` |
| Card gap dalam grid | `gap-6` |
| Sidebar width (fixed) | `w-64` (`256px`) |
| Header height | Auto (sekitar `64px`) |

---

## 4. Shadow & Efek Visual

### Shadow System

```
shadow-sm           → Kartu ringan, sidebar
shadow-md           → Card hover state
shadow-xl           → Hero floating card, modal, CTA banner
shadow-2xl          → Dark console panel kanan dashboard
shadow-blue-500/10  → Colored glow (biru)
shadow-hijau/20     → Colored glow (hijau brand)
```

### Glassmorphism Classes

```css
.glassmorphism {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.glassmorphism-hijau {
  background: rgba(209, 250, 229, 0.3);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.03);
}

.glow-shadow-hijau { box-shadow: 0 10px 30px -10px rgba(0, 176, 116, 0.25); }
.glow-shadow-biru  { box-shadow: 0 10px 30px -10px rgba(59, 130, 246, 0.25); }
```

### Animasi & Keyframes

```
animate-float-slow     → float 6s ease-in-out infinite  (naik turun halus)
animate-float-fast     → float 3s ease-in-out infinite  (lebih cepat)
animate-spin-slow      → spin 12s linear infinite
animate-pulse-slow     → pulse 3s cubic-bezier(0.4,0,0.6,1) infinite
animate-shimmer        → shimmer 2.5s infinite linear
animate-bounce         → default Tailwind bounce
animate-ping           → default Tailwind ping (online indicator)
```

---

## 5. Layout & Struktur Halaman

### A. Layout Admin Dashboard (`MainLayout`)

```
┌──────────────────────────────────────────────────────┐
│  SIDEBAR (w-64, fixed left, h-screen, bg-white)      │
│  ┌────────────────────────────────────────────────┐  │
│  │  Logo Brand Card                               │  │
│  │  Server Online indicator (green ping dot)      │  │
│  │  ─────────────────────────────────────         │  │
│  │  [NAV GROUP] Dashboard                         │  │
│  │  [NAV GROUP] CRM:                              │  │
│  │    • Pasien  • Membership  • Loyalty           │  │
│  │    • Aktivitas Pelanggan  • Feedback           │  │
│  │  [NAV GROUP] Operasional:                      │  │
│  │    • Jadwal  • Dokter  • Rekam Medis           │  │
│  │    • Layanan  • Transaksi                      │  │
│  │  [NAV GROUP] Analytics & Reports               │  │
│  │  [NAV GROUP] System:                           │  │
│  │    • Notifikasi  • Pengaturan & Staff          │  │
│  │  ─────────────────────────────────────         │  │
│  │  Quick CTA: Tambah Jadwal (blue button)        │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  MAIN CONTENT (ml-64, flex-1)                        │
│  ┌────────────────────────────────────────────────┐  │
│  │  HEADER (full width, bg-white/90, shadow-sm)   │  │
│  │  [Greeting + Search] ──────── [Notif + Profile]│  │
│  ├────────────────────────────────────────────────┤  │
│  │  PAGE CONTENT (p-6, bg-[#F8FAFC])             │  │
│  │  <Outlet />                                    │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

**Background admin**: `bg-[#F3F4F6]` / `bg-[#F8FAFC]`
**Sidebar**: `bg-white`, lebar tetap `w-64`, `h-screen fixed left-0 top-0`
**Header**: sticky full-width, `bg-white/90 backdrop-blur-sm border-b border-slate-100`

---

### B. Layout Landing Page Publik

Satu komponen panjang `src/pages/Landing.jsx` dengan urutan section:

```
1.  STICKY NAVBAR          → top-0, glassmorphism blur
2.  HERO SECTION           → gradient bg, floating cards kanan
3.  WAVE DIVIDER SVG       → transisi organik
4.  TRUSTED BY             → logotape klinik, grayscale hover
5.  STATISTICS CARDS       → 4-kolom grid counter
6.  WAVE DIVIDER SVG
7.  PROBLEM SECTION        → 3 kartu pain point (abu-abu)
8.  WAVE DIVIDER SVG
9.  SOLUTION SECTION       → 3 item + benefit gradient card
10. WAVE DIVIDER SVG
11. CRM WORKFLOW TIMELINE  → 8 step horizontal grid (abu-abu)
12. WAVE DIVIDER SVG
13. INTERACTIVE DEMO       → Tab 3 modul CRM + Dark Console
14. WAVE DIVIDER SVG
15. MEMBERSHIP PERKS       → 4 tier cards (abu-abu)
16. WAVE DIVIDER SVG
17. SMILE METER            → widget gamifikasi gigi (putih)
18. FEATURE GRID           → 10 kartu fitur (putih)
19. WAVE DIVIDER SVG
20. BENEFITS GRID          → 6 kartu benefit (abu-abu)
21. WAVE DIVIDER SVG
22. INTEGRATIONS           → 5 kartu koneksi (putih)
23. WAVE DIVIDER SVG
24. TESTIMONIALS           → 3 kartu review (abu-abu)
25. WAVE DIVIDER SVG
26. FAQ SECTION            → 10 accordion (putih)
27. FINAL CTA BANNER       → gradient biru-hijau gelap
28. FOOTER                 → slate-950, dark
```

---

### C. Layout Halaman Auth (`AuthLayout`)

```
┌──────────────────────────────────────────┐
│  bg: #f0f7ff (biru pucat sangat terang)  │
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │ TOP BAR: Logo + Step Dots (3 dots)  │ │
│  ├─────────────────────────────────────┤ │
│  │ HERO TEXT:                          │ │
│  │   Label kecil: "Portal Admin"       │ │
│  │   H1: "Selamat Datang"              │ │
│  │   Italic brand: "Klink Smile Dental"│ │
│  │   Subtitle deskripsi               │ │
│  ├─────────────────────────────────────┤ │
│  │ CARD FORM (bg-white, shadow besar)  │ │
│  │   <Outlet /> → Login/Register form  │ │
│  │   Divider "atau masuk dengan"       │ │
│  │   Google | Microsoft buttons        │ │
│  ├─────────────────────────────────────┤ │
│  │ Trust Pills: Enkripsi, Terverif...  │ │
│  └─────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

**Font Auth**: `Fraunces` (serif, heading h1) + `Geist` (sans, body)
**Warna Auth**: Brand biru `#1769b0`, dark text `#0a2540`

---

## 6. Component Library

### Button

| Variant | Tampilan | Kegunaan |
|---|---|---|
| `default` | bg-blue-600, teks putih | Aksi utama umum |
| `destructive` | bg-red-600, teks putih | Hapus, batalkan |
| `outline` | Border slate-200, bg-white | Aksi sekunder |
| `secondary` | bg-slate-100, teks slate-800 | Aksi netral |
| `ghost` | Hover bg-slate-100 | Menu item action |
| `link` | Teks biru, tanpa bg | Tautan aksi |

| Size | Padding | Radius |
|---|---|---|
| `sm` | `px-3 py-1.5 text-xs` | `rounded-lg` |
| `default` | `px-4 py-2.5 text-[13px]` | `rounded-xl` |
| `lg` | `px-6 py-3 text-sm` | `rounded-2xl` |
| `icon` | `h-10 w-10 p-0` | `rounded-xl` |

**Base**: `inline-flex items-center justify-center font-semibold transition-all focus:ring-4 active:scale-[0.98]`

---

### Badge

```
Base: inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider
```

| Variant | Tampilan |
|---|---|
| `default` | bg-blue-600, teks putih |
| `secondary` | bg-slate-100, border slate-200 |
| `destructive` | bg-red-50, teks merah |
| `success` | bg-emerald-50, teks hijau |
| `warning` | bg-amber-50, teks amber |
| `info` | bg-sky-50, teks biru muda |
| `outline` | teks slate-700, border slate-300 |

**Khusus Landing (custom)**: Menggunakan class Tailwind langsung seperti `bg-hijau/10 text-hijau border-0`.

---

### Card

```
Base card: bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden

CardHeader:  px-6 py-5 border-b border-slate-50 flex flex-col gap-1.5
CardTitle:   text-base font-bold text-slate-900 leading-none
CardDesc:    text-xs text-slate-500 font-medium
CardContent: p-6
CardFooter:  px-6 py-4 bg-slate-50/50 border-t border-slate-50
```

---

### Input

```
Base: w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl
      text-xs text-slate-700 font-semibold
      focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400
      transition-all

Error state: border-red-300 focus:ring-red-100 focus:border-red-400
With icon:   pl-10 (icon absolute left-3.5)
```

---

### StatsCard

```
Base: p-5 rounded-[22px] transition-all hover:-translate-y-0.5
      flex items-center justify-between

Variant "default":
  bg-white border border-slate-200/60 shadow-sm
  title: text-slate-400
  value: text-slate-800

Variant "gradient-blue":
  bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700
  teks putih, shadow biru

Variant "gradient-emerald":
  bg-gradient-to-br from-emerald-500 to-teal-600
  teks putih, shadow hijau

Title:  text-[10px] font-bold uppercase tracking-wider
Value:  text-2xl font-black (angka KPI)
Trend:  pill kecil (bg-emerald-50 text-emerald-600 jika positif)
Icon:   w-11 h-11 rounded-2xl bg-slate-50 border-slate-100
```

---

### Timeline

```
Wrapper: relative border-l border-slate-200 ml-3.5 pl-6 space-y-5

TimelineItem:
  Bullet dot: absolute -left-[31px] h-4.5 w-4.5 rounded-full border-2
    Active: bg-blue-600 border-white shadow-md ring-4 ring-blue-50
    Inactive: bg-white border-slate-300
  Title: text-xs font-bold text-slate-800
  Time:  text-[10px] text-slate-400 font-semibold
  Desc:  text-[11px] text-slate-500 font-medium leading-relaxed
```

---

### NavItem (Sidebar)

```
Base NavLink: flex items-center gap-2.5 px-3 py-2 rounded-xl
              text-xs font-bold tracking-tight transition-all

Active:   bg-blue-50 text-blue-600 border border-blue-100/20 shadow-sm
Inactive: text-slate-500 hover:bg-slate-50 hover:text-slate-800

Badge count: text-[9px] font-black px-1.5 py-0.5 rounded-full
  Active:   bg-blue-200 text-blue-700
  Inactive: bg-slate-100 text-slate-500
```

---

### Komponen Tambahan

| Komponen | Deskripsi |
|---|---|
| `Avatar` | Lingkaran/rounded-xl inisial huruf atau image |
| `Dialog` | Modal overlay dengan backdrop blur, rounded-2xl |
| `DropdownMenu` | Popover melayang, shadow-xl, rounded-xl, z-50 |
| `Progress` | Progress bar horizontal, bg-blue-600, rounded-full |
| `Rating` | Bintang interaktif (klik) atau read-only |
| `Skeleton` | Placeholder loading pulsa, bg-slate-200 |
| `StatBar` | Bar horizontal progress untuk beban kerja dokter |
| `Tabs` | Tab navigasi horizontal, border-b, active underline |
| `Toast` | Notifikasi melayang bottom-right, slide animation |
| `Tooltip` | Hover popup kecil, bg-slate-900 teks putih |
| `Separator` | Garis pembatas horizontal, opsional label tengah |
| `EmptyState` | Placeholder data kosong dengan emoji dan deskripsi |

---

## 7. Navigasi & Routing

### Halaman Admin (Requires Auth)

| Route | Halaman |
|---|---|
| `/dashboard` | Dashboard utama (KPI, chart, timeline, tasks) |
| `/patients` | Daftar pasien dengan DataTable |
| `/patients/add` | Form tambah pasien baru |
| `/patients/:id` | Detail profil pasien + odontogram + loyalty |
| `/memberships` | Daftar dan manajemen tier keanggotaan |
| `/memberships/:id` | Detail member + riwayat poin |
| `/loyalty-rewards` | Katalog voucher dan saldo poin |
| `/customer-activities` | Log aktivitas pelanggan |
| `/feedback-reviews` | Ulasan & rating bintang pasien |
| `/schedule` | Kalender & daftar jadwal |
| `/schedule/add` | Form buat jadwal baru |
| `/schedule/:id` | Detail jadwal |
| `/doctors` | Daftar dokter dan grid kartu profil |
| `/dental-records` | Daftar rekam medis |
| `/dental-records/:id` | Detail rekam medis + odontogram |
| `/treatments` | Daftar layanan tindakan |
| `/transactions` | Daftar transaksi & invoice |
| `/transactions/:id` | Detail transaksi |
| `/analytics` | Halaman grafik analitik bisnis |
| `/notifications` | Pusat notifikasi |
| `/notifications/:id` | Detail notifikasi |
| `/settings` | Pengaturan staff & manajemen user |

### Halaman Auth (Public)

| Route | Halaman |
|---|---|
| `/login` | Form login email/username + password |
| `/register` | Form pendaftaran akun baru |
| `/forgot` | Form reset password |

### Halaman Publik

| Route | Halaman |
|---|---|
| `/` | Landing Page marketing SmileDental CRM |

---

## 8. Pola Desain Berulang

### Section Pattern (Landing Page)

Setiap section landing mengikuti pola konsisten:

```
1. Badge kecil warna hijau/merah di atas (kategori label)
2. h2 judul besar font-poppins font-black
3. Paragraf deskripsi xs text-slate-400
4. Grid/card/interactive content
```

### Card Hover Pattern

```
hover:shadow-md           → elevasi bayangan naik
hover:-translate-y-1.5    → bergerak ke atas sedikit
transition-all duration-300
```

### Latar Belakang Alternating (Landing)

```
Section putih  → bg-white / transparent
Section abu    → bg-slate-100/60
Transisi       → SVG Wave Divider (WaveTop / WaveBottom)
```

### Dark Console Panel

Di halaman Landing, panel kanan demo menggunakan dark mode:

```
bg-slate-900 text-slate-200 rounded-[36px]
border border-slate-800 shadow-2xl
```

Warna teks di dalam: `text-hijau` untuk metric positif, `text-white` untuk angka utama.

---

## 9. Dashboard Page — Anatomi Konten

### Urutan Elemen di `/dashboard`

```
1. Welcome Hero Banner Card
   → gradient-to-br from-blue-600 via-indigo-600 to-indigo-800
   → Greeting dinamis + KPI mini (antrean, NPS, revenue hari ini)
   → Floating blur circles sebagai dekorasi

2. KPI Stats Row (4-grid)
   → StatsCard: Total Pasien, Anggota Aktif, Janji Hari Ini, Revenue
   → Variant: default (putih) atau gradient-blue/emerald

3. Area Chart Recharts (Tren Bulanan)
   → AreaChart + ComposedChart
   → Dua metrik: Pasien (bar) + Revenue (line)
   → Warna stroke: blue-600 dan indigo-400

4. Doctor Workload (StatBar)
   → Progress bar tiap dokter (% slot terisi)

5. Upcoming Appointments (daftar jadwal)
   → List item: nama pasien, jam, status badge

6. CRM Activity Timeline
   → Timeline + TimelineItem dengan bullet dots
   → Active = biru, Inactive = abu

7. Task Checklist
   → Checkbox toggle per task dengan strikethrough
```

---

## 10. Warna Status & State

| Status | Warna Token | Contoh Penggunaan |
|---|---|---|
| Sehat / Aktif | `text-hijau` / `bg-hijau/10` | Gigi sehat, member aktif, server online |
| Sukses / Done | `bg-emerald-50 text-emerald-600` | Badge "Selesai", trend positif |
| Menunggu | `bg-amber-50 text-amber-600` | Jadwal pending, warning |
| Batal / Bahaya | `bg-red-50 text-red-500` | Hapus, impaksi gigi, error form |
| Info / Sistem | `bg-blue-50 text-blue-600` | Notifikasi info, nav aktif |
| Platinum Tier | `from-biru to-blue-400` | Keanggotaan tertinggi |
| Gold Tier | `from-yellow-600 to-amber-400` | Keanggotaan gold |
| Silver Tier | `from-slate-500 to-slate-400` | Keanggotaan silver |
| Bronze Tier | `from-amber-700 to-amber-500` | Keanggotaan bronze |

---

## 11. Ikon

Proyek menggunakan **react-icons/hi** (Heroicons Outline & Solid):

| Ikon | Nama | Dipakai di |
|---|---|---|
| HiOutlineUsers | Grup orang | Nav Pasien, KPI card |
| HiOutlineBadgeCheck | Badge centang | Nav Membership |
| HiOutlineGift | Hadiah | Nav Loyalty |
| HiOutlineChatAlt | Balon chat | Nav Feedback, WhatsApp |
| HiOutlineCalendar | Kalender | Nav Jadwal, date picker |
| HiOutlineClipboardList | Clipboard | Nav Rekam Medis |
| HiOutlineCreditCard | Kartu kredit | Nav Transaksi |
| HiOutlineChartBar | Grafik | Nav Analitik |
| HiOutlineBell | Lonceng | Notifikasi |
| HiOutlineCog | Gear | Pengaturan |
| HiOutlineTrendingUp | Naik | Trend positif, audit log |
| HiOutlineTrendingDown | Turun | Trend negatif |
| HiOutlineSparkles | Bintang sparkle | CTA hero |
| HiOutlineShieldCheck | Perisai | Fitur keamanan |
| HiSearch | Kaca pembesar | Global search |
| HiChevronDown | Panah bawah | Dropdown toggle, FAQ |
| HiOutlineArrowRight | Panah kanan | Link navigasi |

---

## 12. Komponen Interaktif Unik

### Odontogram Gigi (Landing + Admin)

Peta gigi digital yang dapat diklik. Setiap gigi adalah `<button>` dengan warna berdasarkan diagnosis:

```
Sehat    → bg-hijau (hijau brand)
Karies   → bg-kuning (kuning)
Impaksi  → bg-merah (merah)
Pulpitis → bg-red-650 (merah gelap)
Kalkulus → bg-amber-500
```

Selected state: `ring-2 ring-biru scale-105`

### Smile Meter Widget

Widget progres senyum pasien:
- 4 pilihan: 😭 Sakit, 😕 Kurang Pede, 😊 Sehat, 😁 Ceria
- Progress bar animated: `bg-gradient-to-r from-biru to-hijau`
- Transition width 0.7s ease-out pada lebar progress

### SVG Wave Divider

Dua varian komponen SVG untuk transisi organik antar section:
- `<WaveTop>` — untuk masuk ke section abu-abu dari putih
- `<WaveBottom>` — untuk keluar dari section abu-abu ke putih
- Ukuran SVG path standar, ketinggian `h-[40px]`

---

## 13. Responsiveness

| Breakpoint | Keterangan |
|---|---|
| Mobile (default) | Single column, stacked layout |
| `sm` (640px) | 2 kolom untuk grid statistik |
| `md` (768px) | Sidebar tersembunyi (landing), 2 kolom dashboard |
| `lg` (1024px) | Sidebar visible, 12-kolom grid, 3 kolom feature grid |

Landing page navbar: Menu tersembunyi di bawah `lg` → `hidden lg:flex`
Sidebar dashboard: Fixed, tidak collapse (belum ada mobile burger menu)

---

## 14. Tone Desain Keseluruhan

- **Industri**: Healthcare / Medical / SaaS B2B
- **Mood**: Ceria, segar, modern, terpercaya, bersih
- **Kontras**: Landing page terang & putih ↔ Dashboard fungsional & data-dense
- **Animasi**: Halus, micro-interactions, tidak berlebihan
- **Keunikan**: Warna hijau mint (`#00B074`) sebagai brand identity utama, menggantikan biru klinis standar industri kesehatan

---

*Dokumen ini merepresentasikan seluruh design system SmileDental CRM yang sedang berjalan di production. Semua warna, ukuran, komponen, dan pola layout diambil langsung dari kode sumber proyek.*
