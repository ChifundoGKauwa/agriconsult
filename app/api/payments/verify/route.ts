import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const txRef = searchParams.get("tx_ref");

  if (!txRef) {
    return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
  }

  if (!process.env.PAYCHANGU_SECRET_KEY) {
    return NextResponse.json(
      { error: "PAYCHANGU_SECRET_KEY is not configured" },
      { status: 500 }
    );
  }

  const response = await fetch(
    `https://api.paychangu.com/verify-payment/${encodeURIComponent(txRef)}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
