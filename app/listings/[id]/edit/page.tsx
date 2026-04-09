"use client";

import { use } from "react";
import AdminListingForm from "@/app/components/AdminListingForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditListingPage({ params }: Props) {
  const { id } = use(params);

  return <AdminListingForm listingId={id} />;
}
