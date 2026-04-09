import { NextResponse } from "next/server";
import { getActiveListingCount } from "@/lib/listings";

export async function GET() {
  try {
    const count = await getActiveListingCount();

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Failed to load listing count:", error);

    return NextResponse.json(
      { error: "Could not load active listing count." },
      { status: 500 }
    );
  }
}
