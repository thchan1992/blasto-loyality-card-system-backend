import dbConnect from "@/lib/dbConnect";
import Business from "@/lib/models/Business";
import Customer from "@/lib/models/Customer";
import rateLimitMiddleware from "@/lib/rateLimit";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = rateLimitMiddleware(async (req: NextRequest) => {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }

  await dbConnect();
  const session = await mongoose.startSession();
  try {
    const data = await req.json();
    const { customerId } = data;

    if (!customerId) {
      return NextResponse.json({
        status: 404,
        message: "Missing required fields",
      });
    }
    session.startTransaction();
    //check business id to see if they are authorised to do the transaction.
    const business = await Business.findOne({
      clerkUserId:
        // businessId
        userId,
    });

    if (!business) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({
        status: 404,
        message: "Business not found",
      });
    }

    business.rewardsRedeemed++;
    await business.save({ session });
    //redeem stamp to customer:
    const customer = await Customer.findOne({ clerkUserId: customerId });

    if (!customer) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({
        status: 404,
        message: "Reward not found",
      });
    }

    const existingStamp = customer.stamps.find(
      (stamp) => stamp.businessId.toString() === business._id.toString(),
    );

    if (!existingStamp || existingStamp.count < business.loyaltyProgram) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({
        status: 404,
        message: "No reward found",
      });
    }

    existingStamp.count -= business.loyaltyProgram;

    await customer.save({ session });
    await session.commitTransaction();

    return NextResponse.json(
      { data: "Reward has been given." },
      { status: 200 },
    );
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json(
      { error: e.message || "Internal Server Error" },
      { status: 500 },
    );
  }
});
