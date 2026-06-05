import crypto from "node:crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("Signature");
  const webhookSecret = process.env.PAYCHANGU_WEBHOOK_SECRET;

  if (webhookSecret) {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const event = JSON.parse(payload);

  console.log("PayChangu webhook received:", event);

  return NextResponse.json({ received: true });
}
