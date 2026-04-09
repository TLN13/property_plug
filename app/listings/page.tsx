import Link from "next/link";
import { defaultProperties } from "@/app/data/properties";

export default function ListingsPage() {
  return (
    <main className="min-h-screen bg-stone-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              Listings
            </p>
            <h1 className="text-4xl font-semibold">Available properties</h1>
          </div>
          <Link
            href="/dashboard/user"
            className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-medium transition hover:border-white/60"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {defaultProperties.map((property) => (
            <article
              key={property.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur"
            >
              <div
                className="h-56 bg-cover bg-center"
                style={{ backgroundImage: `url(${property.image})` }}
              />
              <div className="space-y-3 p-6">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-semibold">{property.title}</h2>
                  <span className="rounded-full bg-cyan-300 px-3 py-1 text-sm font-semibold text-stone-950">
                    {property.price}
                  </span>
                </div>
                <p className="text-sm text-white/70">{property.location}</p>
                <p className="text-sm text-white/80">{property.description}</p>
                <p className="text-sm text-cyan-200">
                  {property.bedrooms} beds • {property.bathrooms} baths
                </p>
                <Link
                  href={`/listings/${property.id}`}
                  className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-950"
                >
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
