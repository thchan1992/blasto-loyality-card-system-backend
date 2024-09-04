import { NextResponse, NextRequest } from "next/server";

import { client } from "@/util/postmark";
import rateLimitMiddleware from "@/lib/rateLimit";

export const POST = rateLimitMiddleware(async (req: NextRequest) => {
  try {
    const res = await req.json();
    const { message, name, email } = res;
    await client.sendEmail({
      From: process.env.SUPPORT_EMAIL,
      To: process.env.SUPPORT_EMAIL,
      Subject: email + " / " + name,
      TextBody: message,
    });
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}, 1);
