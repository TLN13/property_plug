"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/app/firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getUserRole, createUserIfNotExists } from "@/app/firebase/firestore";

interface AuthContextType {
  user: User | null;
  role: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      try {
        if (firebaseUser) {
          await createUserIfNotExists(firebaseUser);
          const userRole = await getUserRole(firebaseUser.uid);
          setRole(userRole ?? "user");
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error("Failed to load auth state", error);
        setRole(firebaseUser ? "user" : null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
