// Central State Manager with localStorage backup for persistence.

// DB Version to force re-seeding when rich data is updated
const DB_VERSION_KEY = "crm_db_version";
const CURRENT_DB_VERSION = "v2.1_rich_patient_data";

const DEFAULT_PATIENTS = [
  {
    id: "PT-001",
    name: "Andi Saputra",
    gender: "Laki-laki",
    age: 25,
    phone: "08123456789",
    email: "andi.saputra@gmail.com",
    address: "Jl. Sudirman No. 12",
    city: "Jakarta",
    registeredDate: "2025-01-15",
    membershipStatus: "Aktif",
    membershipLevel: "Bronze",
    complaint: "Scaling Gigi",
    status: "Aktif",
    adminNotes: "Pasien memiliki sensitivitas dingin pada gigi geraham bawah kiri. Perlu perhatian ekstra saat scaling.",
    history: [
      { date: "2026-06-14", doctor: "drg. Rina Amelia", action: "Scaling Gigi", notes: "Pembersihan karang gigi rahang atas & rahang bawah selesai." },
      { date: "2025-12-10", doctor: "drg. Rina Amelia", action: "Konsultasi Umum", notes: "Checkup rutin, terdeteksi kalkulus ringan." }
    ],
    complaints: [
      { id: "C-1", text: "Pelayanan sedikit antri di akhir pekan", date: "2026-02-10" }
    ],
    feedbacks: [
      { id: "F-1", rating: 4, review: "Klinik sangat bersih, dokter ramah.", date: "2026-02-11" }
    ]
  },
  {
    id: "PT-002",
    name: "Siti Aisyah",
    gender: "Perempuan",
    age: 30,
    phone: "08234567890",
    email: "siti.aisyah@yahoo.com",
    address: "Jl. Melati No. 45",
    city: "Bandung",
    registeredDate: "2024-11-20",
    membershipStatus: "Aktif",
    membershipLevel: "Gold",
    complaint: "Cabut Gigi Bungsu",
    status: "Aktif",
    adminNotes: "Alergi terhadap obat Penicillin. Perlu dipantau ketat pasca bedah. Berikan analgesik non-penisilin.",
    history: [
      { date: "2026-06-14", doctor: "drg. Budi Hermawan", action: "Odontektomi Gigi Bungsu", notes: "Operasi pengangkatan gigi bungsu selesai dilakukan." },
      { date: "2026-06-10", doctor: "drg. Budi Hermawan", action: "Rontgen Gigi + Konsultasi", notes: "Terlihat impaksi posisi mesioangular." }
    ],
    complaints: [],
    feedbacks: [
      { id: "F-2", rating: 5, review: "Penjelasan dokter sangat detail mengenai tindakan bedah.", date: "2026-06-12" }
    ]
  },
  {
    id: "PT-003",
    name: "Budi Santoso",
    gender: "Laki-laki",
    age: 40,
    phone: "08345678901",
    email: "budi.santoso@outlook.com",
    address: "Jl. Merdeka No. 8",
    city: "Surabaya",
    registeredDate: "2023-05-10",
    membershipStatus: "Aktif",
    membershipLevel: "Platinum",
    complaint: "Pasang Behel",
    status: "Aktif",
    adminNotes: "Pasien rutin kontrol behel setiap 4 minggu sekali. Disiplin tinggi menjaga kebersihan bracket.",
    history: [
      { date: "2026-06-05", doctor: "drg. Sinta Natalia", action: "Kontrol Bracket", notes: "Penggantian kawat busur atas & karet." },
      { date: "2026-05-02", doctor: "drg. Sinta Natalia", action: "Aktivasi Kawat", notes: "Pengencangan kawat behel rahang bawah." }
    ],
    complaints: [],
    feedbacks: [
      { id: "F-4", rating: 4, review: "Hasil kawat rapi, kontrol rutin dilayani ramah.", date: "2026-06-05" }
    ]
  },
  {
    id: "PT-004",
    name: "Dewi Lestari",
    gender: "Perempuan",
    age: 28,
    phone: "08456789012",
    email: "dewi.lestari@gmail.com",
    address: "Jl. Anggrek No. 102",
    city: "Yogyakarta",
    registeredDate: "2025-03-02",
    membershipStatus: "Aktif",
    membershipLevel: "Silver",
    complaint: "Tambal Gigi",
    status: "Aktif",
    adminNotes: "Sering cemas saat mendengar suara dental drill. Gunakan pendekatan lembut dan musik relaksasi.",
    history: [
      { date: "2026-06-12", doctor: "drg. Rina Amelia", action: "Tambal Gigi Depan", notes: "Menggunakan bahan resin komposit." }
    ],
    complaints: [],
    feedbacks: [
      { id: "F-3", rating: 5, review: "Dokter sangat sabar menenangkan saya yang phobia bor.", date: "2026-06-12" }
    ]
  },
  {
    id: "PT-005",
    name: "Rian Hidayat",
    gender: "Laki-laki",
    age: 22,
    phone: "08567890123",
    email: "rian.hidayat@gmail.com",
    address: "Jl. Diponegoro No. 19",
    city: "Tangerang",
    registeredDate: "2026-06-01",
    membershipStatus: "Aktif",
    membershipLevel: "Bronze",
    complaint: "Teeth Whitening",
    status: "Aktif",
    adminNotes: "Pasien menginginkan tingkat kecerahan maksimal. Hindari kopi/teh pasca tindakan.",
    history: [
      { date: "2026-06-13", doctor: "drg. Sinta Natalia", action: "Bleaching Gigi", notes: "Penerapan gel bleaching laser selesai." }
    ],
    complaints: [],
    feedbacks: [
      { id: "F-5", rating: 5, review: "Gigi saya jauh lebih putih secara instan! Sangat puas.", date: "2026-06-13" }
    ]
  },
  {
    id: "PT-006",
    name: "Farida Putri",
    gender: "Perempuan",
    age: 35,
    phone: "08678901234",
    email: "farida.putri@yahoo.co.in",
    address: "Jl. Gatot Subroto No. 88",
    city: "Medan",
    registeredDate: "2024-08-15",
    membershipStatus: "Aktif",
    membershipLevel: "Gold",
    complaint: "Dental Crown",
    status: "Aktif",
    adminNotes: "Pemasangan mahkota gigi porselen pada premolar atas. Perlu fitting gigitan akhir.",
    history: [
      { date: "2026-06-08", doctor: "drg. Rina Amelia", action: "Pemasangan Crown", notes: "Crown porselen terpasang dengan oklusi pas." }
    ],
    complaints: [],
    feedbacks: [
      { id: "F-6", rating: 5, review: "Crown porselen terasa seperti gigi asli sendiri.", date: "2026-06-08" }
    ]
  },
  {
    id: "PT-007",
    name: "Heri Wijaya",
    gender: "Laki-laki",
    age: 47,
    phone: "08789012345",
    email: "heri.wijaya@outlook.com",
    address: "Jl. Sudirman Kav 21",
    city: "Jakarta",
    registeredDate: "2025-02-10",
    membershipStatus: "Aktif",
    membershipLevel: "Silver",
    complaint: "Perawatan Saluran Akar",
    status: "Aktif",
    adminNotes: "Mengalami pulpitis irreversible gigi geraham belakang. Butuh kontrol periodik.",
    history: [
      { date: "2026-06-04", doctor: "drg. Rina Amelia", action: "Devitalisasi Pulpa", notes: "Sterilisasi saluran akar tahap pertama." }
    ],
    complaints: [
      { id: "C-2", text: "Resepsionis kurang responsif mengabarkan antrean telat", date: "2026-06-04" }
    ],
    feedbacks: [
      { id: "F-7", rating: 3, review: "Penanganan medis dokter bagus, tapi antrean admin berantakan.", date: "2026-06-04" }
    ]
  },
  {
    id: "PT-008",
    name: "Diana Rosa",
    gender: "Perempuan",
    age: 27,
    phone: "08890123456",
    email: "diana.rosa@live.com",
    address: "Jl. Dago Elok No. 5",
    city: "Bandung",
    registeredDate: "2025-04-20",
    membershipStatus: "Aktif",
    membershipLevel: "Gold",
    complaint: "Gingivitis Check",
    status: "Aktif",
    adminNotes: "Gusi sering berdarah saat sikat gigi. Telah diedukasi cara penggunaan dental floss.",
    history: [
      { date: "2026-06-11", doctor: "drg. Rina Amelia", action: "Scaling & Curettage", notes: "Pembersihan kalkulus subgingival." }
    ],
    complaints: [],
    feedbacks: [
      { id: "F-8", rating: 5, review: "Gusi tidak pernah berdarah lagi. Sangat merekomendasikan klinik ini.", date: "2026-06-12" }
    ]
  },
  {
    id: "PT-009",
    name: "Eko Prasetyo",
    gender: "Laki-laki",
    age: 33,
    phone: "08901234567",
    email: "eko.prasetyo@gmail.com",
    address: "Jl. Kaliurang Km 5.5",
    city: "Yogyakarta",
    registeredDate: "2024-05-18",
    membershipStatus: "Aktif",
    membershipLevel: "Platinum",
    complaint: "Dental Implant",
    status: "Aktif",
    adminNotes: "Pasien menempuh tahap osseointegrasi pasca tanam implan. Hindari beban kunyah berlebih pada area implan.",
    history: [
      { date: "2026-06-02", doctor: "drg. Budi Hermawan", action: "Implan Abutment Placement", notes: "Abutment terpasang dengan baik, penyembuhan gusi bagus." }
    ],
    complaints: [],
    feedbacks: [
      { id: "F-9", rating: 5, review: "Pemasangan implan tanpa rasa sakit sama sekali. Mantap drg. Budi!", date: "2026-06-03" }
    ]
  },
  {
    id: "PT-010",
    name: "Gita Lestari",
    gender: "Perempuan",
    age: 29,
    phone: "08912345678",
    email: "gita.lestari@gmail.com",
    address: "Jl. Hayam Wuruk No. 34",
    city: "Semarang",
    registeredDate: "2026-05-05",
    membershipStatus: "Aktif",
    membershipLevel: "Silver",
    complaint: "Gigi Sensitif",
    status: "Aktif",
    adminNotes: "Pasien mengeluhkan ngilu parah saat minum air es. Pelapisan desensitisasi rutin.",
    history: [
      { date: "2026-06-10", doctor: "drg. Rina Amelia", action: "Aplikasi Desensitisasi", notes: "Pelapisan fluoride varnish pada gigi sensitif." }
    ],
    complaints: [],
    feedbacks: [
      { id: "F-10", rating: 5, review: "Sangat membantu, ngilu langsung berkurang drastis.", date: "2026-06-11" }
    ]
  },
  {
    id: "PT-011",
    name: "Anton Wijaya",
    gender: "Laki-laki",
    age: 31,
    phone: "08129876543",
    email: "anton.wijaya@gmail.com",
    address: "Jl. Kebon Jeruk No. 89",
    city: "Jakarta",
    registeredDate: "2026-06-02",
    membershipStatus: "Aktif",
    membershipLevel: "Bronze",
    complaint: "Tambal Gigi",
    status: "Aktif",
    adminNotes: "Mengeluhkan ngilu pada gigi geraham atas kanan saat mengunyah makanan manis.",
    history: [
      { date: "2026-06-12", doctor: "drg. Rina Amelia", action: "Tambal Resin Komposit", notes: "Penambalan karies media geraham atas kanan selesai." }
    ],
    complaints: [],
    feedbacks: []
  },
  {
    id: "PT-012",
    name: "Laila Safitri",
    gender: "Perempuan",
    age: 24,
    phone: "08771234567",
    email: "laila.safitri@yahoo.com",
    address: "Jl. Margonda Raya No. 12",
    city: "Depok",
    registeredDate: "2026-06-04",
    membershipStatus: "Aktif",
    membershipLevel: "Silver",
    complaint: "Scaling Gigi",
    status: "Aktif",
    adminNotes: "Memiliki plak tebal akibat konsumsi teh manis. Butuh edukasi pembersihan karang gigi.",
    history: [
      { date: "2026-06-09", doctor: "drg. Rina Amelia", action: "Scaling Gigi", notes: "Scaling menyeluruh selesai, edukasi flossing." }
    ],
    complaints: [],
    feedbacks: []
  },
  {
    id: "PT-013",
    name: "Hendra Kusuma",
    gender: "Laki-laki",
    age: 45,
    phone: "08215566778",
    email: "hendra.k@outlook.com",
    address: "Jl. Ahmad Yani No. 56",
    city: "Bekasi",
    registeredDate: "2024-03-15",
    membershipStatus: "Aktif",
    membershipLevel: "Gold",
    complaint: "Pasang Gigi Palsu",
    status: "Aktif",
    adminNotes: "Kehilangan gigi geraham bawah kiri. Direkomendasikan gigi tiruan lepasan akrilik.",
    history: [
      { date: "2026-05-12", doctor: "drg. Budi Hermawan", action: "Pasang Gigi Tiruan", notes: "Pemasangan gigi tiruan lepasan akrilik 1 gigi geraham bawah." }
    ],
    complaints: [],
    feedbacks: []
  },
  {
    id: "PT-014",
    name: "Ratih Pratiwi",
    gender: "Perempuan",
    age: 38,
    phone: "08138899001",
    email: "ratih.pratiwi@gmail.com",
    address: "Jl. Pajajaran No. 78",
    city: "Bogor",
    registeredDate: "2026-05-20",
    membershipStatus: "Aktif",
    membershipLevel: "Platinum",
    complaint: "Perawatan Saluran Akar",
    status: "Aktif",
    adminNotes: "Pulpitis irreversible akut gigi geraham kecil rahang bawah kiri. Sering mengeluh nyeri malam hari.",
    history: [
      { date: "2026-05-28", doctor: "drg. Rina Amelia", action: "Perawatan Saluran Akar", notes: "Pulpektomi, sterilisasi saluran akar tahap pertama." }
    ],
    complaints: [],
    feedbacks: []
  },
  {
    id: "PT-015",
    name: "Yusuf Alamsyah",
    gender: "Laki-laki",
    age: 50,
    phone: "08119900887",
    email: "yusuf.alamsyah@gmail.com",
    address: "Jl. Kemang Raya No. 4",
    city: "Jakarta",
    registeredDate: "2023-12-01",
    membershipStatus: "Aktif",
    membershipLevel: "Gold",
    complaint: "Pembuatan Crown Gigi",
    status: "Aktif",
    adminNotes: "Gigi depan atas patah sebagian pasca trauma ringan. Direncanakan crown bahan Emax demi estetika.",
    history: [
      { date: "2026-05-20", doctor: "drg. Rina Amelia", action: "Pemasangan Crown Emax", notes: "Crown Emax disemen permanen pada gigi depan atas." }
    ],
    complaints: [],
    feedbacks: []
  }
];

