import Link from "next/link";
import { type Property } from "@/app/firebase/properties";
import { formatPrice } from "@/app/lib/propertyFormat";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg">
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
          {formatPrice(property.price)}
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
  );
}
