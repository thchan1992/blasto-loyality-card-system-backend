import { NextResponse, NextRequest } from "next/server";

import { client } from "@/util/postmark";
import rateLimitMiddleware from "@/lib/rateLimit";
import { supportEmailSchema } from "@/util/apiTypeSchema";

export const POST = rateLimitMiddleware(async (req: NextRequest) => {
  try {
    const data = await req.json();
    // const { message, name, email } = data;
    const validationResult = supportEmailSchema.safeParse(data);

    if (!validationResult.success) {
      const validationErrors = validationResult.error.errors;
      return NextResponse.json(
        { message: "Invalid data from Z", errors: validationErrors },
        { status: 400 },
      );
    }
    const { message, name, email } = validationResult.data;

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
}, 10);
