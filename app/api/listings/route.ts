// app/api/listings/route.ts
// Returns the market-report data for one Laurelwood neighborhood. All data
// loading, bucketing, and quarterly aggregation now live in the shared module
// lib/market/getMarketData.ts (the single source of truth), which the report
// pages also use, so the API and the SSR pages can never drift. This route is a
// thin validate -> getMarketData -> JSON wrapper.

import { NextResponse } from "next/server";
import { ALLOWED_NEIGHBORHOODS, getMarketData } from "@/lib/market/getMarketData";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const neighborhood = searchParams.get("neighborhood");

  if (!neighborhood || !ALLOWED_NEIGHBORHOODS.includes(neighborhood)) {
    return NextResponse.json(
      {
        error: `Invalid or missing "neighborhood". Expected one of: ${ALLOWED_NEIGHBORHOODS.join(
          ", "
        )}.`,
      },
      { status: 400 }
    );
  }

  try {
    const data = await getMarketData(neighborhood);
    return NextResponse.json(data);
  } catch (err) {
    console.error("listings read error:", err);
    return NextResponse.json(
      { error: "Listings are temporarily unavailable." },
      { status: 500 }
    );
  }
}
