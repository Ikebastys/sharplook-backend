import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getMe } from "@/api/client";

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  saveToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoggedIn: false,
  isAdmin: false,
  saveToken: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("access_token"));
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      getMe()
        .then((user) => setIsAdmin(!!user.is_admin))
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  const saveToken = (t: string) => {
    localStorage.setItem("access_token", t);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn: !!token, isAdmin, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
