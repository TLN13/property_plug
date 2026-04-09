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

      await getUserRole(user.uid);
      router.push("/dashboard/user");
    };

    void redirect();
  }, [user, router]);

  return <p>Loading...</p>;
}
