import dbConnect from "@/lib/dbConnect";
import Business from "@/lib/models/Business";
import rateLimitMiddleware from "@/lib/rateLimit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PUT = rateLimitMiddleware(async (req: NextRequest) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }
    const data = await req.json();
    const { name, logo, loyaltyProgram, clerkUserId } = data;

    if (!clerkUserId || !loyaltyProgram || !logo || !name) {
      return NextResponse.json({
        status: 404,
        message: "Missing required fields",
      });
    }

    await dbConnect();
    const updatedBusiness = await Business.findOneAndUpdate(
      { clerkUserId },
      { loyaltyProgram, logo, name },
      { new: true },
    );

    if (!updatedBusiness) {
      return NextResponse.json({
        status: 404,
        message: "Business not found",
      });
    }
    return NextResponse.json({ data: updatedBusiness }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Internal Server Error" },
      { status: 500 },
    );
  }
});