const DEFAULT_SCHEDULES = [
  { id: "SCH-001", patientId: "PT-001", patientName: "Andi Saputra", date: "2026-06-14", time: "09:00", doctor: "drg. Rina Amelia", complaint: "Scaling Gigi", status: "Selesai" },
  { id: "SCH-002", patientId: "PT-002", patientName: "Siti Aisyah", date: "2026-06-14", time: "10:30", doctor: "drg. Budi Hermawan", complaint: "Cabut Gigi Bungsu", status: "Selesai" },
  { id: "SCH-003", patientId: "PT-003", patientName: "Budi Santoso", date: "2026-06-15", time: "13:00", doctor: "drg. Sinta Natalia", complaint: "Pasang Behel", status: "Menunggu" },
  { id: "SCH-004", patientId: "PT-004", patientName: "Dewi Lestari", date: "2026-06-14", time: "11:30", doctor: "drg. Rina Amelia", complaint: "Tambal Gigi", status: "Menunggu" },
  { id: "SCH-005", patientId: "PT-005", patientName: "Rian Hidayat", date: "2026-06-16", time: "14:00", doctor: "drg. Sinta Natalia", complaint: "Teeth Whitening", status: "Menunggu" },
  { id: "SCH-006", patientId: "PT-007", patientName: "Heri Wijaya", date: "2026-06-14", time: "15:30", doctor: "drg. Rina Amelia", complaint: "Perawatan Saluran Akar", status: "Menunggu" },
  { id: "SCH-007", patientId: "PT-008", patientName: "Diana Rosa", date: "2026-06-17", time: "09:30", doctor: "drg. Rina Amelia", complaint: "Gingivitis Check", status: "Menunggu" },
  { id: "SCH-008", patientId: "PT-009", patientName: "Eko Prasetyo", date: "2026-06-18", time: "11:00", doctor: "drg. Budi Hermawan", complaint: "Dental Implant", status: "Menunggu" },
  { id: "SCH-009", patientId: "PT-010", patientName: "Gita Lestari", date: "2026-06-10", time: "10:00", doctor: "drg. Rina Amelia", complaint: "Gigi Sensitif", status: "Selesai" },
  { id: "SCH-010", patientId: "PT-011", patientName: "Anton Wijaya", date: "2026-06-12", time: "15:00", doctor: "drg. Rina Amelia", complaint: "Tambal Gigi", status: "Selesai" },
  { id: "SCH-011", patientId: "PT-012", patientName: "Laila Safitri", date: "2026-06-14", time: "11:00", doctor: "drg. Rina Amelia", complaint: "Scaling Gigi", status: "Menunggu" },
  { id: "SCH-012", patientId: "PT-012", patientName: "Laila Safitri", date: "2026-06-09", time: "11:00", doctor: "drg. Rina Amelia", complaint: "Scaling Gigi", status: "Selesai" },
  { id: "SCH-013", patientId: "PT-013", patientName: "Hendra Kusuma", date: "2026-06-14", time: "14:00", doctor: "drg. Budi Hermawan", complaint: "Pasang Gigi Palsu", status: "Menunggu" },
  { id: "SCH-014", patientId: "PT-013", patientName: "Hendra Kusuma", date: "2026-05-12", time: "14:00", doctor: "drg. Budi Hermawan", complaint: "Pasang Gigi Palsu", status: "Selesai" },
  { id: "SCH-015", patientId: "PT-014", patientName: "Ratih Pratiwi", date: "2026-06-15", time: "10:00", doctor: "drg. Rina Amelia", complaint: "Perawatan Saluran Akar", status: "Menunggu" },
  { id: "SCH-016", patientId: "PT-014", patientName: "Ratih Pratiwi", date: "2026-05-28", time: "13:00", doctor: "drg. Rina Amelia", complaint: "Perawatan Saluran Akar", status: "Selesai" },
  { id: "SCH-017", patientId: "PT-015", patientName: "Yusuf Alamsyah", date: "2026-06-18", time: "13:30", doctor: "drg. Rina Amelia", complaint: "Pembuatan Crown Gigi", status: "Menunggu" },
  { id: "SCH-018", patientId: "PT-015", patientName: "Yusuf Alamsyah", date: "2026-05-20", time: "15:00", doctor: "drg. Rina Amelia", complaint: "Pembuatan Crown Gigi", status: "Selesai" },
  { id: "SCH-019", patientId: "PT-001", patientName: "Andi Saputra", date: "2025-12-10", time: "13:30", doctor: "drg. Rina Amelia", complaint: "Konsultasi Umum", status: "Selesai" },
  { id: "SCH-020", patientId: "PT-002", patientName: "Siti Aisyah", date: "2026-06-10", time: "09:00", doctor: "drg. Budi Hermawan", complaint: "Rontgen Gigi + Konsultasi", status: "Selesai" },
  { id: "SCH-021", patientId: "PT-003", patientName: "Budi Santoso", date: "2026-06-05", time: "14:00", doctor: "drg. Sinta Natalia", complaint: "Kontrol Bracket", status: "Selesai" },
  { id: "SCH-022", patientId: "PT-003", patientName: "Budi Santoso", date: "2026-05-02", time: "10:30", doctor: "drg. Sinta Natalia", complaint: "Aktivasi Kawat", status: "Selesai" },
  { id: "SCH-023", patientId: "PT-004", patientName: "Dewi Lestari", date: "2026-06-12", time: "09:30", doctor: "drg. Rina Amelia", complaint: "Tambal Gigi", status: "Selesai" },
  { id: "SCH-024", patientId: "PT-005", patientName: "Rian Hidayat", date: "2026-06-13", time: "10:00", doctor: "drg. Sinta Natalia", complaint: "Teeth Whitening", status: "Selesai" },
  { id: "SCH-025", patientId: "PT-006", patientName: "Farida Putri", date: "2026-06-08", time: "10:00", doctor: "drg. Rina Amelia", complaint: "Pemasangan Crown", status: "Selesai" },
  { id: "SCH-026", patientId: "PT-007", patientName: "Heri Wijaya", date: "2026-06-04", time: "15:30", doctor: "drg. Rina Amelia", complaint: "Perawatan Saluran Akar", status: "Selesai" },
  { id: "SCH-027", patientId: "PT-008", patientName: "Diana Rosa", date: "2026-06-11", time: "11:00", doctor: "drg. Rina Amelia", complaint: "Gingivitis Check", status: "Selesai" },
  { id: "SCH-028", patientId: "PT-009", patientName: "Eko Prasetyo", date: "2026-06-02", time: "10:00", doctor: "drg. Budi Hermawan", complaint: "Dental Implant", status: "Selesai" }
];

