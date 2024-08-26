import dbConnect from "@/lib/dbConnect";

import rateLimitMiddleware from "@/lib/rateLimit";
import { NextRequest, NextResponse } from "next/server";

export const GET = rateLimitMiddleware(async (req: NextRequest) => {
  await dbConnect();

  try {
    return NextResponse.json({ data: "HW" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}, 10);
