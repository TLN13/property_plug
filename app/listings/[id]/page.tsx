import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScheduleTourCard from "@/app/components/ScheduleTourCard";
import SaveListingButton from "@/app/components/SaveListingButton";
import { formatListingPrice } from "@/lib/listing-format";
import { getListingById } from "@/lib/listings";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;
  const property = await getListingById(id);

  if (!property) {
    notFound();
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
          {formatListingPrice(property.price)}
        </p>

        <p className="mb-4 text-gray-600">{property.location}</p>

        <div className="mb-6 flex gap-6 text-gray-700">
          <span>{property.bedrooms} Bedrooms</span>
          <span>{property.bathrooms} Bathrooms</span>
        </div>

        <SaveListingButton listingId={property.id} />
        <ScheduleTourCard
          listingId={property.id}
          listingImage={property.image}
          listingLocation={property.location}
          listingPrice={property.price}
          listingTitle={property.title}
        />

        <p className="leading-7 text-gray-700">{property.description}</p>
      </div>
    </main>
  );
}
