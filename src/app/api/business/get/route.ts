import dbConnect from "@/lib/dbConnect";
import Business from "@/lib/models/Business";
import rateLimitMiddleware from "@/lib/rateLimit";
import { getTotalStampsForBusiness } from "@/util/getTotalStampsForBusiness";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = rateLimitMiddleware(async (req: NextRequest) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }
    // const clerkUserId = params.id;

    await dbConnect();

    const business = await Business.findOne({ clerkUserId: userId });
    console.log(userId, "userId from clerk");
    console.log(business.clerkUserId, "clerkUserID from mongo");
    if (business.clerkUserId !== userId) {
      return NextResponse.json({
        status: 401,
        message: "You do not have the access.",
      });
    }

    const totalStamps = await getTotalStampsForBusiness(business._id);

    return NextResponse.json(
      { data: business, totalStamps: totalStamps },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Internal Server Error" },
      { status: 500 },
    );
  }
});
