import { NextResponse } from "next/server";
import {
  createListing,
  deleteListing,
  getListingById,
  getListings,
  updateListing,
  type ListingInput,
} from "@/lib/listings";

type ListingPayload = Partial<ListingInput> & {
  id?: string;
};

function toNumber(value: unknown, fallback = 0) {
  const parsedValue =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function validateListingPayload(body: ListingPayload) {
  const normalizedPayload: ListingInput = {
    title: String(body.title ?? "").trim(),
    price: toNumber(body.price),
    location: String(body.location ?? "").trim(),
    bedrooms: toNumber(body.bedrooms),
    bathrooms: toNumber(body.bathrooms),
    image: String(body.image ?? "").trim(),
    description: String(body.description ?? "").trim(),
  };

  if (!normalizedPayload.title) {
    return { error: "Title is required." };
  }

  if (normalizedPayload.price < 0) {
    return { error: "Price must be 0 or greater." };
  }

  if (!normalizedPayload.location) {
    return { error: "Location is required." };
  }

  if (normalizedPayload.bedrooms < 0) {
    return { error: "Bedrooms must be 0 or greater." };
  }

  if (normalizedPayload.bathrooms < 0) {
    return { error: "Bathrooms must be 0 or greater." };
  }

  if (!normalizedPayload.image) {
    return { error: "Image URL is required." };
  }

  if (!normalizedPayload.description) {
    return { error: "Description is required." };
  }

  return { data: normalizedPayload };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const listing = await getListingById(id);

      if (!listing) {
        return NextResponse.json({ error: "Listing not found." }, { status: 404 });
      }

      return NextResponse.json({ listing });
    }

    const listings = await getListings();
    return NextResponse.json({ listings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as ListingPayload;
  const result = validateListingPayload(body);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const listing = await createListing(result.data);
    return NextResponse.json({ listing });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as ListingPayload;

  if (!body.id) {
    return NextResponse.json({ error: "Missing listing id." }, { status: 400 });
  }

  const result = validateListingPayload(body);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const listing = await updateListing(body.id, result.data);
    return NextResponse.json({ listing });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as { id?: string };

  if (!body.id) {
    return NextResponse.json({ error: "Missing listing id." }, { status: 400 });
  }

  try {
    await deleteListing(body.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