const DEFAULT_TRANSACTIONS = [
  { id: "TX-1001", patientId: "PT-001", patientName: "Andi Saputra", date: "2026-06-14", service: "Scaling & Polishing", amount: 450000, method: "Debit Mandiri", status: "Berhasil" },
  { id: "TX-1002", patientId: "PT-002", patientName: "Siti Aisyah", date: "2026-06-14", service: "Cabut Gigi Bungsu (Odontektomi)", amount: 2500000, method: "QRIS", status: "Berhasil" },
  { id: "TX-1003", patientId: "PT-003", patientName: "Budi Santoso", date: "2026-06-05", service: "Kontrol Behel Bulanan", amount: 350000, method: "Tunai", status: "Berhasil" },
  { id: "TX-1004", patientId: "PT-004", patientName: "Dewi Lestari", date: "2026-06-12", service: "Tambal Resin Komposit", amount: 500000, method: "Kartu Kredit", status: "Berhasil" },
  { id: "TX-1005", patientId: "PT-005", patientName: "Rian Hidayat", date: "2026-06-13", service: "Teeth Whitening (Bleaching)", amount: 1500000, method: "QRIS", status: "Berhasil" },
  { id: "TX-1006", patientId: "PT-006", patientName: "Farida Putri", date: "2026-06-08", service: "Pemasangan Crown Premolar", amount: 3000000, method: "Kartu Kredit", status: "Berhasil" },
  { id: "TX-1007", patientId: "PT-007", patientName: "Heri Wijaya", date: "2026-06-04", service: "Devitalisasi Saluran Akar", amount: 800000, method: "Debit BCA", status: "Berhasil" },
  { id: "TX-1008", patientId: "PT-008", patientName: "Diana Rosa", date: "2026-06-11", service: "Curettage Gusi", amount: 600000, method: "QRIS", status: "Berhasil" },
  { id: "TX-1009", patientId: "PT-009", patientName: "Eko Prasetyo", date: "2026-06-02", service: "Abutment Implan Gigi", amount: 4500000, method: "Transfer Bank", status: "Berhasil" },
  { id: "TX-1010", patientId: "PT-010", patientName: "Gita Lestari", date: "2026-06-10", service: "Pelapisan Fluoride Gigi", amount: 300000, method: "Tunai", status: "Berhasil" },
  { id: "TX-1011", patientId: "PT-011", patientName: "Anton Wijaya", date: "2026-06-12", service: "Tambal Resin Komposit", amount: 500000, method: "QRIS", status: "Berhasil" },
  { id: "TX-1012", patientId: "PT-012", patientName: "Laila Safitri", date: "2026-06-09", service: "Scaling & Polishing", amount: 450000, method: "Debit BCA", status: "Berhasil" },
  { id: "TX-1013", patientId: "PT-013", patientName: "Hendra Kusuma", date: "2026-05-12", service: "Gigi Tiruan Lepasan Akrilik", amount: 1200000, method: "Debit Mandiri", status: "Berhasil" },
  { id: "TX-1014", patientId: "PT-014", patientName: "Ratih Pratiwi", date: "2026-05-28", service: "Perawatan Saluran Akar", amount: 950000, method: "Kartu Kredit", status: "Berhasil" },
  { id: "TX-1015", patientId: "PT-015", patientName: "Yusuf Alamsyah", date: "2026-05-20", service: "Crown Gigi Emax", amount: 3500000, method: "Transfer Bank", status: "Berhasil" },
  { id: "TX-1016", patientId: "PT-001", patientName: "Andi Saputra", date: "2025-12-10", service: "Konsultasi & Rontgen Gigi", amount: 350000, method: "Tunai", status: "Berhasil" },
  { id: "TX-1017", patientId: "PT-002", patientName: "Siti Aisyah", date: "2026-06-10", service: "Rontgen Panoramic & Konsul", amount: 450000, method: "Kartu Kredit", status: "Berhasil" },
  { id: "TX-1018", patientId: "PT-003", patientName: "Budi Santoso", date: "2026-05-02", service: "Aktivasi Kawat Gigi", amount: 350000, method: "Tunai", status: "Berhasil" }
];

