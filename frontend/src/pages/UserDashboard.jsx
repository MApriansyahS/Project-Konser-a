import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../api/axiosInstance';
import { BASE_URL } from "../utils/utils.js";
import useAuth from "../auth/useAuth";

const UserDashboard = () => {
  const { logout, accessToken } = useAuth();
  const navigate = useNavigate();

  const [konserList, setKonserList] = useState([]);
  const [tiketList, setTiketList] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [userData, setUserData] = useState({
    nama: "",
    email: "",
    umur: ""
  });

  useEffect(() => {
    if (accessToken) {
      fetchKonser();
      fetchTiket();
      fetchMyTickets();
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

  const fetchMyTickets = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/pengunjung`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      // Filter tiket berdasarkan email user
      const myData = response.data.data.find(p => p.email === userData.email);
      if (myData) {
        setMyTickets(myData.tiket ? myData.tiket.split(',') : []);
      }
    } catch (error) {
      console.error("Error fetching my tickets:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePesanTiket = async (tiketId) => {
    if (!userData.nama || !userData.email || !userData.umur) {
      alert("Mohon lengkapi data diri Anda!");
      return;
    }

    try {
      await axios.patch(`${BASE_URL}/order/${tiketId}`, {
        nama: userData.nama,
        email: userData.email,
        umur: userData.umur
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      alert("Tiket berhasil dipesan!");
      fetchTiket();
      fetchTiket();
      fetchMyTickets();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal memesan tiket!");
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
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>

        {/* Form Data Diri */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Data Diri</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-2">Nama</label>
              <input
                type="text"
                name="nama"
                value={userData.nama}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Umur</label>
              <input
                type="number"
                name="umur"
                value={userData.umur}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Daftar Konser & Tiket */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Daftar Konser</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {konserList.map((konser) => {
              const tiket = tiketList.find(t => t.nama === konser.nama);
              return (
                <div key={konser.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg mb-2">{konser.nama}</h3>
                  <p className="text-gray-600 mb-1">Tanggal: {konser.tanggal}</p>
                  <p className="text-gray-600 mb-1">Lokasi: {konser.lokasi}</p>
                  <p className="text-gray-600 mb-1">Bintang Tamu: {konser.bintangtamu}</p>
                  {tiket && (
                    <>
                      <p className="text-gray-600 mb-1">Harga: Rp {tiket.harga}</p>
                      <p className="text-gray-600 mb-4">Sisa Tiket: {tiket.quota}</p>
                      <button
                        onClick={() => handlePesanTiket(tiket.id)}
                        disabled={tiket.quota < 1}
                        className={`w-full py-2 rounded ${
                          tiket.quota < 1 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {tiket.quota < 1 ? 'Tiket Habis' : 'Pesan Tiket'}
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tiket Saya */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Tiket Saya</h2>
          {myTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTickets.map((ticket, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-bold mb-2">{ticket}</h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Belum ada tiket yang dibeli.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;