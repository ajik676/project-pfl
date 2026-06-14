import React, { useState, useEffect } from "react";
import { db } from "../data/db";
import { supabase } from "../data/supabaseClient";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { DataTable } from "../components/ui/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/Dialog";
import { HiOutlineCog, HiOutlineLockClosed, HiOutlineExclamation, HiPlus, HiTrash, HiPencilAlt } from "react-icons/hi";

const AVAILABLE_PERMISSIONS = [
  "READ_PATIENTS",
  "WRITE_PATIENTS",
  "READ_SCHEDULES",
  "WRITE_SCHEDULES",
  "READ_TRANSACTIONS",
  "WRITE_TRANSACTIONS",
  "ALL"
];

export default function Settings() {
  const [users, setUsers] = useState([]);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    role: "",
    status: "",
    permissions: []
  });

  // Add staff info state
  const [isAddInfoOpen, setIsAddInfoOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setUsers(data || []);
      setIsUsingSupabase(true);
    } catch (err) {
      console.warn("Falling back to local storage users data:", err.message);
      setUsers(db.getUsers());
      setIsUsingSupabase(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getPermissionsBadges = (perms) => {
    const permissionsArray = Array.isArray(perms) ? perms : [];
    if (permissionsArray.length === 0) return <span className="text-[10px] text-slate-400 font-semibold italic">None</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {permissionsArray.map((p, idx) => (
          <span key={idx} className="text-[9px] font-bold tracking-wide bg-blue-50 text-blue-600 border border-blue-100/40 px-2 py-0.5 rounded uppercase">
            {p}
          </span>
        ))}
      </div>
    );
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || "",
      role: user.role || "Staff",
      status: user.status || "Aktif",
      permissions: Array.isArray(user.permissions) ? [...user.permissions] : []
    });
    setIsEditOpen(true);
  };

  const handlePermissionChange = (perm) => {
    const isChecked = editFormData.permissions.includes(perm);
    let updatedPerms = [];
    if (isChecked) {
      updatedPerms = editFormData.permissions.filter(p => p !== perm);
    } else {
      updatedPerms = [...editFormData.permissions, perm];
    }
    setEditFormData({ ...editFormData, permissions: updatedPerms });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      if (isUsingSupabase) {
        const { error } = await supabase
          .from("profiles")
          .update({
            name: editFormData.name,
            role: editFormData.role,
            status: editFormData.status,
            permissions: editFormData.permissions
          })
          .eq("id", selectedUser.id);

        if (error) throw error;
      } else {
        // Fallback Local Storage CRUD
        const localUser = {
          ...selectedUser,
          name: editFormData.name,
          role: editFormData.role,
          status: editFormData.status,
          permissions: editFormData.permissions
        };
        db.saveUser(localUser);
      }

      alert("Profil staff berhasil diperbarui!");
      setIsEditOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      alert("Gagal memperbarui profil: " + err.message);
    }
  };

  const handleDeleteClick = async (user) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akses staff "${user.name}"? Tindakan ini permanen.`)) {
      try {
        if (isUsingSupabase) {
          const { error } = await supabase
            .from("profiles")
            .delete()
            .eq("id", user.id);

          if (error) throw error;
        } else {
          // Fallback Local Storage deletion
          const updatedUsers = db.getUsers().filter(u => u.username !== user.username);
          localStorage.setItem("crm_users", JSON.stringify(updatedUsers));
        }

        alert("Staff berhasil dihapus dari sistem.");
        fetchUsers();
      } catch (err) {
        alert("Gagal menghapus staff: " + err.message);
      }
    }
  };

  const columns = [
    {
      header: "Nama Pengguna",
      accessorKey: "name",
      sortable: true,
      cell: (row) => <span className="font-bold text-slate-800">{row.name}</span>,
    },
    {
      header: "Username",
      accessorKey: "username",
      sortable: true,
      cell: (row) => <span className="text-slate-400 font-bold font-mono">@{row.username}</span>,
    },
    {
      header: "Jabatan / Role",
      accessorKey: "role",
      sortable: true,
      cell: (row) => <span className="font-semibold text-slate-600">{row.role}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => <Badge variant={row.status === "Aktif" ? "success" : "secondary"}>{row.status}</Badge>,
    },
    {
      header: "Hak Akses / Permission",
      accessorKey: "permissions",
      cell: (row) => getPermissionsBadges(row.permissions),
    },
    {
      header: "Aksi",
      cell: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEditClick(row)} className="flex items-center gap-1 hover:border-blue-600 hover:text-blue-600">
            <HiPencilAlt /> Edit Hak
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDeleteClick(row)} className="flex items-center gap-1 hover:border-red-600 hover:text-red-600">
            <HiTrash /> Hapus
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm/5">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <HiOutlineCog className="text-2xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800">Pengaturan & User Management</h1>
                <Badge variant={isUsingSupabase ? "success" : "secondary"} className="text-[9px] uppercase tracking-wider font-extrabold">
                  {isUsingSupabase ? "Supabase Live" : "Local Mock Storage"}
                </Badge>
              </div>
              <p className="text-slate-500 text-xs italic">Kelola staff klinik, akun login administrator, penetapan jabatan, dan izin hak akses</p>
            </div>
          </div>

          <Button onClick={() => setIsAddInfoOpen(true)} className="flex items-center gap-1.5">
            <HiPlus /> Tambah Akun Staff
          </Button>
        </div>

        {/* User Management List */}
        <Card className="p-5">
          <CardHeader className="px-0 pt-0 pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <HiOutlineLockClosed className="text-blue-600 text-lg" />
              <CardTitle>Daftar Pengguna & Staff Klinik</CardTitle>
            </div>
            <CardDescription>Akun staff resepsionis, keuangan, dan admin medis SmileDental yang memiliki akses masuk.</CardDescription>
          </CardHeader>
          <DataTable
            data={users}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Cari nama staff..."
          />
        </Card>

      </div>

      {/* MODAL EDIT HAK AKSES */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Hak Akses & Jabatan</DialogTitle>
            <DialogDescription>Sesuaikan peran, status aktif, dan izin hak akses untuk staff klinik.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4">
            {/* Nama */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-600">Nama Lengkap</label>
              <input
                type="text"
                required
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="w-full text-xs font-semibold px-3 py-2 border rounded-xl"
                style={{ borderColor: "#e2e8f0" }}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-600">Role / Jabatan</label>
              <select
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                className="w-full text-xs font-semibold px-3 py-2 border rounded-xl"
                style={{ borderColor: "#e2e8f0" }}
              >
                <option value="Admin">Admin / Dokter Utama</option>
                <option value="Dokter">Dokter Gigi</option>
                <option value="Staff Resepsionis">Staff Resepsionis</option>
                <option value="Staff Keuangan">Staff Keuangan</option>
                <option value="Staff">Staff Umum</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-600">Status Akun</label>
              <select
                value={editFormData.status}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                className="w-full text-xs font-semibold px-3 py-2 border rounded-xl"
                style={{ borderColor: "#e2e8f0" }}
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-600">Izin Akses (Permissions)</label>
              <div className="grid grid-cols-2 gap-2 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                {AVAILABLE_PERMISSIONS.map((p) => {
                  const checked = editFormData.permissions.includes(p);
                  return (
                    <label key={p} className="flex items-center gap-2 text-[10px] font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handlePermissionChange(p)}
                        className="rounded text-blue-600"
                      />
                      {p}
                    </label>
                  );
                })}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL TAMBAH STAFF INFO */}
      <Dialog open={isAddInfoOpen} onOpenChange={setIsAddInfoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-2">
              <HiOutlineExclamation className="text-xl" />
            </div>
            <DialogTitle>Cara Pendaftaran Akun Staff</DialogTitle>
            <DialogDescription>Penjelasan alur keamanan pendaftaran pengguna.</DialogDescription>
          </DialogHeader>

          <div className="text-xs font-semibold text-slate-600 space-y-3 leading-relaxed">
            <p>Untuk alasan keamanan data medis klinik, penambahan staff baru dilakukan dengan alur berikut:</p>
            <ol className="list-decimal pl-4 space-y-1.5">
              <li>Minta staff yang bersangkutan untuk membuka <strong>Halaman Pendaftaran mandiri (/register)</strong>.</li>
              <li>Staff mengisi Nama, Username unik, Email resmi, serta kata sandi mereka.</li>
              <li>Setelah staff berhasil mendaftar, akun mereka akan muncul di daftar tabel ini secara otomatis.</li>
              <li>Admin klinik dapat menekan tombol <strong>Edit Hak</strong> pada nama staff tersebut untuk mengubah Jabatan (Role) dan memberikan izin hak akses (Permissions) yang relevan.</li>
            </ol>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsAddInfoOpen(false)}>Mengerti</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