const DEFAULT_DENTAL_RECORDS = [
  { id: "REC-001", patientId: "PT-001", patientName: "Andi Saputra", date: "2026-06-14", doctor: "drg. Rina Amelia", diagnosis: "Kalkulus (Karang Gigi) menyeluruh di bagian rahang bawah", treatment: "Scaling rahang atas dan rahang bawah", notes: "Karang gigi keras dibersihkan. Instruksi flossing.", controlDate: "2026-12-14" },
  { id: "REC-002", patientId: "PT-002", patientName: "Siti Aisyah", date: "2026-06-14", doctor: "drg. Budi Hermawan", diagnosis: "Impaksi Gigi Bungsu molar 3 kiri bawah posisi miring", treatment: "Odontektomi Bedah Mulut", notes: "Jahitan 3 simpul. Resep asam mefenamat & cefadroxil.", controlDate: "2026-06-21" },
  { id: "REC-003", patientId: "PT-003", patientName: "Budi Santoso", date: "2026-06-05", doctor: "drg. Sinta Natalia", diagnosis: "Maloklusi Kelas I kawat aktif", treatment: "Ganti kawat busur & karet biru muda", notes: "Bracket terpasang kuat, tidak ada yang lepas.", controlDate: "2026-07-03" },
  { id: "REC-004", patientId: "PT-004", patientName: "Dewi Lestari", date: "2026-06-12", doctor: "drg. Rina Amelia", diagnosis: "Karies gigi depan atas 21", treatment: "Tambalan komposit kelas IV", notes: "Hasil estetika rapi, warna komposit match A2.", controlDate: "2026-12-12" },
  { id: "REC-005", patientId: "PT-005", patientName: "Rian Hidayat", date: "2026-06-13", doctor: "drg. Sinta Natalia", diagnosis: "Diskolorasi gigi (Kuning akibat konsumsi teh kopi)", treatment: "In-office Bleaching Gigi laser", notes: "Shade gigi naik 4 tingkat lebih putih cerah.", controlDate: "2026-12-13" },
  { id: "REC-006", patientId: "PT-006", patientName: "Farida Putri", date: "2026-06-08", doctor: "drg. Rina Amelia", diagnosis: "Gigi keropos pasca PSA premolar atas", treatment: "Pemasangan Mahkota Gigi Porselen (Crown)", notes: " Crown duduk oklusi sempurna, gigitan stabil.", controlDate: "2026-12-08" },
  { id: "REC-007", patientId: "PT-007", patientName: "Heri Wijaya", date: "2026-06-04", doctor: "drg. Rina Amelia", diagnosis: "Pulpitis Irreversible gigi molar 1 kanan bawah", treatment: "Devitalisasi pulpa & sterilisasi saluran akar", notes: "Pemberian obat steril saluran akar chkm.", controlDate: "2026-06-18" },
  { id: "REC-008", patientId: "PT-008", patientName: "Diana Rosa", date: "2026-06-11", doctor: "drg. Rina Amelia", diagnosis: "Gingivitis kronis akibat akumulasi plak subgingival", treatment: "Scaling & Curettage gusi", notes: "Pendarahan gusi berkurang pasca tindakan.", controlDate: "2026-12-11" },
  { id: "REC-009", patientId: "PT-009", patientName: "Eko Prasetyo", date: "2026-06-02", doctor: "drg. Budi Hermawan", diagnosis: "Edentulous gigi molar 1 kiri bawah (ompong)", treatment: "Implan abutment placement", notes: "Sekrup implan terpasang kokoh di tulang rahang.", controlDate: "2026-09-02" },
  { id: "REC-010", patientId: "PT-010", patientName: "Gita Lestari", date: "2026-06-10", doctor: "drg. Rina Amelia", diagnosis: "Karies superfisial email gigi", treatment: "Pelapisan Fluoride varnish pelindung gigi", notes: "Dianjurkan tidak makan minum panas dingin 1 jam.", controlDate: "2026-12-10" },
  { id: "REC-011", patientId: "PT-011", patientName: "Anton Wijaya", date: "2026-06-12", doctor: "drg. Rina Amelia", diagnosis: "Karies media gigi premolar kanan atas", treatment: "Tambal resin komposit", notes: "Tambalan komposit selesai dengan oklusi baik.", controlDate: "2026-12-12" },
  { id: "REC-012", patientId: "PT-012", patientName: "Laila Safitri", date: "2026-06-09", doctor: "drg. Rina Amelia", diagnosis: "Kalkulus rahang atas & rahang bawah", treatment: "Scaling rahang atas & rahang bawah", notes: "Pembersihan plak karang gigi selesai.", controlDate: "2026-12-09" },
  { id: "REC-013", patientId: "PT-013", patientName: "Hendra Kusuma", date: "2026-05-12", doctor: "drg. Budi Hermawan", diagnosis: "Edentulous gigi premolar 2 kiri bawah", treatment: "Pembuatan Gigi Tiruan Lepasan Akrilik", notes: "Gigi tiruan dipasang, oklusi stabil, instruksi rawat gigi palsu.", controlDate: "2026-11-12" },
  { id: "REC-014", patientId: "PT-014", patientName: "Ratih Pratiwi", date: "2026-05-28", doctor: "drg. Rina Amelia", diagnosis: "Pulpitis irreversible gigi molar 1 kiri bawah", treatment: "Ekstirpasi jaringan pulpa & pengisian saluran akar sementara", notes: "Sterilisasi saluran akar dengan Ca(OH)2.", controlDate: "2026-06-15" },
  { id: "REC-015", patientId: "PT-015", patientName: "Yusuf Alamsyah", date: "2026-05-20", doctor: "drg. Rina Amelia", diagnosis: "Karies meluas pasca PSA gigi anterior", treatment: "Pemasangan Crown Emax", notes: "Crown disemen permanen, oklusi stabil.", controlDate: "2026-11-20" },
  { id: "REC-016", patientId: "PT-001", patientName: "Andi Saputra", date: "2025-12-10", doctor: "drg. Rina Amelia", diagnosis: "Kalkulus ringan", treatment: "Pembersihan spot", notes: "Karang gigi ringan, anjuran dental floss.", controlDate: "2026-06-10" },
  { id: "REC-017", patientId: "PT-002", patientName: "Siti Aisyah", date: "2026-06-10", doctor: "drg. Budi Hermawan", diagnosis: "Impaksi posisi mesioangular gigi 38", treatment: "Rencana bedah mulut", notes: "Rencana odontektomi disetujui pasien.", controlDate: "2026-06-14" },
  { id: "REC-018", patientId: "PT-003", patientName: "Budi Santoso", date: "2026-05-02", doctor: "drg. Sinta Natalia", diagnosis: "Maloklusi Kelas I kawat aktif", treatment: "Pengencangan kawat behel rahang bawah", notes: "Pasien kooperatif, karet diganti.", controlDate: "2026-06-05" }
];

