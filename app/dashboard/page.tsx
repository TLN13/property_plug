"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import { getUserRole } from "@/app/firebase/firestore";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const redirectToDashboard = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      const role = await getUserRole(user.uid);
      if (role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    };

    redirectToDashboard();
  }, [user, isLoading, router]);

  return <p>Loading...</p>;
}
