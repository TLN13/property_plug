import { NextResponse } from "next/server";
import { getListings } from "@/lib/listings";

export async function GET() {
  try {
    const listings = await getListings();
    return NextResponse.json({ listings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
