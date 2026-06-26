# SmileDental CRM - Dokumentasi Implementasi PRD v2

Dokumen ini menjelaskan tujuan, cakupan fitur interaktif, dan pemetaan kode untuk spesifikasi **PRD v2** pada platform **SmileDental CRM**.

---

## Tujuan PRD v2 (Goal)

Tujuan utama dari **PRD v2** adalah meningkatkan Landing Page MVP (v1) menjadi **Landing Page modern kelas B2B SaaS yang conversion-oriented dan penuh interaktivitas**. 

Halaman ini tidak hanya menampilkan teori atau teks promosi saja, melainkan menyediakan **modul demonstrasi live (Interactive Product Demo)** agar calon pengguna dapat langsung mencoba dan memahami kecanggihan fitur CRM seperti visualisasi rekam medis odontogram gigi, dinamika grafik analitik, simulasi pesan otomatis WhatsApp, dan perhitungan program poin loyalitas.

---

## Fitur & Struktur Halaman PRD v2

Semua modul interaktif PRD v2 terintegrasi secara dinamis di berkas **[src/pages/Landing.jsx](file:///C:/joki/ProjectAji/src/pages/Landing.jsx)**:

### 1. Sticky Navbar & Efek Scroll
* **Deskripsi**: Navbar yang menempel di bagian atas layar dengan latar belakang transparan menggunakan class Tailwind `sticky top-0 bg-white/60 backdrop-blur-md` untuk memberikan pengalaman navigasi yang premium.

### 2. Social Proof & Social Trust Indicators
* **Clinic Brands (Trust Indicators)**: Logotape klinik gigi terkemuka yang telah menggunakan platform (seperti DentCare Group, Smile Center, Jakarta Dental Clinic, dll).
* **Statistik Counter**: 4 metrik kinerja klinik yang realistis:
  * Pasien Terdaftar: `10,000+`
  * Klinik Aktif: `500+`
  * Janji Temu Sukses: `50,000+`
  * Rating Kepuasan: `4.9/5.0`

### 3. Problem & Solution Section (Owner, Dentist, Admin)
* Membagi tantangan klinik berdasarkan 3 persona pengguna: Owner (omset bocor & buta data), Dokter Gigi (rekam medis fisik berantakan), dan Kasir (beban kerja pendaftaran manual).
* Diikuti visualisasi 3 pilar solusi CRM SmileDental untuk mengatasinya secara efektif.

### 4. CRM Workflow (Timeline Alur Hubungan Pasien)
* **Tampilan**: Timeline horizontal berisi 8 tahapan siklus hidup hubungan pasien (Cari Info -> Registrasi -> Janji Temu -> Tindakan -> Rekam Medis -> Kasir -> Membership -> Klaim).
* **Interaksi**: Menggunakan state `activeStep`. Setiap langkah yang diklik akan memperbarui deskripsi kotak panduan di bawahnya secara dinamis.

### 5. Live Demo CRM Terpadu (4 Dimensi CRM)
Pengunjung dapat beralih di antara 3 tab demonstrasi produk yang terikat ke state `activeCrmTab`:

* **Operational CRM (Odontogram Gigi Interaktif)**:
  * Menampilkan barisan gigi atas dan bawah.
  * Pasien dapat dipilih dari dropdown (Andi Saputra, Siti Aisyah, Dewi Lestari, Heri Wijaya) untuk memuat data rekam medis mereka langsung dari `db.js`.
  * Gigi bermasalah diwarnai secara visual (Impaksi = Merah, Karies = Kuning, Pulpitis = Merah Tua, Kalkulus = Amber). Pengunjung dapat mengeklik nomor gigi untuk melihat diagnosis klinis.
* **Analytical CRM (Recharts Graph)**:
  * Grafik visual dinamis menggunakan library `recharts` (`AreaChart` dengan gradasi).
  * Pengunjung dapat mengeklik tombol toggle metrik (Omset, Pasien Baru, dan Retensi %) untuk merender ulang grafik data secara real-time.
* **Strategic CRM (WhatsApp Simulator & Loyalty Tools)**:
  * **WhatsApp Simulator**: Mockup handphone fungsional. Pengunjung memilih template (Reminder Janji, Promo Member, Feedback NPS) dan mengedit nama pasien untuk melihat preview pesan WhatsApp Business personal.
  * **Points Balance Checker**: Form kueri database live untuk memeriksa poin pasien berdasarkan ID Pasien (`PT-001`) atau nomor telepon.
  * **Points Calculator**: Alat hitung otomatis koin poin loyalitas dari nominal tagihan transaksi (1 poin per Rp 10.000).
* **Collaborative CRM (Membership Perks Explorer)**:
  * Menampilkan benefit dari 4 tingkatan keanggotaan (Bronze, Silver, Gold, Platinum).
  * Tombol "Simulasi Klaim Poin" akan memicu notifikasi *Toast* melayang di pojok kanan bawah, menyimulasikan pengurangan saldo poin member di portal kasir.

### 6. Katalog Lengkap B2B
* **Feature Grid (10 Fitur)**: Kartu komprehensif dari manajemen pasien, penjadwalan dokter, odontogram digital, membership, kasir multi-payment, analitik dashboard, WhatsApp reminder, complaints log, inventory, hingga multi-branch.
* **Benefits Grid (6 Benefit)**: Pengurangan beban kerja admin 40%, reduksi no-show 90%, enkripsi cloud, akurasi keuangan kasir, laporan 1-klik, dan peningkatan retensi.
* **Integrations (5 Konektor)**: Google Calendar, Gmail, WhatsApp API, Supabase DB, dan Payment Gateway.
* **Testimonials (3 Review)** & **FAQ (10 Accordions)**: Ulasan kepuasan owner/dokter gigi, serta 10 FAQ accordion interaktif (`faqOpenIndex`).

---

## Rincian Teknis Implementasi (v2)

* **Berkas Kode Utama**: [src/pages/Landing.jsx](file:///C:/joki/ProjectAji/src/pages/Landing.jsx)
* **Pustaka Utama**: `recharts` untuk visualisasi grafik bisnis dan `react-icons/hi` untuk ikonografi modern.
* **Keterkaitan Data**: Seluruh modul demo live mengambil data real-time dari basis data mock lokal [src/data/db.js](file:///C:/joki/ProjectAji/src/data/db.js).
