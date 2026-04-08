import { NextResponse } from "next/server";
import {
  getSavedListingsForUser,
  isListingSavedByUser,
  removeSavedListingForUser,
  saveListingForUser,
} from "@/lib/saved-listings";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");
  const listingId = searchParams.get("listingId");

  if (!uid) {
    return NextResponse.json({ error: "Missing uid." }, { status: 400 });
  }

  try {
    if (listingId) {
      const saved = await isListingSavedByUser({ uid, listingId });
      return NextResponse.json({ saved });
    }

    const listings = await getSavedListingsForUser(uid);
    return NextResponse.json({ listings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    listingId?: string;
    uid?: string;
  };

  if (!body.uid || !body.email || !body.listingId) {
    return NextResponse.json(
      { error: "Missing uid, email, or listingId." },
      { status: 400 }
    );
  }

  try {
    await saveListingForUser({
      uid: body.uid,
      email: body.email,
      listingId: body.listingId,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as {
    listingId?: string;
    uid?: string;
  };

  if (!body.uid || !body.listingId) {
    return NextResponse.json(
      { error: "Missing uid or listingId." },
      { status: 400 }
    );
  }

  try {
    await removeSavedListingForUser({
      uid: body.uid,
      listingId: body.listingId,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
