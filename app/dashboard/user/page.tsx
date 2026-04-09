import Link from "next/link";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { defaultProperties } from "@/app/data/properties";

export default function UserPage() {
  return (
    <ProtectedRoute requiredRole="user">
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
              User Dashboard
            </p>
            <h1 className="text-4xl font-semibold text-stone-900">
              Browse current property listings
            </h1>
            <p className="max-w-2xl text-stone-600">
              This dashboard now renders the available property cards instead of
              only showing a placeholder heading.
            </p>
            <div className="flex gap-3">
              <Link
                href="/listings"
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Open all listings
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {defaultProperties.map((property) => (
              <article
                key={property.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm"
              >
                <div
                  className="h-52 bg-cover bg-center"
                  style={{ backgroundImage: `url(${property.image})` }}
                />
                <div className="space-y-3 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-semibold text-stone-900">
                      {property.title}
                    </h2>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
                      {property.price}
                    </span>
                  </div>
                  <p className="text-sm text-stone-500">{property.location}</p>
                  <p className="text-sm text-stone-600">{property.description}</p>
                  <p className="text-sm font-medium text-stone-700">
                    {property.bedrooms} beds • {property.bathrooms} baths
                  </p>
                  <Link
                    href={`/listings/${property.id}`}
                    className="inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-900 transition hover:border-stone-900"
                  >
                    View listing
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
