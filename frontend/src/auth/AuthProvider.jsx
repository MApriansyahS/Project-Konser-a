import { createContext, useState } from "react";
import Cookies from "js-cookie";
import axios from "../api/axiosInstance.js";
import PropTypes from 'prop-types';
import { BASE_URL } from "../utils/utils.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  const login = async (email, pass) => {
    try {
      let endpoint = email === "admin@gmail.com" ? "/login" : "/pengunjung/login";
      const res = await axios.post(`${BASE_URL}${endpoint}`, { email, pass });
      
      if (res.data.accessToken) {
        setAccessToken(res.data.accessToken);
        
        // Set userEmail di localStorage untuk cek role
        localStorage.setItem("userEmail", email);

        Cookies.set("refreshToken", res.data.refreshToken, {
          secure: true,
          sameSite: "Strict",
          expires: 5,
        });

        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem("userEmail");
    Cookies.remove("refreshToken");
  };

  const refreshAccessToken = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/token`);
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
      return "kosong";
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, login, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
