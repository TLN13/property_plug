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
    title: "Luxury Apartment in Edmonton",
    price: "$799,000",
    location: "Oliver Edmonton",
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
  {
    id: "5",
    title: "Lakeview Bungalow in Sylvan Lake",
    price: "$675,000",
    location: "Sylvan Lake",
    bedrooms: 4,
    bathrooms: 3,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "6",
    title: "Downtown Loft in Calgary",
    price: "$720,000",
    location: "Beltline Calgary",
    bedrooms: 2,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "7",
    title: "Suburban Home in Airdrie",
    price: "$455,000",
    location: "Airdrie",
    bedrooms: 4,
    bathrooms: 3,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "8",
    title: "Mountain Retreat in Canmore",
    price: "$889,000",
    location: "Canmore",
    bedrooms: 3,
    bathrooms: 3,
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "9",
    title: "Riverside Condo in Medicine Hat",
    price: "$349,000",
    location: "Medicine Hat",
    bedrooms: 2,
    bathrooms: 1,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "10",
    title: "Executive Home in Sherwood Park",
    price: "$835,000",
    location: "Sherwood Park",
    bedrooms: 5,
    bathrooms: 4,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "11",
    title: "Central Apartment in Lethbridge",
    price: "$529,000",
    location: "Downtown Lethbridge",
    bedrooms: 2,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "12",
    title: "Starter Home in Red Deer",
    price: "$378,000",
    location: "Red Deer",
    bedrooms: 3,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "13",
    title: "Modern Duplex in Fort McMurray",
    price: "$412,000",
    location: "Fort McMurray",
    bedrooms: 3,
    bathrooms: 3,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "14",
    title: "Luxury Penthouse in Calgary",
    price: "$1,150,000",
    location: "Eau Claire Calgary",
    bedrooms: 3,
    bathrooms: 3,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "15",
    title: "Country Acreage Near Lethbridge",
    price: "$698,000",
    location: "Lethbridge County",
    bedrooms: 5,
    bathrooms: 4,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "16",
    title: "Bright Condo in Grande Prairie",
    price: "$610,000",
    location: "Grande Prairie",
    bedrooms: 2,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function ListingsPage() {
  return (
    <main className="min-h-screen bg-[#f8f5f0] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard/user"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#8C5A3C] transition hover:text-[#4B2E2B]"
        >
          <span aria-hidden="true">←</span>
          <span>Back to Dashboard</span>
        </Link>
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
