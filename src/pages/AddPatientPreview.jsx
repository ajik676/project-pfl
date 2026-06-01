import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HiCheck, HiArrowLeft, HiUser, HiPhone, HiLocationMarker, HiCalendar } from "react-icons/hi";

export default function AddPatientPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const patientData = location.state;

  if (!patientData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <p className="text-slate-500 font-semibold mb-4">Tidak ada data pratinjau. Silakan isi form kembali.</p>
        <Button onClick={() => navigate("/patients/add")}>Ke Form Registrasi</Button>
      </div>
    );
  }

  const handleConfirmSave = () => {
    // Generate new patient ID
    const newId = `PT-0${db.getPatients().length + 1}`;
    const newPatient = {
      id: newId,
      name: patientData.name,
      gender: patientData.gender,
      age: parseInt(patientData.age) || 0,
      phone: patientData.phone || "-",
      email: patientData.email || `${patientData.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      address: patientData.address || "-",
      city: patientData.city || "Jakarta",
      registeredDate: new Date().toISOString().split("T")[0],
      membershipStatus: "Aktif",
      membershipLevel: patientData.membershipLevel || "Bronze",
      complaint: patientData.complaint || "Konsultasi Umum",
      status: patientData.status || "Aktif",
      adminNotes: patientData.adminNotes || "Pasien baru terdaftar.",
      history: [
        {
          date: new Date().toISOString().split("T")[0],
          doctor: "drg. Rina",
          action: "Registrasi & Pemeriksaan Awal",
          notes: "Pasien baru terdaftar di klinik gigi."
        }
      ],
      complaints: [],
      feedbacks: []
    };

    // Save to Mock DB
    db.savePatient(newPatient);

    // Save transaction if scaling or whatever (optional, keep it simple)
    // Save system notification
    db.saveNotification({
      id: `NT-0${db.getNotifications().length + 1}`,
      title: "Pasien Baru Terdaftar",
      description: `${newPatient.name} terdaftar sebagai pasien baru kelas ${newPatient.membershipLevel}.`,
      type: "Pasien Baru",
      date: new Date().toISOString().split("T")[0],
      isRead: false
    });

    alert("Data pasien berhasil didaftarkan secara permanen!");
    navigate("/patients");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/patients/add", { state: patientData })}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-xs transition-colors"
        >
          <HiArrowLeft className="text-base" /> Kembali ke Form & Edit
        </button>

        <Card className="border border-slate-200/80 shadow-md">
          <CardHeader className="bg-slate-50/60">
            <CardTitle>Ringkasan Data Pasien Baru</CardTitle>
            <CardDescription>Pratinjau detail sebelum data disimpan ke database rekam medis.</CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8 space-y-6">
            
            {/* Top Identity Mock Badge */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 font-bold text-xl flex items-center justify-center">
                {patientData.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{patientData.name}</h3>
                <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Pratinjau Registrasi</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-600">
              
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Jenis Kelamin</span>
                <span className="text-slate-800 font-bold">{patientData.gender}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Umur</span>
                <span className="text-slate-800 font-bold">{patientData.age} Tahun</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Nomor Handphone</span>
                <span className="text-slate-800 font-bold">{patientData.phone || "-"}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Membership Tingkat</span>
                <Badge variant="warning">{patientData.membershipLevel || "Bronze"}</Badge>
              </div>

              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Keluhan Utama</span>
                <span className="text-slate-800 font-bold bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-md border border-blue-100/50">
                  {patientData.complaint || "Konsultasi Umum"}
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-slate-400 font-medium block">Alamat Domisili</span>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 font-semibold italic">
                  {patientData.address || "-"}, {patientData.city || "Jakarta"}
                </p>
              </div>

            </div>

          </CardContent>

          <CardFooter className="bg-slate-50/20 py-4.5 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/patients/add", { state: patientData })}
            >
              Ubah Data
            </Button>
            <Button
              onClick={handleConfirmSave}
              className="flex items-center gap-1.5"
            >
              <HiCheck className="text-base" /> Konfirmasi & Simpan
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
