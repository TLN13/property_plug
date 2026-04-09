"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import { getUserRole } from "@/app/firebase/firestore";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState("Loading dashboard...");

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const routeUser = async () => {
      if (!user) {
        router.replace("/login");
        return;
      }

      const role = await getUserRole(user.uid);

      if (role === "admin") {
        router.replace("/dashboard/admin");
        return;
      }

      if (role === "user") {
        router.replace("/dashboard/user");
        return;
      }

      setStatus("We couldn't determine your account role. Please sign in again.");
      router.replace("/login");
    };

    void routeUser();
  }, [isLoading, router, user]);

  return <p>{status}</p>;
}
