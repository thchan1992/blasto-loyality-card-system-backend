import dbConnect from "@/lib/dbConnect";
import Business from "@/lib/models/Business";
import rateLimitMiddleware from "@/lib/rateLimit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PUT = rateLimitMiddleware(async (req: NextRequest) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();
    const { name, logo, loyaltyProgram, clerkUserId } = data.business;

    if (!clerkUserId || !loyaltyProgram || !logo || !name) {
      return NextResponse.json(
        { message: "Missing field required" },
        { status: 404 },
      );
    }

    await dbConnect();
    const updatedBusiness = await Business.findOneAndUpdate(
      { clerkUserId },
      { loyaltyProgram, logo, name },
      { new: true },
    );

    if (!updatedBusiness) {
      return NextResponse.json(
        { message: "Business not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ data: updatedBusiness }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Internal Server Error" },
      { status: 500 },
    );
  }
});