const DEFAULT_NOTIFICATIONS = [
  { id: "NT-001", title: "Reminder Jadwal Pasien", description: "Pasien Andi Saputra memiliki jadwal hari ini 09:00 WIB untuk Scaling.", type: "Reminder Jadwal", date: "2026-06-14", isRead: false },
  { id: "NT-002", title: "Registrasi Pasien Baru", description: "Laila Safitri terdaftar sebagai pasien baru di sistem.", type: "Pasien Baru", date: "2026-06-04", isRead: true },
  { id: "NT-003", title: "Membership Upgrade", description: "Siti Aisyah telah di-upgrade ke level Gold karena akumulasi kunjungan.", type: "Membership Upgrade", date: "2026-06-06", isRead: false },
  { id: "NT-004", title: "Pembayaran Berhasil", description: "Invoice TX-1004 atas nama Dewi Lestari senilai Rp 500.000 telah dibayar.", type: "Pembayaran Berhasil", date: "2026-06-12", isRead: true },
  { id: "NT-005", title: "Review Ulasan Baru", description: "Diana Rosa meninggalkan ulasan rating bintang 5 untuk drg. Rina.", type: "Review Baru", date: "2026-06-12", isRead: false }
];

const DEFAULT_DOCTORS = [
  { id: "DOC-001", name: "drg. Rina Amelia", specialty: "Spesialis Konservasi Gigi (Endodontist)", status: "Aktif", phone: "08112233445", rating: 4.8, visits: 240, image: "RA" },
  { id: "DOC-002", name: "drg. Budi Hermawan", specialty: "Spesialis Bedah Mulut (Oral Surgeon)", status: "Aktif", phone: "08122334455", rating: 4.9, visits: 180, image: "BH" },
  { id: "DOC-003", name: "drg. Sinta Natalia", specialty: "Spesialis Ortodonsia (Orthodontist)", status: "Aktif", phone: "08133445566", rating: 4.7, visits: 310, image: "SN" }
];

const DEFAULT_TREATMENTS = [
  { id: "TR-001", name: "Scaling & Polishing", category: "Pembersihan", price: 450000, duration: "30 Menit", description: "Pembersihan karang gigi dan pemolesan untuk menghilangkan noda gigi." },
  { id: "TR-002", name: "Tambal Gigi Resin", category: "Konservasi", price: 500000, duration: "45 Menit", description: "Penambalan lubang gigi menggunakan bahan komposit resin warna gigi." },
  { id: "TR-003", name: "Cabut Gigi Bungsu (Odontektomi)", category: "Bedah Mulut", price: 2500000, duration: "90 Menit", description: "Operasi kecil pengambilan gigi bungsu yang impaksi/tumbuh miring." },
  { id: "TR-004", name: "Orthodontic (Behel Metal)", category: "Ortodonsia", price: 8500000, duration: "120 Menit", description: "Pemasangan behel gigi untuk merapikan susunan rahang dan gigi." },
  { id: "TR-005", name: "Teeth Whitening (Bleaching)", category: "Estetika", price: 1500000, duration: "60 Menit", description: "Pemutihan gigi secara instan menggunakan gel pemutih dan sinar laser." }
];

