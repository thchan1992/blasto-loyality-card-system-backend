import dbConnect from "@/lib/dbConnect";
import Business from "@/lib/models/Business";
import Customer from "@/lib/models/Customer";
import rateLimitMiddleware from "@/lib/rateLimit";
import { redeemRewardSchema } from "@/util/apiTypeSchema";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = rateLimitMiddleware(async (req: NextRequest) => {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const session = await mongoose.startSession();
  try {
    const data = await req.json();

    const validationResult = redeemRewardSchema.safeParse(data);

    if (!validationResult.success) {
      const validationErrors = validationResult.error.errors;
      return NextResponse.json(
        { message: "Invalid data from Z", errors: validationErrors },
        { status: 400 },
      );
    }
    const { customerId } = validationResult.data;

    if (!customerId) {
      return NextResponse.json(
        { message: "Missing field required" },
        { status: 404 },
      );
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
      return NextResponse.json(
        { message: "Business not found" },
        { status: 404 },
      );
    }

    business.rewardsRedeemed++;
    await business.save({ session });
    //redeem stamp to customer:
    const customer = await Customer.findOne({ clerkUserId: customerId });

    if (!customer) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: "Fund not enough" }, { status: 404 });
    }

    const existingStamp = customer.stamps.find(
      (stamp) => stamp.businessId.toString() === business._id.toString(),
    );

    if (!existingStamp || existingStamp.count < business.loyaltyProgram) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      );
    }
    console.log("xx");
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
