"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPropertyById, type Property } from "@/app/firebase/properties";
import { formatPrice } from "@/app/lib/propertyFormat";

export default function PropertyDetails({ id }: { id: string }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (loadError) {
        console.error("Failed to load property", loadError);
        setError("Unable to load this property right now.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f8f5f0] p-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center text-[#7a5c58] shadow-md">
          Loading property...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f8f5f0] p-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-[#4b2e2b]">{error}</h1>
          <Link
            href="/listings"
            className="inline-block rounded-lg bg-[#a46b45] px-4 py-2 text-white transition hover:opacity-90"
          >
            Back to Listings
          </Link>
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="min-h-screen bg-[#f8f5f0] p-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-[#4b2e2b]">
            Property not found
          </h1>
          <Link
            href="/listings"
            className="inline-block rounded-lg bg-[#a46b45] px-4 py-2 text-white transition hover:opacity-90"
          >
            Back to Listings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-md">
        <Link
          href="/listings"
          className="mb-6 inline-block rounded-lg bg-[#a46b45] px-4 py-2 text-white transition hover:opacity-90"
        >
          Back to Listings
        </Link>

        <img
          src={property.image}
          alt={property.title}
          className="mb-6 h-80 w-full rounded-xl object-cover"
        />

        <h1 className="mb-2 text-3xl font-bold text-[#4b2e2b]">
          {property.title}
        </h1>

        <p className="mb-2 text-xl font-semibold text-[#a46b45]">
          {formatPrice(property.price)}
        </p>

        <p className="mb-4 text-gray-600">{property.location}</p>

        <div className="mb-6 flex gap-6 text-gray-700">
          <span>{property.bedrooms} Bedrooms</span>
          <span>{property.bathrooms} Bathrooms</span>
        </div>

        <p className="leading-7 text-gray-700">{property.description}</p>
      </div>
    </main>
  );
}