const DEFAULT_CUSTOMER_ACTIVITIES = [
  // Andi Saputra (PT-001)
  { id: "ACT-001", patientName: "Andi Saputra", action: "Login Aplikasi Pasien", detail: "Login sukses via Android Mobile App", time: "2026-06-14 08:30" },
  { id: "ACT-002", patientName: "Andi Saputra", action: "Payment Completed", detail: "Pembayaran invoice TX-1001 via Debit Mandiri", time: "2026-06-14 09:45" },
  { id: "ACT-003", patientName: "Andi Saputra", action: "Rating & Feedback", detail: "Memberikan rating bintang 4 untuk drg. Rina Amelia", time: "2026-06-14 09:50" },
  { id: "ACT-004", patientName: "Andi Saputra", action: "Booking Consultation", detail: "Memesan jadwal Scaling Gigi untuk tanggal 2026-06-14", time: "2026-06-08 14:20" },
  { id: "ACT-005", patientName: "Andi Saputra", action: "Login Aplikasi Pasien", detail: "Login sukses via Web Browser Chrome", time: "2026-05-10 11:15" },
  
  // Siti Aisyah (PT-002)
  { id: "ACT-006", patientName: "Siti Aisyah", action: "Login Aplikasi Pasien", detail: "Login sukses via iPhone iOS App", time: "2026-06-14 10:00" },
  { id: "ACT-007", patientName: "Siti Aisyah", action: "Payment Completed", detail: "Pembayaran invoice TX-1002 via QRIS", time: "2026-06-14 12:15" },
  { id: "ACT-008", patientName: "Siti Aisyah", action: "Rating & Feedback", detail: "Memberikan rating bintang 5 untuk drg. Budi Hermawan", time: "2026-06-14 12:25" },
  { id: "ACT-009", patientName: "Siti Aisyah", action: "Voucher Redeemed", detail: "Redeem 200 poin untuk voucher Diskon Perawatan 10%", time: "2026-06-06 14:00" },
  { id: "ACT-010", patientName: "Siti Aisyah", action: "Booking Consultation", detail: "Memesan jadwal Bedah Mulut untuk tanggal 2026-06-14", time: "2026-06-10 09:00" },
  
  // Budi Santoso (PT-003)
  { id: "ACT-011", patientName: "Budi Santoso", action: "Rating & Feedback", detail: "Memberikan rating bintang 4 untuk drg. Sinta Natalia", time: "2026-06-05 16:45" },
  { id: "ACT-012", patientName: "Budi Santoso", action: "Payment Completed", detail: "Pembayaran invoice TX-1003 via Tunai", time: "2026-06-05 16:20" },
  { id: "ACT-013", patientName: "Budi Santoso", action: "Voucher Redeemed", detail: "Redeem 500 poin untuk voucher Potongan Scaling 50%", time: "2026-05-20 10:00" },
  { id: "ACT-014", patientName: "Budi Santoso", action: "Payment Completed", detail: "Pembayaran invoice TX-1018 via Tunai", time: "2026-05-02 11:30" },
  { id: "ACT-015", patientName: "Budi Santoso", action: "Voucher Redeemed", detail: "Redeem 1500 poin untuk voucher Gratis Bleaching Gigi", time: "2026-04-10 14:00" },

  // Dewi Lestari (PT-004)
  { id: "ACT-016", patientName: "Dewi Lestari", action: "Login Aplikasi Pasien", detail: "Login sukses via Android Mobile App", time: "2026-06-14 11:00" },
  { id: "ACT-017", patientName: "Dewi Lestari", action: "Payment Completed", detail: "Pembayaran invoice TX-1004 via Credit Card", time: "2026-06-12 10:15" },
  { id: "ACT-018", patientName: "Dewi Lestari", action: "Rating & Feedback", detail: "Memberikan rating bintang 5 untuk drg. Rina Amelia", time: "2026-06-12 10:30" },
  { id: "ACT-019", patientName: "Dewi Lestari", action: "Booking Consultation", detail: "Memesan jadwal Tambal Gigi untuk tanggal 2026-06-12", time: "2026-06-09 11:20" },

  // Rian Hidayat (PT-005)
  { id: "ACT-020", patientName: "Rian Hidayat", action: "Booking Consultation", detail: "Memesan jadwal Bleaching Gigi untuk tanggal 2026-06-16", time: "2026-06-13 09:30" },
  { id: "ACT-021", patientName: "Rian Hidayat", action: "Login Aplikasi Pasien", detail: "Login sukses via Android Mobile App", time: "2026-06-13 09:00" },
  { id: "ACT-022", patientName: "Rian Hidayat", action: "Payment Completed", detail: "Pembayaran invoice TX-1005 via QRIS", time: "2026-06-13 11:00" },
  { id: "ACT-023", patientName: "Rian Hidayat", action: "Rating & Feedback", detail: "Memberikan rating bintang 5 untuk drg. Sinta Natalia", time: "2026-06-13 11:15" },

  // Farida Putri (PT-006)
  { id: "ACT-024", patientName: "Farida Putri", action: "Login Aplikasi Pasien", detail: "Login sukses via iPhone iOS App", time: "2026-06-08 10:00" },
  { id: "ACT-025", patientName: "Farida Putri", action: "Payment Completed", detail: "Pembayaran invoice TX-1006 via Kartu Kredit", time: "2026-06-08 11:30" },
  { id: "ACT-026", patientName: "Farida Putri", action: "Rating & Feedback", detail: "Memberikan rating bintang 5 untuk drg. Rina Amelia", time: "2026-06-08 11:45" },
  { id: "ACT-027", patientName: "Farida Putri", action: "Voucher Redeemed", detail: "Redeem 200 poin untuk voucher Diskon Perawatan 10%", time: "2026-06-08 09:45" },

  // Heri Wijaya (PT-007)
  { id: "ACT-028", patientName: "Heri Wijaya", action: "Login Aplikasi Pasien", detail: "Login sukses via Web Browser Safari", time: "2026-06-04 15:30" },
  { id: "ACT-029", patientName: "Heri Wijaya", action: "Rating & Feedback", detail: "Memberikan rating bintang 3 untuk drg. Rina Amelia", time: "2026-06-04 17:00" },
  { id: "ACT-030", patientName: "Heri Wijaya", action: "Payment Completed", detail: "Pembayaran invoice TX-1007 via Debit BCA", time: "2026-06-04 16:40" },
  { id: "ACT-031", patientName: "Heri Wijaya", action: "Voucher Redeemed", detail: "Redeem 200 poin untuk voucher Diskon Perawatan 10%", time: "2026-05-18 10:00" },

  // Diana Rosa (PT-008)
  { id: "ACT-032", patientName: "Diana Rosa", action: "Login Aplikasi Pasien", detail: "Login sukses via Android Mobile App", time: "2026-06-12 10:30" },
  { id: "ACT-033", patientName: "Diana Rosa", action: "Rating & Feedback", detail: "Memberikan rating bintang 5 untuk drg. Rina Amelia", time: "2026-06-12 11:30" },
  { id: "ACT-034", patientName: "Diana Rosa", action: "Payment Completed", detail: "Pembayaran invoice TX-1008 via QRIS", time: "2026-06-11 12:45" },
  { id: "ACT-035", patientName: "Diana Rosa", action: "Voucher Redeemed", detail: "Redeem 500 poin untuk voucher Potongan Scaling 50%", time: "2026-06-05 09:15" },

  // Eko Prasetyo (PT-009)
  { id: "ACT-036", patientName: "Eko Prasetyo", action: "Rating & Feedback", detail: "Memberikan rating bintang 5 untuk drg. Budi Hermawan", time: "2026-06-03 10:00" },
  { id: "ACT-037", patientName: "Eko Prasetyo", action: "Voucher Redeemed", detail: "Redeem 1500 poin untuk voucher Gratis Bleaching Gigi", time: "2026-06-03 09:45" },
  { id: "ACT-038", patientName: "Eko Prasetyo", action: "Booking Consultation", detail: "Memesan jadwal Implan Gigi untuk tanggal 2026-06-18", time: "2026-06-02 08:30" },
  { id: "ACT-039", patientName: "Eko Prasetyo", action: "Payment Completed", detail: "Pembayaran invoice TX-1009 via Transfer Bank", time: "2026-06-02 11:30" },
  { id: "ACT-040", patientName: "Eko Prasetyo", action: "Login Aplikasi Pasien", detail: "Login sukses via Web Browser Firefox", time: "2026-06-02 09:00" },

  // Gita Lestari (PT-010)
  { id: "ACT-041", patientName: "Gita Lestari", action: "Rating & Feedback", detail: "Memberikan rating bintang 5 untuk drg. Rina Amelia", time: "2026-06-11 11:00" },
  { id: "ACT-042", patientName: "Gita Lestari", action: "Payment Completed", detail: "Pembayaran invoice TX-1010 via Tunai", time: "2026-06-10 12:00" },
  { id: "ACT-043", patientName: "Gita Lestari", action: "Login Aplikasi Pasien", detail: "Login sukses via Android Mobile App", time: "2026-06-10 10:00" },
  { id: "ACT-044", patientName: "Gita Lestari", action: "Booking Consultation", detail: "Memesan jadwal Gigi Sensitif untuk tanggal 2026-06-10", time: "2026-06-05 14:00" },

  // Anton Wijaya (PT-011)
  { id: "ACT-045", patientName: "Anton Wijaya", action: "Login Aplikasi Pasien", detail: "Login sukses via Android Mobile App", time: "2026-06-12 14:30" },
  { id: "ACT-046", patientName: "Anton Wijaya", action: "Payment Completed", detail: "Pembayaran invoice TX-1011 via QRIS", time: "2026-06-12 16:15" },
  { id: "ACT-047", patientName: "Anton Wijaya", action: "Rating & Feedback", detail: "Memberikan rating bintang 4 untuk drg. Rina Amelia", time: "2026-06-12 16:30" },
  { id: "ACT-048", patientName: "Anton Wijaya", action: "Booking Consultation", detail: "Memesan jadwal Tambal Gigi untuk tanggal 2026-06-12", time: "2026-06-08 11:00" },

  // Laila Safitri (PT-012)
  { id: "ACT-049", patientName: "Laila Safitri", action: "Login Aplikasi Pasien", detail: "Login sukses via iPhone iOS App", time: "2026-06-14 09:30" },
  { id: "ACT-050", patientName: "Laila Safitri", action: "Voucher Redeemed", detail: "Redeem 200 poin untuk voucher Diskon Perawatan 10%", time: "2026-06-10 14:00" },
  { id: "ACT-051", patientName: "Laila Safitri", action: "Payment Completed", detail: "Pembayaran invoice TX-1012 via Debit BCA", time: "2026-06-09 11:15" },
  { id: "ACT-052", patientName: "Laila Safitri", action: "Rating & Feedback", detail: "Memberikan rating bintang 5 untuk drg. Rina Amelia", time: "2026-06-09 12:00" },

  // Hendra Kusuma (PT-013)
  { id: "ACT-053", patientName: "Hendra Kusuma", action: "Login Aplikasi Pasien", detail: "Login sukses via Web Browser Edge", time: "2026-06-14 08:00" },
  { id: "ACT-054", patientName: "Hendra Kusuma", action: "Voucher Redeemed", detail: "Redeem 500 poin untuk voucher Potongan Scaling 50%", time: "2026-05-15 11:30" },
  { id: "ACT-055", patientName: "Hendra Kusuma", action: "Payment Completed", detail: "Pembayaran invoice TX-1013 via Debit Mandiri", time: "2026-05-12 15:30" },
  { id: "ACT-056", patientName: "Hendra Kusuma", action: "Rating & Feedback", detail: "Memberikan rating bintang 5 untuk drg. Budi Hermawan", time: "2026-05-12 16:00" },

  // Ratih Pratiwi (PT-014)
  { id: "ACT-057", patientName: "Ratih Pratiwi", action: "Voucher Redeemed", detail: "Redeem 1500 poin untuk voucher Gratis Bleaching Gigi", time: "2026-06-01 10:00" },
  { id: "ACT-058", patientName: "Ratih Pratiwi", action: "Payment Completed", detail: "Pembayaran invoice TX-1014 via Kartu Kredit", time: "2026-05-28 14:00" },
  { id: "ACT-059", patientName: "Ratih Pratiwi", action: "Rating & Feedback", detail: "Memberikan rating bintang 5 untuk drg. Rina Amelia", time: "2026-05-28 15:00" },
  { id: "ACT-060", patientName: "Ratih Pratiwi", action: "Booking Consultation", detail: "Memesan jadwal Perawatan Saluran Akar untuk tanggal 2026-05-28", time: "2026-05-22 09:00" },

  // Yusuf Alamsyah (PT-015)
  { id: "ACT-061", patientName: "Yusuf Alamsyah", action: "Login Aplikasi Pasien", detail: "Login sukses via Web Browser Chrome", time: "2026-06-14 09:00" },
  { id: "ACT-062", patientName: "Yusuf Alamsyah", action: "Voucher Redeemed", detail: "Redeem 500 poin untuk voucher Potongan Scaling 50%", time: "2026-05-28 11:30" },
  { id: "ACT-063", patientName: "Yusuf Alamsyah", action: "Payment Completed", detail: "Pembayaran invoice TX-1015 via Transfer Bank", time: "2026-05-20 16:30" },
  { id: "ACT-064", patientName: "Yusuf Alamsyah", action: "Rating & Feedback", detail: "Memberikan rating bintang 4 untuk drg. Rina Amelia", time: "2026-05-20 17:00" }
];

