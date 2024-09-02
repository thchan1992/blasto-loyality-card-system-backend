import rateLimitMiddleware from "@/lib/rateLimit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import Customer from "@/lib/models/Customer";
import Business from "@/lib/models/Business";
import dbConnect from "@/lib/dbConnect";

export async function getTotalStampsForBusiness(
  businessId: string | mongoose.Types.ObjectId,
): Promise<number> {
  const businessObjectId = new Types.ObjectId(businessId);

  const result = await Customer.aggregate([
    { $unwind: "$stamps" }, // deconstruct the stamps array
    { $match: { "stamps.businessId": businessObjectId } }, // filter by businessId
    { $group: { _id: null, totalStamps: { $sum: "$stamps.count" } } },
  ]);

  return result.length > 0 ? result[0].totalStamps : 0;
}

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
