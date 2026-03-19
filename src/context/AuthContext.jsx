import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    // Persist login across full page reloads using localStorage
    try {
      const saved = localStorage.getItem("fif_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem("fif_user", JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("fif_user");
    // Also clear all app data so a different user gets a clean slate
    ["fif_bookings", "fif_payments"].forEach(k => localStorage.removeItem(k));
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
