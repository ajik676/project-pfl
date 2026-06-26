# DOKUMENTASI STRUKTUR CRM & DATABASE SMILEDENTAL LIVE
Dokumen ini menyajikan seluruh struktur sistem, pembagian modul CRM vs Operasional, arsitektur basis data, integrasi Supabase, rute halaman, serta kit komponen UI kustom yang diimplementasikan pada proyek **SmileDental CRM Platform** saat ini.

---

## 1. STRUKTUR RUTE & HALAMAN (ROUTING MAP)
Aplikasi terbagi menjadi dua area utama: **Area Publik** untuk pasien dan **Area Terproteksi** untuk staff/admin.

### A. Area Publik (Tanpa Login)
* **`/` (Landing Page)**: Halaman beranda publik premium. Berfungsi untuk mengenalkan layanan klinik, tingkatan membership, katalog reward, dan memungkinkan pasien berinteraksi secara mandiri dengan CRM (seperti cek poin dan hitung simulasi poin).
* **`/login`**: Halaman masuk akun staff/admin.
* **`/register`**: Halaman pendaftaran mandiri staff baru.
* **`/forgot`**: Halaman pemulihan kata sandi via email.

### B. Area Terproteksi Admin & Staff (Protected Workspace)
Rute-rute ini dibungkus oleh komponen keamanan `ProtectedRoute` dan menggunakan tata letak `MainLayout` (Sidebar + Header + Page Content):
* **`/dashboard`**: Pusat komando (Command Center) admin harian yang terbagi atas metrik CRM dan metrik Operasional.
* **`/patients`**: Daftar pasien terdaftar dilengkapi pencarian dan filter tabel.
* **`/patients/:id`**: Customer 360 View—detail profil lengkap pasien, riwayat CRM, dan riwayat klinis operasional.
* **`/patients/add`**: Form tambah pendaftaran pasien baru.
* **`/schedule`**: Manajemen jadwal antrean janji temu (*appointment*).
* **`/schedule/add`**: Form penjadwalan antrean janji temu baru.
* **`/memberships`**: Daftar level keanggotaan dan statistik sebaran member.
* **`/loyalty-rewards`**: Ledger poin loyalitas, katalog penukaran voucher reward, dan riwayat klaim voucher.
* **`/customer-activities`**: Log audit interaksi pasien (login, booking, payment, redeem).
* **`/feedback-reviews`**: Pusat manajemen ulasan rating bintang kepuasan pasien dan penanganan keluhan (*complaints*).
* **`/doctors`**: Profil dokter gigi spesialis bertugas dan beban shift kerja harian.
* **`/dental-records`**: Daftar dokumen rekam medis (tindakan & diagnosa) pasien.
* **`/treatments`**: Katalog layanan perawatan beserta tarif harga resmi.
* **`/transactions`**: Billing invoice, riwayat transaksi pembayaran kasir, dan metode pembayaran.
* **`/analytics`**: Laporan grafik analitik pendapatan, keuntungan, dan retensi retensi pelanggan harian/bulanan.
* **`/notifications`**: Pusat notifikasi log sistem.
* **`/settings`**: Panel administrasi pengguna untuk mengelola staff, jabatan (roles), dan izin akses (permissions) secara CRUD.

---

## 2. DETIL PEMBAGIAN SIDEBAR NAVIGASI
Navigasi sidebar dikelompokkan secara terstruktur berdasarkan fungsi bisnis untuk memudahkan penggunaan sehari-hari:

### A. DASHBOARD
* **Dashboard** (`/dashboard`): Menampilkan metrik visual instan, grafik Recharts untuk pasien dan pendapatan, serta daftar tugas harian kasir.

### B. CUSTOMER RELATIONSHIP MANAGEMENT (CRM)
Fokus pada retensi, kepuasan, loyalitas, dan interaksi pasien:
* **Pasien** (`/patients`): Pengelolaan database identitas pasien secara terpusat.
* **Membership** (`/memberships`): Pemantauan level tier loyalitas (*Bronze, Silver, Gold, Platinum*) dan persentase distribusinya.
* **Loyalty & Reward** (`/loyalty-rewards`): Manajemen poin loyalitas, katalog penukaran voucher, dan status klaim voucher diskon.
* **Aktivitas Pelanggan** (`/customer-activities`): Audit log riwayat aktivitas pasien pada aplikasi pasien.
* **Feedback & Review** (`/feedback-reviews`): Pengelolaan rating bintang ulasan dan penyelesaian keluhan pasien (*Complaint Management*).

