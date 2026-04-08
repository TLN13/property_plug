import Image from "next/image";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const properties = [
  {
    id: "1",
    title: "Modern Condo in Calgary",
    price: "$425,000",
    location: "Downtown Calgary",
    bedrooms: 2,
    bathrooms: 2,
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
    description: "Beautiful modern condo located in the heart of Calgary.",
  },
  {
    id: "2",
    title: "Family House in Edmonton",
    price: "$589,000",
    location: "South Edmonton",
    bedrooms: 4,
    bathrooms: 3,
    image:
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80",
    description: "Spacious family home with a large backyard.",
  },
  {
    id: "3",
    title: "Luxury Apartment in Vancouver",
    price: "$799,000",
    location: "West End Vancouver",
    bedrooms: 3,
    bathrooms: 2,
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    description: "Luxury apartment with ocean views.",
  },
  {
    id: "4",
    title: "Cozy Townhouse in Banff",
    price: "$499,000",
    location: "Banff",
    bedrooms: 3,
    bathrooms: 2,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    description: "Cozy townhouse surrounded by mountains.",
  },
];

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;

  const property = properties.find((p) => p.id === id);

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

        <Image
          src={property.image}
          alt={property.title}
          width={1200}
          height={800}
          className="mb-6 h-80 w-full rounded-xl object-cover"
          sizes="(min-width: 1024px) 896px, 100vw"
        />

        <h1 className="mb-2 text-3xl font-bold text-[#4b2e2b]">
          {property.title}
        </h1>

        <p className="mb-2 text-xl font-semibold text-[#a46b45]">
          {property.price}
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
