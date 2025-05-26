import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/utils.js";

const RegisterPage = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [umur, setUmur] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();

    if (pass !== confirmPassword) {
      alert("Password and confirm password do not match!");
      return;
    }
    console.log("Register with", { nama, email, umur, pass });
    
    try {
      let response;
      const userData = {
        nama,
        email,
        umur,
        pass
      };

      if (email === "admin@gmail.com") {
        // Register sebagai admin
        response = await axios.post(`${BASE_URL}/register`, userData, {
          headers: { "Content-Type": "application/json" }
        });
      } else {
        // Register sebagai pengunjung
        response = await axios.post(`${BASE_URL}/pengunjung`, userData, {
          headers: { "Content-Type": "application/json" }
        });
      }

      if (response.data.status === "Success") {
        alert(email === "admin@gmail.com" ? "Admin berhasil didaftarkan!" : "Akun berhasil didaftarkan!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Register Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Registrasi gagal!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="nama" className="block text-sm font-medium text-gray-600">
              Nama
            </label>
            <input
              type="text"
              id="nama"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="umur" className="block text-sm font-medium text-gray-600">
              Umur
            </label>
            <input
              type="number"
              id="umur"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={umur}
              onChange={(e) => setUmur(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Sudah Punya Akun?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login Disini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