### C. OPERASIONAL KLINIK
Fokus pada administrasi harian dan tindakan medis operasional:
* **Jadwal** (`/schedule`): Pengaturan antrean appointment dokter dan konfirmasi kedatangan pasien.
* **Dokter** (`/doctors`): Pengelolaan data dokter gigi spesialis on-duty dan rating kinerja dokter.
* **Rekam Medis** (`/dental-records`): Pencatatan riwayat perawatan, diagnosa klinis, gigi terdampak, dan tanggal kontrol selanjutnya.
* **Layanan** (`/treatments`): Pengelolaan katalog harga tindakan perawatan gigi.
* **Transaksi** (`/transactions`): Pencatatan invoice pembayaran pasien masuk, nominal, dan metode pembayaran.

### D. ANALYTICS & REPORTING
* **Laporan & Analitik** (`/analytics`): Grafik komprehensif pendapatan bulanan, Customer Lifetime Value (CLV), profit margin, dan laju pertumbuhan pasien baru.

### E. SYSTEM
* **Notifikasi** (`/notifications`): Log pemberitahuan real-time untuk janji temu baru, pendaftaran member baru, dan transaksi lunas.
* **Pengaturan** (`/settings`): Menu konfigurasi user management untuk staff.

---

## 3. INTEGRASI BASIS DATA SUPABASE & AUTHENTICATION
Keamanan otentikasi portal CRM ini sepenuhnya diintegrasikan menggunakan **Supabase Auth & Database Live**:

### A. Alur Otentikasi (Auth Flows)
* **Login Dual-Input (`Login.jsx`)**: Pengguna bisa masuk menggunakan **Alamat Email** atau **Username**. Jika menggunakan username, sistem secara otomatis melakukan pencarian email terkait di tabel `profiles` terlebih dahulu, kemudian memanggil kueri login bawaan `supabase.auth.signInWithPassword`.
* **Registrasi Mandiri (`Register.jsx`)**: Mendaftarkan akun baru ke Supabase Auth (`auth.users`) dengan menyertakan metadata tambahan (*Full Name, Username*).
* **Reset Password (`Forgot.jsx`)**: Memfasilitasi permintaan email pemulihan sandi secara instan menggunakan metode `supabase.auth.resetPasswordForEmail`.

### B. Otomatisasi Database (PostgreSQL Trigger)
Sistem dilengkapi fungsi trigger yang berjalan di server Supabase PostgreSQL. Sesaat setelah user berhasil mendaftar akun di `auth.users`, sistem secara otomatis menyisipkan data profil tersebut ke tabel publik `profiles` menggunakan skrip:
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### C. User Management CRUD (`Settings.jsx`)
Menu Settings memungkinkan admin kasir mengelola data staff langsung ke tabel `profiles` Supabase:
* **Read**: Menampilkan daftar staff, jabatan (role), status akun, dan array permissions.
* **Update**: Mengubah Nama Lengkap, Jabatan (Admin, Dokter, Resepsionis, dll.), Status Akun (Aktif/Nonaktif), serta mencentang izin hak akses (permissions) spesifik secara granular.
* **Delete**: Menghapus data akses profil staff dari database.
* **Fallback Mode**: Jika koneksi `.env` Supabase belum terisi, sistem secara otomatis beralih ke penyimpanan lokal (*localStorage*) agar aplikasi tetap dapat diuji coba tanpa gangguan (*zero-crash*).

---

## 4. INTERAKSI CRM PADA LANDING PAGE PUBLIK (`Landing.jsx`)
Halaman Landing Page publik menyajikan elemen CRM interaktif untuk menarik minat pasien baru dan memfasilitasi pasien lama:
* **Interactive Points Checker**: Pasien cukup menginputkan ID Pasien (misal: `PT-001`) atau nomor handphone mereka untuk memuat nama, level member, dan saldo poin loyalitas mereka secara real-time dari database.
* **Kalkulator Simulasi Poin**: Pasien dapat mengetikkan perkiraan nilai tagihan pembayaran perawatan gigi mereka untuk mensimulasikan jumlah poin loyalitas reward yang akan dikumpulkan (perkelipatan Rp 10.000).
* **Katalog Voucher Reward**: Menampilkan voucher penukaran aktif yang sah (seperti diskon perawatan 10% atau gratis bleaching gigi) untuk memacu retensi transaksi pasien.
* **Ulasan Kepuasan Pasien**: Grid ulasan dinamis dari kueri data feedbacks live.

