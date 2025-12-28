import { createContext, useContext, useEffect, useState } from "react";
import axiosInstace from "../api/axios/axiosInstance";
import { saveCachedUser } from "../utils/cache";

type AuthContextType = {
  user: any;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  checkAuth: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);

    try {
      const res = await axiosInstace.get("/v1/auth/me");
      setUser(res.data.user || null);
      saveCachedUser(res.data.user);
    } catch (error) {
      setUser(null);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={
        {
          user,
          loading,
          checkAuth,
        } as any
      }
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
