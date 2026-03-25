"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserRole } from "@/app/firebase/firestore";

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole: "admin" | "user";
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      const role = await getUserRole(user.uid);

      if (role === requiredRole) {
        setAllowed(true);
      } else {
        router.push("/login");
      }
    };

    check();
  }, [user]);

  if (!allowed) return <p>Loading...</p>;

  return <>{children}</>;
}