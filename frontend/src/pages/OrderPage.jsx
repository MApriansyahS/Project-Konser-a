import { useState, useEffect } from "react";
import axios from '../api/axiosInstance.js';
import { BASE_URL } from "../utils/utils.js";
import useAuth from "../auth/useAuth.js";

const OrderPage = () => {
  const { accessToken } = useAuth();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [umur, setUmur] = useState("");
  const [tiketList, setTiketList] = useState([]);
  const [selectedTiket, setSelectedTiket] = useState("");
  const [message, setMessage] = useState("");
  const [myTickets, setMyTickets] = useState([]);

  useEffect(() => {
    fetchTiket();
    fetchMyTickets();
  }, []);

  const fetchTiket = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tiket`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTiketList(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch tiket:", err);
      setTiketList([]);
    }
  };

  const fetchMyTickets = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/pengunjung`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Filter pengunjung berdasarkan email user
      const pengunjung = (res.data.data || []).find(p => p.email === email);
      setMyTickets(pengunjung && pengunjung.tiket ? pengunjung.tiket.split(',') : []);
    } catch (err) {
      console.error("Failed to fetch my tickets:", err);
      setMyTickets([]);
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!nama || !email || !umur || !selectedTiket) {
      setMessage("Semua field harus diisi!");
      return;
    }
    try {
      await axios.patch(`${BASE_URL}/order/${selectedTiket}`, {
        nama,
        umur,
        email
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMessage("Order berhasil! Tiket sudah ditambahkan ke akun Anda.");
      fetchTiket();
      fetchMyTickets();
    } catch (err) {
      setMessage(err.response?.data?.message || "Order gagal!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Pesan Tiket</h2>
        <form onSubmit={handleOrder}>
          <div className="mb-4">
            <label htmlFor="nama" className="block text-sm font-medium text-gray-600">Nama</label>
            <input type="text" id="nama" className="w-full p-3 mt-2 border border-gray-300 rounded-md" value={nama} onChange={e => setNama(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input type="email" id="email" className="w-full p-3 mt-2 border border-gray-300 rounded-md" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label htmlFor="umur" className="block text-sm font-medium text-gray-600">Umur</label>
            <input type="number" id="umur" className="w-full p-3 mt-2 border border-gray-300 rounded-md" value={umur} onChange={e => setUmur(e.target.value)} required />
          </div>
          <div className="mb-6">
            <label htmlFor="tiket" className="block text-sm font-medium text-gray-600">Pilih Tiket</label>
            <select id="tiket" className="w-full p-3 mt-2 border border-gray-300 rounded-md" value={selectedTiket} onChange={e => setSelectedTiket(e.target.value)} required>
              <option value="">-- Pilih Tiket --</option>
              {tiketList.map(t => (
                <option key={t.id} value={t.id}>{t.nama} | {t.tanggal} | Sisa: {t.quota}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">Pesan</button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Tiket yang sudah dibeli:</h3>
          {myTickets.length > 0 ? (
            <ul className="list-disc pl-5">
              {myTickets.map((t, idx) => <li key={idx}>{t}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Belum ada tiket yang dibeli.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
