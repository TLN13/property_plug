import Link from "next/link";

const properties = [
  {
    id: "1",
    title: "Modern Condo in Calgary",
    price: "$425,000",
    location: "Downtown Calgary",
    bedrooms: 2,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    title: "Family House in Edmonton",
    price: "$589,000",
    location: "South Edmonton",
    bedrooms: 4,
    bathrooms: 3,
    image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    title: "Luxury Apartment in Vancouver",
    price: "$799,000",
    location: "West End Vancouver",
    bedrooms: 3,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "4",
    title: "Cozy Townhouse in Banff",
    price: "$499,000",
    location: "Banff",
    bedrooms: 3,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function ListingsPage() {
  return (
    <main className="min-h-screen bg-[#f8f5f0] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-4xl font-bold text-[#4b2e2b]">Property Listings</h1>
        <p className="mb-8 text-[#7a5c58]">
          Browse available homes and properties.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg"
            >
              <img
                src={property.image}
                alt={property.title}
                className="h-52 w-full object-cover"
              />

              <div className="p-5">
                <h2 className="mb-2 text-xl font-semibold text-[#4b2e2b]">
                  {property.title}
                </h2>

                <p className="mb-1 text-lg font-bold text-[#a46b45]">
                  {property.price}
                </p>

                <p className="mb-4 text-sm text-gray-600">{property.location}</p>

                <div className="mb-4 flex gap-4 text-sm text-gray-700">
                  <span>{property.bedrooms} Beds</span>
                  <span>{property.bathrooms} Baths</span>
                </div>

                <Link
                  href={`/listings/${property.id}`}
                  className="inline-block rounded-lg bg-[#a46b45] px-4 py-2 text-white transition hover:opacity-90"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}