const DEFAULT_FEEDBACKS = [
  // Andi Saputra (PT-001)
  { id: "FB-001", patientName: "Andi Saputra", rating: 4, doctorName: "drg. Rina Amelia", comment: "Pelayanan klinik bersih, pengerjaan scaling rapi, namun sedikit antrean di resepsionis.", date: "2026-06-14", type: "Saran", status: "Selesai" },
  { id: "FB-002", patientName: "Andi Saputra", rating: 4, doctorName: "drg. Rina Amelia", comment: "Dokter ramah sekali, dikasih edukasi flossing gigi setelah kontrol.", date: "2025-12-10", type: "Pujian", status: "Selesai" },
  
  // Siti Aisyah (PT-002)
  { id: "FB-003", patientName: "Siti Aisyah", rating: 5, doctorName: "drg. Budi Hermawan", comment: "Penjelasan drg. Budi sangat profesional sebelum dan sesudah pencabutan gigi bungsu.", date: "2026-06-14", type: "Pujian", status: "Selesai" },
  { id: "FB-004", patientName: "Siti Aisyah", rating: 5, doctorName: "drg. Budi Hermawan", comment: "Sesi konsultasi rontgen sangat informatif, gigi bungsu terlihat impaksi mesioangular.", date: "2026-06-10", type: "Pujian", status: "Selesai" },
  
  // Budi Santoso (PT-003)
  { id: "FB-005", patientName: "Budi Santoso", rating: 4, doctorName: "drg. Sinta Natalia", comment: "Kontrol rutin kawat gigi dilayani ramah dan kawat rapi.", date: "2026-06-05", type: "Pujian", status: "Selesai" },
  { id: "FB-006", patientName: "Budi Santoso", rating: 5, doctorName: "drg. Sinta Natalia", comment: "Aktivasi kawat gigi terasa kencang tapi rapi, dokternya telaten.", date: "2026-05-02", type: "Pujian", status: "Selesai" },
  
  // Dewi Lestari (PT-004)
  { id: "FB-007", patientName: "Dewi Lestari", rating: 5, doctorName: "drg. Rina Amelia", comment: "Dokter sangat sabar menenangkan saya yang phobia bor gigi, tambalan juga rapi banget.", date: "2026-06-12", type: "Pujian", status: "Selesai" },
  
  // Rian Hidayat (PT-005)
  { id: "FB-008", patientName: "Rian Hidayat", rating: 5, doctorName: "drg. Sinta Natalia", comment: "Gigi saya jauh lebih putih secara instan! Sangat puas dengan layanan bleaching laser.", date: "2026-06-13", type: "Pujian", status: "Selesai" },
  
  // Farida Putri (PT-006)
  { id: "FB-009", patientName: "Farida Putri", rating: 5, doctorName: "drg. Rina Amelia", comment: "Crown gigi porselen presisi dan nyaman digunakan untuk mengunyah. Sangat estetik.", date: "2026-06-08", type: "Pujian", status: "Selesai" },
  
  // Heri Wijaya (PT-007)
  { id: "FB-010", patientName: "Heri Wijaya", rating: 3, doctorName: "drg. Rina Amelia", comment: "Perawatan saluran akar bagus, tapi antrean pendaftaran terkesan lambat dan kurang responsif.", date: "2026-06-04", type: "Keluhan", status: "Selesai" },
  
  // Diana Rosa (PT-008)
  { id: "FB-011", patientName: "Diana Rosa", rating: 5, doctorName: "drg. Rina Amelia", comment: "Pendarahan gusi saya terhenti berkat kuretase. Rekomended klinik!", date: "2026-06-12", type: "Pujian", status: "Selesai" },
  
  // Eko Prasetyo (PT-009)
  { id: "FB-012", patientName: "Eko Prasetyo", rating: 5, doctorName: "drg. Budi Hermawan", comment: "Pemasangan implan tanpa rasa sakit sama sekali. Mantap drg. Budi!", date: "2026-06-03", type: "Pujian", status: "Selesai" },
  
  // Gita Lestari (PT-010)
  { id: "FB-013", patientName: "Gita Lestari", rating: 5, doctorName: "drg. Rina Amelia", comment: "Sangat membantu, ngilu langsung berkurang drastis setelah pelapisan fluoride.", date: "2026-06-11", type: "Pujian", status: "Selesai" },

  // Anton Wijaya (PT-011)
  { id: "FB-014", patientName: "Anton Wijaya", rating: 4, doctorName: "drg. Rina Amelia", comment: "Tambal gigi cepat, tidak sakit, kompositnya sewarna gigi asli.", date: "2026-06-12", type: "Pujian", status: "Selesai" },

  // Laila Safitri (PT-012)
  { id: "FB-015", patientName: "Laila Safitri", rating: 5, doctorName: "drg. Rina Amelia", comment: "Pembersihan karang gigi bersih sekali dan dokternya komunikatif.", date: "2026-06-09", type: "Pujian", status: "Selesai" },

  // Hendra Kusuma (PT-013)
  { id: "FB-016", patientName: "Hendra Kusuma", rating: 5, doctorName: "drg. Budi Hermawan", comment: "Gigi tiruan lepasan akrilik sangat pas dan nyaman dipakai makan.", date: "2026-05-12", type: "Pujian", status: "Selesai" },

  // Ratih Pratiwi (PT-014)
  { id: "FB-017", patientName: "Ratih Pratiwi", rating: 5, doctorName: "drg. Rina Amelia", comment: "Sakit gigi berdenyut hilang setelah perawatan saluran akar oleh drg. Rina. Top!", date: "2026-05-28", type: "Pujian", status: "Selesai" },

  // Yusuf Alamsyah (PT-015)
  { id: "FB-018", patientName: "Yusuf Alamsyah", rating: 4, doctorName: "drg. Rina Amelia", comment: "Pemasangan crown emax presisi sekali, gigitan nyaman.", date: "2026-05-20", type: "Pujian", status: "Selesai" }
];

