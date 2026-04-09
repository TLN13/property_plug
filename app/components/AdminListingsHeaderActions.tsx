"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { getUserRole } from "@/app/firebase/firestore";

export default function AdminListingsHeaderActions() {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isLoading || !user) {
      return;
    }

    let ignore = false;

    const loadRole = async () => {
      const role = await getUserRole(user.uid);

      if (!ignore) {
        setIsAdmin(role === "admin");
      }
    };

    void loadRole();

    return () => {
      ignore = true;
    };
  }, [isLoading, user]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Link
        href="/dashboard/user"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFF8F0] px-4 py-2 text-sm font-medium text-[#8C5A3C] transition hover:bg-white hover:text-[#4B2E2B] focus:outline-none focus:ring-2 focus:ring-[#FFF8F0]"
      >
        <span aria-hidden="true">&larr;</span>
        <span>Back to Dashboard</span>
      </Link>

      {user && isAdmin ? (
        <Link
          href="/listings/new"
          className="inline-flex items-center justify-center rounded-full border border-[#FFF8F0] px-4 py-2 text-sm font-medium text-[#FFF8F0] transition hover:bg-[#FFF8F0] hover:text-[#8C5A3C] focus:outline-none focus:ring-2 focus:ring-[#FFF8F0]"
        >
          Add Listing
        </Link>
      ) : null}
    </div>
  );
}
