import { NextResponse } from "next/server";

export async function POST() {
  const response = await fetch(
    "https://api.paychangu.com/payment",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYCHANGU_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 1000,
        currency: "MWK",
        callback_url: "http://localhost:3000/payment-success",
        return_url: "http://localhost:3000/payment-success",
      }),
    }
  );

  const data = await response.json();

  return NextResponse.json(data);
}