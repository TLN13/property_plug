"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/firebase";

export default function AdminHeader() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <header className="border-b border-[#eadfd6] bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4b2e2b]">Property Admin</h1>
          <p className="text-sm text-[#7a5c58]">Manage your listings</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-[#4b2e2b]">{user?.email}</p>
            <p className="text-xs text-[#a46b45]">Admin</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-[#a46b45] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
