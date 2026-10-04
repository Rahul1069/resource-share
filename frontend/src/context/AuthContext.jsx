import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken, getAccessToken, clearAccessToken } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login when application starts
  const checkAuth = async () => {
    try {
      // If there's no saved token and cookies might be blocked, skip the
      // network call to avoid a guaranteed 401 flash on every cold start.
      const token = getAccessToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await api.get("/users/profile");

      const userData =
        response.data?.data ||
        response.data?.user ||
        response.data;

      setUser(userData);
    } catch (error) {
      // Token was stale / expired – clear it
      clearAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    // Save the access token returned in the response body
    const accessToken = response.data?.accessToken;
    if (accessToken) {
      setAccessToken(accessToken);
    }

    const userData =
      response.data?.data ||
      response.data?.user ||
      response.data;

    setUser(userData);

    return response;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}