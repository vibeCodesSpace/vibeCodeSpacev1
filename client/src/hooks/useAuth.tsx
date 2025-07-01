import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { supabase } from "@/lib/supabaseClient";

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("vibecode_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      setUser(response.user);
      localStorage.setItem("vibecode_user", JSON.stringify(response.user));
      setLocation("/dashboard");
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      const response = await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      setUser(response.user);
      localStorage.setItem("vibecode_user", JSON.stringify(response.user));
      setLocation("/dashboard");
    } catch (error) {
      throw new Error("Signup failed");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      throw new Error("Google Sign-In failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vibecode_user");
    setLocation("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, signInWithGoogle, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
