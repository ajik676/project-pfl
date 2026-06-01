import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import { HiArrowLeft, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiCheckCircle, HiCalendar, HiPencilAlt } from "react-icons/hi";

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => {
    const list = db.getPatients();
    const found = list.find((p) => p.id === id);
    if (found) {
      setPatient(found);
      setAdminNotes(found.adminNotes || "");
    }
  }, [id]);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <p className="text-slate-500 font-semibold mb-4">Data Pasien Tidak Ditemukan</p>
        <Button onClick={() => navigate("/patients")}>Kembali ke Daftar Pasien</Button>
      </div>
    );
  }

  const handleSaveNotes = () => {
    const updated = { ...patient, adminNotes };
    db.savePatient(updated);
    setPatient(updated);
    setIsEditingNotes(false);
  };

  const getMembershipBadgeVariant = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case "platinum": return "default";
      case "gold": return "warning";
      case "silver": return "info";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation & Action Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/patients")}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-xs transition-colors"
          >
            <HiArrowLeft className="text-base" /> Kembali ke Pasien
          </button>
          
          <Badge variant={patient.status === "Aktif" ? "success" : "destructive"}>
            Status: {patient.status}
          </Badge>
        </div>

        {/* Profile Card Header */}
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 font-bold text-3xl flex items-center justify-center shadow-inner">
                {patient.name.charAt(0)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
                  <Badge variant={getMembershipBadgeVariant(patient.membershipLevel)}>
                    {patient.membershipLevel} Member
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 font-medium">ID Pasien: <span className="font-bold text-slate-700">{patient.id}</span></p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-slate-500 font-semibold pt-1">
                  <span className="flex items-center gap-1.5"><HiOutlinePhone className="text-slate-400" /> {patient.phone}</span>
                  <span className="flex items-center gap-1.5"><HiOutlineMail className="text-slate-400" /> {patient.email || "-"}</span>
                  <span className="flex items-center gap-1.5"><HiOutlineLocationMarker className="text-slate-400" /> {patient.city || "Jakarta"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Organizers */}
        <Tabs defaultValue="profil">
          <TabsList className="w-full flex justify-start overflow-x-auto">
            <TabsTrigger value="profil">Profil</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
            <TabsTrigger value="kunjungan">Kunjungan</TabsTrigger>
            <TabsTrigger value="transaksi">Transaksi</TabsTrigger>
            <TabsTrigger value="catatan">Catatan Admin</TabsTrigger>
          </TabsList>

          {/* TAB CONTENT: PROFIL */}
          <TabsContent value="profil">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data Pribadi Pasien</CardTitle>
                  <CardDescription>Biodata lengkap identitas pasien terdaftar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 text-xs border-b border-slate-50 pb-2">
                    <span className="text-slate-400 font-semibold">Nama Lengkap</span>
                    <span className="text-slate-700 font-bold text-right">{patient.name}</span>
                  </div>
                  <div className="grid grid-cols-2 text-xs border-b border-slate-50 pb-2">
                    <span className="text-slate-400 font-semibold">Jenis Kelamin</span>
                    <span className="text-slate-700 font-bold text-right">{patient.gender}</span>
                  </div>
                  <div className="grid grid-cols-2 text-xs border-b border-slate-50 pb-2">
                    <span className="text-slate-400 font-semibold">Umur</span>
                    <span className="text-slate-700 font-bold text-right">{patient.age} Tahun</span>
                  </div>
                  <div className="grid grid-cols-2 text-xs">
                    <span className="text-slate-400 font-semibold">Tanggal Daftar</span>
                    <span className="text-slate-700 font-bold text-right">{patient.registeredDate}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kontak & Domisili</CardTitle>
                  <CardDescription>Detail alamat dan kontak penanggung jawab.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 text-xs border-b border-slate-50 pb-2">
                    <span className="text-slate-400 font-semibold">Nomor Handphone</span>
                    <span className="text-slate-700 font-bold text-right">{patient.phone}</span>
                  </div>
                  <div className="grid grid-cols-2 text-xs border-b border-slate-50 pb-2">
                    <span className="text-slate-400 font-semibold">Email</span>
                    <span className="text-slate-700 font-bold text-right">{patient.email || "-"}</span>
                  </div>
                  <div className="grid grid-cols-2 text-xs">
                    <span className="text-slate-400 font-semibold">Alamat Rumah</span>
                    <span className="text-slate-700 font-bold text-right">{patient.address || "-"}, {patient.city || ""}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB CONTENT: MEMBERSHIP */}
          <TabsContent value="membership">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Loyalitas Pelanggan (Membership)</CardTitle>
                <CardDescription>Status loyalitas dan hak istimewa pasien.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-3xl font-bold">💎</div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Level Saat Ini</p>
                    <p className="text-lg font-bold text-slate-800">{patient.membershipLevel}</p>
                  </div>
                  <Badge variant="success">Status: Terdaftar</Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Benefit Keanggotaan {patient.membershipLevel}:</h4>
                  <ul className="space-y-2.5">
                    <li className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <HiCheckCircle className="text-emerald-500 text-lg shrink-0" />
                      Diskon layanan dokter gigi sebesar {patient.membershipLevel === "Platinum" ? "15%" : patient.membershipLevel === "Gold" ? "10%" : patient.membershipLevel === "Silver" ? "5%" : "0%"} untuk semua tindakan.
                    </li>
                    <li className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <HiCheckCircle className="text-emerald-500 text-lg shrink-0" />
                      Prioritas antrean pemesanan jadwal via Aplikasi Admin.
                    </li>
                    <li className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <HiCheckCircle className="text-emerald-500 text-lg shrink-0" />
                      Gratis souvenir/kit perawatan gigi setiap kunjungan ke-5.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB CONTENT: KUNJUNGAN */}
          <TabsContent value="kunjungan">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Riwayat Kunjungan Klinik</CardTitle>
                <CardDescription>Daftar riwayat pemeriksaan medis dan tindakan klinik gigi.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {patient.history && patient.history.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {patient.history.map((h, i) => (
                      <div key={i} className="p-6 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                          <HiCalendar className="text-xl" />
                        </div>
                        <div className="flex-1 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{h.action}</span>
                            <span className="text-slate-400 font-semibold">{h.date}</span>
                          </div>
                          <p className="text-slate-500 font-medium">Dokter Gigi: <strong className="text-slate-700">{h.doctor}</strong></p>
                          <p className="text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100/50 mt-1">{h.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400 text-xs">Belum ada riwayat kunjungan.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB CONTENT: TRANSAKSI */}
          <TabsContent value="transaksi">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Riwayat Keuangan & Transaksi</CardTitle>
                <CardDescription>Daftar invoice dan pembayaran layanan gigi.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Invoice</th>
                        <th className="px-6 py-4">Layanan</th>
                        <th className="px-6 py-4">Metode</th>
                        <th className="px-6 py-4 text-right">Total</th>
                        <th className="px-6 py-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                      {db.getTransactions().filter(t => t.patientId === patient.id).length > 0 ? (
                        db.getTransactions().filter(t => t.patientId === patient.id).map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-6 py-4 font-bold text-blue-600">{t.id}</td>
                            <td className="px-6 py-4">{t.service}</td>
                            <td className="px-6 py-4 text-slate-500">{t.method}</td>
                            <td className="px-6 py-4 text-right font-bold text-slate-900">Rp {t.amount.toLocaleString("id-ID")}</td>
                            <td className="px-6 py-4 text-center">
                              <Badge variant="success">{t.status}</Badge>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">Belum ada riwayat transaksi pembayaran.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB CONTENT: CATATAN ADMIN */}
          <TabsContent value="catatan">
            <Card className="mt-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Catatan Internal Admin / Klinik</CardTitle>
                    <CardDescription>Catatan khusus atau instruksi klinis khusus terkait pasien ini.</CardDescription>
                  </div>
                  {!isEditingNotes && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(true)} className="flex items-center gap-1.5">
                      <HiPencilAlt /> Edit Catatan
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingNotes ? (
                  <div className="space-y-3">
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows="4"
                      className="w-full p-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 resize-none font-sans"
                      placeholder="Tambahkan catatan khusus..."
                    />
                    <div className="flex items-center justify-end gap-2.5">
                      <Button variant="outline" size="sm" onClick={() => { setIsEditingNotes(false); setAdminNotes(patient.adminNotes || ""); }}>Batal</Button>
                      <Button size="sm" onClick={handleSaveNotes}>Simpan</Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 min-h-[100px] text-xs text-slate-600 font-medium leading-relaxed italic whitespace-pre-line">
                    {patient.adminNotes ? patient.adminNotes : "Tidak ada catatan khusus untuk pasien ini."}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
