import rateLimitMiddleware from "@/lib/rateLimit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Business from "@/lib/models/Business";
import dbConnect from "@/lib/dbConnect";
import { getTotalStampsForBusiness } from "@/util/getTotalStampsForBusiness";

export const GET = rateLimitMiddleware(async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }
    await dbConnect();
    const business = await Business.findOne({
      clerkUserId: userId,
    });
    const totalStamps = await getTotalStampsForBusiness(business._id);
    return NextResponse.json({ data: totalStamps }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Internal Server Error" },
      { status: 500 },
    );
  }
});
