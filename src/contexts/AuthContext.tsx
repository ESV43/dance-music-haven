
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { GoogleLogin } from "@/components/auth/GoogleLogin";
import { toast } from "sonner";

interface AuthUser {
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, name: string, picture: string) => void;
  logout: () => void;
  LoginButton: React.FC<{ onSuccess?: (email: string) => void }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for authentication on mount
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      
      if (isAuthenticated) {
        const email = localStorage.getItem("userEmail") || "";
        const name = localStorage.getItem("userName") || "";
        const picture = localStorage.getItem("userPicture") || "";
        
        setUser({ email, name, picture });
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (email: string, name: string, picture: string) => {
    setUser({ email, name, picture });
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name);
    localStorage.setItem("userPicture", picture);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPicture");
    toast.success("Successfully logged out");
  };

  const LoginButton: React.FC<{ onSuccess?: (email: string) => void }> = ({ onSuccess }) => {
    const handleLoginSuccess = (email: string) => {
      // If onSuccess is provided, call it
      if (onSuccess) {
        onSuccess(email);
      }
    };

    return <GoogleLogin onLoginSuccess={handleLoginSuccess} />;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        LoginButton,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
