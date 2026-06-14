import React, { useState, useEffect } from "react";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ImageCard } from "../components/ui/ImageCard";
import { HiOutlineUser, HiOutlinePhone, HiOutlineStar, HiPlus } from "react-icons/hi";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    setDoctors(db.getDoctors());
  }, []);

  const handleEditSchedule = (name) => {
    alert(`Mengedit jadwal tugas untuk ${name}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm/5">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <HiOutlineUser className="text-2xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Dokter Gigi Bertugas</h1>
              <p className="text-slate-500 text-xs italic">Kelola jadwal tugas, spesialisasi, dan performa dokter gigi</p>
            </div>
          </div>

          <Button onClick={() => alert("Tambah data dokter gigi baru...")} className="flex items-center gap-1.5">
            <HiPlus /> Tambah Dokter
          </Button>
        </div>

        {/* Doctors Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctors.map((d) => (
            <ImageCard
              key={d.id}
              fallbackText={d.image}
              title={d.name}
              subtitle={d.specialty}
              badge={d.status}
              onClick={() => handleEditSchedule(d.name)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