const DEFAULT_LOYALTY_REWARDS = {
  points: [
    { patientId: "PT-001", patientName: "Andi Saputra", balance: 450, tier: "Bronze" },
    { patientId: "PT-002", patientName: "Siti Aisyah", balance: 1250, tier: "Gold" },
    { patientId: "PT-003", patientName: "Budi Santoso", balance: 2800, tier: "Platinum" },
    { patientId: "PT-004", patientName: "Dewi Lestari", balance: 850, tier: "Silver" },
    { patientId: "PT-005", patientName: "Rian Hidayat", balance: 600, tier: "Bronze" },
    { patientId: "PT-006", patientName: "Farida Putri", balance: 1550, tier: "Gold" },
    { patientId: "PT-007", patientName: "Heri Wijaya", balance: 900, tier: "Silver" },
    { patientId: "PT-008", patientName: "Diana Rosa", balance: 1100, tier: "Gold" },
    { patientId: "PT-009", patientName: "Eko Prasetyo", balance: 3400, tier: "Platinum" },
    { patientId: "PT-010", patientName: "Gita Lestari", balance: 750, tier: "Silver" },
    { patientId: "PT-011", patientName: "Anton Wijaya", balance: 250, tier: "Bronze" },
    { patientId: "PT-012", patientName: "Laila Safitri", balance: 950, tier: "Silver" },
    { patientId: "PT-013", patientName: "Hendra Kusuma", balance: 1800, tier: "Gold" },
    { patientId: "PT-014", patientName: "Ratih Pratiwi", balance: 3200, tier: "Platinum" },
    { patientId: "PT-015", patientName: "Yusuf Alamsyah", balance: 1400, tier: "Gold" }
  ],
  vouchers: [
    { code: "VCH-DISC10", name: "Diskon Perawatan 10%", pointsRequired: 200, status: "Aktif" },
    { code: "VCH-FREEWHITENING", name: "Gratis Bleaching Gigi", pointsRequired: 1500, status: "Aktif" },
    { code: "VCH-SCALING50", name: "Potongan Scaling 50%", pointsRequired: 500, status: "Aktif" }
  ],
  redemptions: [
    { id: "RDP-001", patientName: "Siti Aisyah", voucherName: "Diskon Perawatan 10%", pointsUsed: 200, date: "2026-06-06" },
    { id: "RDP-002", patientName: "Budi Santoso", voucherName: "Potongan Scaling 50%", pointsUsed: 500, date: "2026-05-20" },
    { id: "RDP-003", patientName: "Farida Putri", voucherName: "Diskon Perawatan 10%", pointsUsed: 200, date: "2026-06-08" },
    { id: "RDP-004", patientName: "Eko Prasetyo", voucherName: "Gratis Bleaching Gigi", pointsUsed: 1500, date: "2026-06-03" },
    { id: "RDP-005", patientName: "Budi Santoso", voucherName: "Gratis Bleaching Gigi", pointsUsed: 1500, date: "2026-04-10" },
    { id: "RDP-006", patientName: "Hendra Kusuma", voucherName: "Potongan Scaling 50%", pointsUsed: 500, date: "2026-05-15" },
    { id: "RDP-007", patientName: "Ratih Pratiwi", voucherName: "Gratis Bleaching Gigi", pointsUsed: 1500, date: "2026-06-01" },
    { id: "RDP-008", patientName: "Yusuf Alamsyah", voucherName: "Potongan Scaling 50%", pointsUsed: 500, date: "2026-05-28" },
    { id: "RDP-009", patientName: "Laila Safitri", voucherName: "Diskon Perawatan 10%", pointsUsed: 200, date: "2026-06-10" },
    { id: "RDP-010", patientName: "Diana Rosa", voucherName: "Potongan Scaling 50%", pointsUsed: 500, date: "2026-06-05" },
    { id: "RDP-011", patientName: "Heri Wijaya", voucherName: "Diskon Perawatan 10%", pointsUsed: 200, date: "2026-05-18" }
  ]
};

const DEFAULT_USERS = [
  { username: "admin", name: "drg. Muhammad Rafi", role: "Dokter Utama / Admin Klinik", status: "Aktif", permissions: ["ALL"] },
  { username: "staff_lisa", name: "Lisa Anggraini", role: "Staff Resepsionis", status: "Aktif", permissions: ["READ_PATIENTS", "WRITE_SCHEDULES", "READ_TRANSACTIONS"] },
  { username: "staff_bagus", name: "Bagus Setiawan", role: "Staff Keuangan", status: "Aktif", permissions: ["READ_TRANSACTIONS", "WRITE_TRANSACTIONS"] }
];

// Helper to initialize database
function getStorage(key, defaultData) {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultData;
  }
}

function setStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Force re-seeding if version is outdated
if (localStorage.getItem(DB_VERSION_KEY) !== CURRENT_DB_VERSION) {
  localStorage.removeItem("crm_patients");
  localStorage.removeItem("crm_schedules");
  localStorage.removeItem("crm_transactions");
  localStorage.removeItem("crm_records");
  localStorage.removeItem("crm_notifications");
  localStorage.removeItem("crm_doctors");
  localStorage.removeItem("crm_treatments");
  localStorage.removeItem("crm_customer_activities");
  localStorage.removeItem("crm_feedbacks");
  localStorage.removeItem("crm_loyalty_rewards");
  
  localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
}

export const db = {
  getPatients: () => getStorage("crm_patients", DEFAULT_PATIENTS),
  savePatient: (patient) => {
    const list = db.getPatients();
    const existingIndex = list.findIndex(p => p.id === patient.id);
    if (existingIndex > -1) {
      list[existingIndex] = { ...list[existingIndex], ...patient };
    } else {
      list.push(patient);
    }
    setStorage("crm_patients", list);
  },
  deletePatient: (id) => {
    const list = db.getPatients().filter(p => p.id !== id);
    setStorage("crm_patients", list);
  },

  getSchedules: () => getStorage("crm_schedules", DEFAULT_SCHEDULES),
  saveSchedule: (sch) => {
    const list = db.getSchedules();
    const existingIndex = list.findIndex(s => s.id === sch.id);
    if (existingIndex > -1) {
      list[existingIndex] = { ...list[existingIndex], ...sch };
    } else {
      list.push(sch);
    }
    setStorage("crm_schedules", list);
  },
  deleteSchedule: (id) => {
    const list = db.getSchedules().filter(s => s.id !== id);
    setStorage("crm_schedules", list);
  },

  getTransactions: () => getStorage("crm_transactions", DEFAULT_TRANSACTIONS),
  saveTransaction: (tx) => {
    const list = db.getTransactions();
    const existingIndex = list.findIndex(t => t.id === tx.id);
    if (existingIndex > -1) {
      list[existingIndex] = { ...list[existingIndex], ...tx };
    } else {
      list.push(tx);
    }
    setStorage("crm_transactions", list);
  },

  getDentalRecords: () => getStorage("crm_records", DEFAULT_DENTAL_RECORDS),
  saveDentalRecord: (rec) => {
    const list = db.getDentalRecords();
    const existingIndex = list.findIndex(r => r.id === rec.id);
    if (existingIndex > -1) {
      list[existingIndex] = { ...list[existingIndex], ...rec };
    } else {
      list.push(rec);
    }
    setStorage("crm_records", list);
  },

  getNotifications: () => getStorage("crm_notifications", DEFAULT_NOTIFICATIONS),
  markNotificationRead: (id) => {
    const list = db.getNotifications().map(n => n.id === id ? { ...n, isRead: true } : n);
    setStorage("crm_notifications", list);
  },
  saveNotification: (notif) => {
    const list = db.getNotifications();
    list.unshift(notif); // Add new notifications at the top
    setStorage("crm_notifications", list);
  },

  getDoctors: () => getStorage("crm_doctors", DEFAULT_DOCTORS),
  saveDoctor: (doc) => {
    const list = db.getDoctors();
    const existingIndex = list.findIndex(d => d.id === doc.id);
    if (existingIndex > -1) {
      list[existingIndex] = { ...list[existingIndex], ...doc };
    } else {
      list.push(doc);
    }
    setStorage("crm_doctors", list);
  },

  getTreatments: () => getStorage("crm_treatments", DEFAULT_TREATMENTS),
  saveTreatment: (tr) => {
    const list = db.getTreatments();
    const existingIndex = list.findIndex(t => t.id === tr.id);
    if (existingIndex > -1) {
      list[existingIndex] = { ...list[existingIndex], ...tr };
    } else {
      list.push(tr);
    }
    setStorage("crm_treatments", list);
  },

  getCustomerActivities: () => getStorage("crm_customer_activities", DEFAULT_CUSTOMER_ACTIVITIES),
  saveCustomerActivity: (act) => {
    const list = db.getCustomerActivities();
    list.unshift(act);
    setStorage("crm_customer_activities", list);
  },

  getFeedbacks: () => getStorage("crm_feedbacks", DEFAULT_FEEDBACKS),
  saveFeedback: (fb) => {
    const list = db.getFeedbacks();
    const existingIndex = list.findIndex(f => f.id === fb.id);
    if (existingIndex > -1) {
      list[existingIndex] = { ...list[existingIndex], ...fb };
    } else {
      list.unshift(fb);
    }
    setStorage("crm_feedbacks", list);
  },

  getLoyaltyRewards: () => getStorage("crm_loyalty_rewards", DEFAULT_LOYALTY_REWARDS),
  saveLoyaltyRewards: (lr) => {
    setStorage("crm_loyalty_rewards", lr);
  },

  getUsers: () => getStorage("crm_users", DEFAULT_USERS),
  saveUser: (user) => {
    const list = db.getUsers();
    const existingIndex = list.findIndex(u => u.username === user.username);
    if (existingIndex > -1) {
      list[existingIndex] = { ...list[existingIndex], ...user };
    } else {
      list.push(user);
    }
    setStorage("crm_users", list);
  }
};
