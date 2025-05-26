import { useContext } from "react";
import AuthContext from "./AuthContext";

const useAuth = () => {
  const { accessToken, login, logout, refreshAccessToken } = useContext(AuthContext);

  return {
    accessToken,
    login,
    logout,
    refreshAccessToken,
    isAuthenticated: !!accessToken,
  };
};

export default useAuth;
