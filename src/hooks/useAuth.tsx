import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UserRole = "guest" | "host" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo
const MOCK_USERS: (User & { password: string })[] = [
  { id: "1", name: "Abdifatah", email: "abdifatah@nairobistay.com", password: "host123", role: "host", phone: "+254740531856", createdAt: "2024-01-01" },
  { id: "2", name: "Guest User", email: "guest@example.com", password: "guest123", role: "guest", createdAt: "2024-01-01" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("nairobistay_user");
    if (stored) setUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!found) return { success: false, error: "Invalid email or password" };
    const { password: _, ...userWithoutPassword } = found;
    setUser(userWithoutPassword);
    localStorage.setItem("nairobistay_user", JSON.stringify(userWithoutPassword));
    return { success: true };
  };

  const signup = async (name: string, email: string, _password: string, role: UserRole) => {
    if (MOCK_USERS.find((u) => u.email === email)) return { success: false, error: "Email already in use" };
    const newUser: User = { id: Date.now().toString(), name, email, role, createdAt: new Date().toISOString() };
    setUser(newUser);
    localStorage.setItem("nairobistay_user", JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nairobistay_user");
  };

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
