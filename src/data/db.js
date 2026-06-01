// Central State Manager with localStorage backup for persistence.

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
    adminNotes: "Pasien memiliki sensitivitas dingin pada gigi geraham bawah kiri.",
    history: [
      { date: "2026-05-05", doctor: "drg. Rina", action: "Scaling Gigi", notes: "Pembersihan karang gigi selesai." }
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
    adminNotes: "Alergi terhadap obat Penicillin.",
    history: [
      { date: "2026-04-12", doctor: "drg. Budi", action: "Konsultasi Bedah Mulut", notes: "Rontgen gigi selesai, dijadwalkan cabut." }
    ],
    complaints: [],
    feedbacks: [
      { id: "F-2", rating: 5, review: "Penjelasan dokter sangat detail mengenai tindakan bedah.", date: "2026-04-12" }
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
    adminNotes: "Pasien rutin kontrol behel setiap 4 minggu sekali.",
    history: [
      { date: "2026-04-20", doctor: "drg. Rina", action: "Kontrol Bracket", notes: "Penggantian kawat busur atas." }
    ],
    complaints: [],
    feedbacks: []
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
    adminNotes: "Sering cemas saat mendengar suara dental drill.",
    history: [
      { date: "2026-05-10", doctor: "drg. Rina", action: "Tambal Gigi Depan", notes: "Menggunakan bahan resin komposit." }
    ],
    complaints: [],
    feedbacks: [
      { id: "F-3", rating: 5, review: "Dokter sangat sabar menenangkan saya yang phobia bor.", date: "2026-05-10" }
    ]
  }
];

const DEFAULT_SCHEDULES = [
  { id: "SCH-001", patientId: "PT-001", patientName: "Andi Saputra", date: "2026-06-01", time: "09:00", doctor: "drg. Rina", complaint: "Scaling Gigi", status: "Menunggu" },
  { id: "SCH-002", patientId: "PT-002", patientName: "Siti Aisyah", date: "2026-06-01", time: "10:30", doctor: "drg. Budi", complaint: "Cabut Gigi Bungsu", status: "Selesai" },
  { id: "SCH-003", patientId: "PT-003", patientName: "Budi Santoso", date: "2026-06-02", time: "13:00", doctor: "drg. Rina", complaint: "Pasang Behel", status: "Dibatalkan" }
];

const DEFAULT_TRANSACTIONS = [
  { id: "TX-1001", patientId: "PT-001", patientName: "Andi Saputra", date: "2026-05-05", service: "Scaling & Polishing", amount: 450000, method: "Debit Mandiri", status: "Berhasil" },
  { id: "TX-1002", patientId: "PT-002", patientName: "Siti Aisyah", date: "2026-04-12", service: "Rontgen Gigi + Konsultasi", amount: 650000, method: "QRIS", status: "Berhasil" },
  { id: "TX-1003", patientId: "PT-003", patientName: "Budi Santoso", date: "2026-04-20", service: "Kontrol Behel Bulanan", amount: 350000, method: "Tunai", status: "Berhasil" },
  { id: "TX-1004", patientId: "PT-004", patientName: "Dewi Lestari", date: "2026-05-10", service: "Tambal Resin Komposit", amount: 500000, method: "Kartu Kredit", status: "Berhasil" }
];

const DEFAULT_DENTAL_RECORDS = [
  { id: "REC-001", patientId: "PT-001", patientName: "Andi Saputra", date: "2026-05-05", doctor: "drg. Rina", diagnosis: "Kalkulus (Karang Gigi) menyeluruh di bagian bawah", treatment: "Scaling rahang atas dan bawah", notes: "Instruksi menyikat gigi dengan benang gigi.", controlDate: "2026-11-05" },
  { id: "REC-002", patientId: "PT-002", patientName: "Siti Aisyah", date: "2026-04-12", doctor: "drg. Budi", diagnosis: "Impaksi Molar 3 kanan bawah (Gigi bungsu miring)", treatment: "Konsultasi & Rencana Odontektomi", notes: "Menunggu jadwal libur pasien.", controlDate: "2026-06-15" },
  { id: "REC-003", patientId: "PT-003", patientName: "Budi Santoso", date: "2026-04-20", doctor: "drg. Rina", diagnosis: "Maloklusi Kelas I dengan crowding anterior", treatment: "Aktivasi Archwire & ganti ligatur karet", notes: "Karet warna biru muda dipilih pasien.", controlDate: "2026-05-18" },
  { id: "REC-004", patientId: "PT-004", patientName: "Dewi Lestari", date: "2026-05-10", doctor: "drg. Rina", diagnosis: "Karies dentin gigi 21 (Gigi seri atas)", treatment: "Restorasi komposit kelas IV", notes: "Estetika baik, warna match A2.", controlDate: "2026-11-10" }
];

const DEFAULT_NOTIFICATIONS = [
  { id: "NT-001", title: "Reminder Jadwal Pasien", description: "Pasien Andi Saputra memiliki jadwal besok 09:00 WIB untuk Scaling.", type: "Reminder Jadwal", date: "2026-05-31", isRead: false },
  { id: "NT-002", title: "Registrasi Pasien Baru", description: "Dewi Lestari terdaftar sebagai pasien baru di sistem.", type: "Pasien Baru", date: "2026-05-10", isRead: true },
  { id: "NT-003", title: "Membership Upgrade", description: "Siti Aisyah telah di-upgrade ke level Gold karena akumulasi kunjungan.", type: "Membership Upgrade", date: "2026-04-12", isRead: false },
  { id: "NT-004", title: "Pembayaran Berhasil", description: "Invoice TX-1004 atas nama Dewi Lestari senilai Rp 500.000 telah dibayar.", type: "Pembayaran Berhasil", date: "2026-05-10", isRead: true }
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
  }
};