---

## 5. REKAPITULASI DUA PILAR DASHBOARD UTAMA
Dashboard admin terbagi secara tegas menjadi dua kolom overview:

| Metrik CRM Overview (Hubungan Pelanggan) | Metrik Operasional Overview (Harian Klinik) |
| :--- | :--- |
| **Total Pasien**: Jumlah pasien terdaftar di database | **Appointment Hari Ini**: Antrean janji temu terjadwal hari ini |
| **Pasien Baru**: Jumlah pasien terdaftar bulan berjalan | **Dokter On-Duty**: Jumlah dokter spesialis yang sedang bertugas |
| **Member Aktif**: Pasien dengan level keanggotaan terverifikasi | **Revenue Hari Ini**: Total omset kasir terinput hari ini |
| **Satisfaction NPS**: Rata-rata bintang kepuasan pasien | **Treatment Selesai**: Total jumlah tindakan medis yang sukses |

---

## 6. DETAIL SKEMA TABEL DATABASE (`supabase_schema.sql`)
File basis data lengkap tersedia di root direktori [supabase_schema.sql](file:///c:/joki/ProjectAji/supabase_schema.sql), mendefinisikan 12 tabel terelasi:
1. **`profiles`**: UUID pengguna (FK ke `auth.users`), email, username unik, nama lengkap, role, status aktif, dan array permissions.
2. **`patients`**: ID Pasien (`PT-001`), data bio-diri, tingkat membership, keluhan utama, dan catatan admin.
3. **`doctors`**: ID Dokter (`DOC-001`), nama, spesialisasi, rating kepuasan, dan total kunjungan pasien.
4. **`schedules`**: ID Reservasi (`SCH-001`), relasi pasien (FK), tanggal, jam, dokter bertugas, keluhan, dan status antrean.
5. **`transactions`**: ID Billing (`TX-1001`), relasi pasien (FK), nama layanan, nominal tagihan, metode pembayaran (QRIS, Kartu Kredit, dll.), dan status.
6. **`dental_records`**: ID Medis (`REC-001`), relasi pasien (FK), dokter, diagnosis medis, tindakan perawatan gigi, catatan klinis, dan tanggal kontrol.
7. **`treatments`**: ID Katalog (`TR-001`), nama layanan, kategori, durasi rata-rata, harga, dan deskripsi detail.
8. **`customer_activities`**: ID Audit (`ACT-001`), nama pasien, jenis log tindakan, detail rincian, dan stempel waktu.
9. **`feedbacks`**: ID Ulasan (`FB-001`), nama pasien, nilai rating bintang (1-5), nama dokter, isi komentar, klasifikasi (Pujian/Keluhan/Saran), dan status penyelesaian.
10. **`loyalty_rewards_points`**: Saldo poin loyalitas berjalan dan tingkatan tier per pasien.
11. **`loyalty_rewards_redemptions`**: Log penukaran poin pasien ke voucher diskon (ID, nama voucher, poin terpotong, tanggal klaim).
12. **`notifications`**: Log riwayat notifikasi push janji temu atau pendaftaran baru.

---

## 7. KIT KOMPONEN UI KUSTOM PREMIUM (BEAUTIFIERS KIT)
Seluruh visual antarmuka dibangun menggunakan token desain visual premium (medical clean theme, rounded 20px, soft shadow, soft blue gradients) memanfaatkan reusable components kustom di folder [src/components/ui/](file:///C:/joki/ProjectAji/src/components/ui/):
* **`StatsCard`**: Menampilkan metrik kuantitatif dengan visual ikon, status tren naik/turun, dan deskripsi mini.
* **`Timeline` & `TimelineItem`**: Struktur vertikal estetik untuk audit log dan riwayat CRM.
* **`Rating`**: Komponen bintang visual untuk feedback.
* **`StatBar`**: Bar progress visual untuk membandingkan kapasitas beban shift antrean dokter bertugas.
* **`ScrollArea`**: Pembungkus elemen gulir dengan scrollbar tipis kustom.
* **`ImageCard`**: Kartu dokter bertugas dengan gradasi hover-effect dan avatar melayang.
* **`DataTable`**: Tabel data pintar dengan fitur pencarian teks instan, pengurutan kolom (*sorting*), dan pagination modern.
* **`Dialog`**: Modal pop-up modern dengan backdrop overlay blur untuk form edit dan cara pendaftaran staff.
