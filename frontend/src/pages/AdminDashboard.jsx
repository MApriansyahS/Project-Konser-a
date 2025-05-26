import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../api/axiosInstance';
import { BASE_URL } from "../utils/utils.js";
import useAuth from "../auth/useAuth";

const AdminDashboard = () => {
  const { logout, accessToken } = useAuth();
  const navigate = useNavigate();
  
  // State untuk list data
  const [konserList, setKonserList] = useState([]);
  const [tiketList, setTiketList] = useState([]);
  
  // State untuk form tambah konser
  const [newKonser, setNewKonser] = useState({
    nama: "",
    tanggal: "",
    lokasi: "",
    bintangtamu: "",
    harga: "",
    quota: ""
  });

  // State untuk mode edit
  const [editingKonser, setEditingKonser] = useState(null);
  const [editingTiket, setEditingTiket] = useState(null);

  useEffect(() => {
    if (accessToken) {
      fetchKonser();
      fetchTiket();
    }
  }, [accessToken]);

  const fetchKonser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/konser`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setKonserList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching konser:", error);
    }
  };

  const fetchTiket = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tiket`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setTiketList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching tiket:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewKonser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddKonser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/konser`, newKonser, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setNewKonser({
        nama: "",
        tanggal: "",
        lokasi: "",
        bintangtamu: "",
        harga: "",
        quota: ""
      });
      fetchKonser();
      fetchTiket();
    } catch (error) {
      console.error("Error adding konser:", error);
      alert(error.response?.data?.message || "Gagal menambah konser");
    }
  };

  const handleDeleteKonser = async (id) => {
    if (window.confirm("Yakin ingin menghapus konser ini?")) {
      try {
        await axios.delete(`${BASE_URL}/konser/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        fetchKonser();
        fetchTiket();
      } catch (error) {
        console.error("Error deleting konser:", error);
        alert(error.response?.data?.message || "Gagal menghapus konser");
      }
    }
  };

  const handleEditKonser = async (id) => {
    try {
      const konser = konserList.find(k => k.id === id);
      setEditingKonser({
        id,
        nama: konser.nama,
        tanggal: konser.tanggal
      });
    } catch (error) {
      console.error("Error setting edit konser:", error);
    }
  };

  const handleEditTiket = async (id) => {
    try {
      const tiket = tiketList.find(t => t.id === id);
      setEditingTiket({
        id,
        harga: tiket.harga,
        quota: tiket.quota
      });
    } catch (error) {
      console.error("Error setting edit tiket:", error);
    }
  };

  const handleUpdateKonser = async () => {
    try {
      await axios.patch(`${BASE_URL}/konser/${editingKonser.id}`, {
        nama: editingKonser.nama,
        tanggal: editingKonser.tanggal
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setEditingKonser(null);
      fetchKonser();
      fetchTiket();
    } catch (error) {
      console.error("Error updating konser:", error);
      alert(error.response?.data?.message || "Gagal mengupdate konser");
    }
  };

  const handleUpdateTiket = async () => {
    try {
      await axios.patch(`${BASE_URL}/tiket/${editingTiket.id}`, {
        harga: editingTiket.harga,
        quota: editingTiket.quota
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setEditingTiket(null);
      fetchTiket();
    } catch (error) {
      console.error("Error updating tiket:", error);
      alert(error.response?.data?.message || "Gagal mengupdate tiket");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>

        {/* Form Tambah Konser */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Tambah Konser Baru</h2>
          <form onSubmit={handleAddKonser} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Nama Konser</label>
              <input
                type="text"
                name="nama"
                value={newKonser.nama}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Tanggal</label>
              <input
                type="text"
                name="tanggal"
                value={newKonser.tanggal}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Lokasi</label>
              <input
                type="text"
                name="lokasi"
                value={newKonser.lokasi}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Bintang Tamu</label>
              <input
                type="text"
                name="bintangtamu"
                value={newKonser.bintangtamu}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Harga Tiket</label>
              <input
                type="number"
                name="harga"
                value={newKonser.harga}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Quota Tiket</label>
              <input
                type="number"
                name="quota"
                value={newKonser.quota}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button type="submit" className="col-span-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Tambah Konser
            </button>
          </form>
        </div>

        {/* Daftar Konser */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Daftar Konser</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2">Nama</th>
                  <th className="p-2">Tanggal</th>
                  <th className="p-2">Lokasi</th>
                  <th className="p-2">Bintang Tamu</th>
                  <th className="p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {konserList.map((konser) => (
                  <tr key={konser.id} className="border-t">
                    <td className="p-2">{konser.nama}</td>
                    <td className="p-2">{konser.tanggal}</td>
                    <td className="p-2">{konser.lokasi}</td>
                    <td className="p-2">{konser.bintangtamu}</td>
                    <td className="p-2">
                      <button onClick={() => handleEditKonser(konser.id)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteKonser(konser.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Daftar Tiket */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Daftar Tiket</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2">Nama Konser</th>
                  <th className="p-2">Tanggal</th>
                  <th className="p-2">Harga</th>
                  <th className="p-2">Quota</th>
                  <th className="p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tiketList.map((tiket) => (
                  <tr key={tiket.id} className="border-t">
                    <td className="p-2">{tiket.nama}</td>
                    <td className="p-2">{tiket.tanggal}</td>
                    <td className="p-2">{tiket.harga}</td>
                    <td className="p-2">{tiket.quota}</td>
                    <td className="p-2">
                      <button onClick={() => handleEditTiket(tiket.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Edit Konser */}
        {editingKonser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-bold mb-4">Edit Konser</h3>
              <div className="mb-4">
                <label className="block text-sm mb-2">Nama</label>
                <input
                  type="text"
                  value={editingKonser.nama}
                  onChange={(e) => setEditingKonser({...editingKonser, nama: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Tanggal</label>
                <input
                  type="text"
                  value={editingKonser.tanggal}
                  onChange={(e) => setEditingKonser({...editingKonser, tanggal: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditingKonser(null)} className="bg-gray-500 text-white px-4 py-2 rounded">
                  Batal
                </button>
                <button onClick={handleUpdateKonser} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Edit Tiket */}
        {editingTiket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-bold mb-4">Edit Tiket</h3>
              <div className="mb-4">
                <label className="block text-sm mb-2">Harga</label>
                <input
                  type="number"
                  value={editingTiket.harga}
                  onChange={(e) => setEditingTiket({...editingTiket, harga: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Quota</label>
                <input
                  type="number"
                  value={editingTiket.quota}
                  onChange={(e) => setEditingTiket({...editingTiket, quota: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditingTiket(null)} className="bg-gray-500 text-white px-4 py-2 rounded">
                  Batal
                </button>
                <button onClick={handleUpdateTiket} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;