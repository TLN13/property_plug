import Link from "next/link";
import { notFound } from "next/navigation";
import { defaultProperties } from "@/app/data/properties";

export default async function ListingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = defaultProperties.find((item) => item.id === id);

  if (!property) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f4efe8] px-6 py-10 text-stone-900">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/listings"
          className="mb-6 inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-medium transition hover:border-stone-900"
        >
          Back to listings
        </Link>

        <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
          <div
            className="h-80 bg-cover bg-center md:h-[28rem]"
            style={{ backgroundImage: `url(${property.image})` }}
          />

          <div className="grid gap-8 p-8 md:grid-cols-[2fr_1fr]">
            <section className="space-y-5">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-amber-700">
                  Featured property
                </p>
                <h1 className="mt-2 text-4xl font-semibold">{property.title}</h1>
              </div>

              <p className="text-lg text-stone-600">{property.location}</p>
              <p className="text-base leading-7 text-stone-700">
                {property.description}
              </p>
            </section>

            <aside className="rounded-3xl bg-stone-100 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-stone-500">
                Quick facts
              </p>
              <p className="mt-4 text-3xl font-semibold text-stone-900">
                {property.price}
              </p>
              <div className="mt-6 space-y-3 text-sm text-stone-700">
                <p>{property.bedrooms} bedrooms</p>
                <p>{property.bathrooms} bathrooms</p>
                <p>{property.location}</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
