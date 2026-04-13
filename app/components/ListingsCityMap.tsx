"use client";

import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { ListingCityGroup } from "@/lib/listing-map";
import { formatListingPrice } from "@/lib/listing-format";

type ListingsCityMapProps = {
  cityGroups: ListingCityGroup[];
};

function createCountIcon(count: number) {
  return L.divIcon({
    className: "listing-city-marker",
    html: `<div class="listing-city-marker__bubble"><span>${count}</span></div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -24],
  });
}

export default function ListingsCityMap({ cityGroups }: ListingsCityMapProps) {
  const markerData = useMemo(
    () =>
      cityGroups.map((group) => ({
        ...group,
        icon: createCountIcon(group.listings.length),
      })),
    [cityGroups]
  );

  return (
    <div className="h-[380px] overflow-hidden rounded-3xl border border-[#D6B79F] bg-[#FFF8F0]">
      <MapContainer
        center={[53.9333, -116.5765]}
        zoom={6}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerData.map((group) => (
          <Marker key={group.city} position={group.coordinates} icon={group.icon}>
            <Popup>
              <div className="min-w-56 space-y-3 text-[#2B1816]">
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-[#8C5A3C]">
                    {group.listings.length} listing{group.listings.length === 1 ? "" : "s"}
                  </p>
                  <h3 className="text-lg font-semibold">{group.city}</h3>
                </div>
                <div className="space-y-2">
                  {group.listings.map((listing) => (
                    <a
                      key={listing.id}
                      href={`/listings/${listing.id}`}
                      className="block rounded-xl border border-[#E5D1BE] bg-[#FFF8F0] px-3 py-2 transition hover:border-[#8C5A3C]"
                    >
                      <p className="font-medium">{listing.title}</p>
                      <p className="text-sm text-[#8C5A3C]">
                        {formatListingPrice(listing.price)}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
