"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import { getUserRole } from "@/app/firebase/firestore";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const redirect = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      // ✅ Fetch role from Firestore
      const role = await getUserRole(user.uid);

      // ✅ Redirect based on role
      if (role === "admin") router.push("/dashboard/admin");
      else router.push("/dashboard/user");
    };

    redirect();
  }, [user, router]);

  return <p>Loading…</p>;
}
