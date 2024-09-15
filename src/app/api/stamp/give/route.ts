import dbConnect from "@/lib/dbConnect";
import Business from "@/lib/models/Business";
import Customer, { IStamp } from "@/lib/models/Customer";
import rateLimitMiddleware from "@/lib/rateLimit";
import { giveStampSchema } from "@/util/apiTypeSchema";
import { auth } from "@clerk/nextjs/server";
import mongoose, { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = rateLimitMiddleware(async (req: NextRequest) => {
  const { userId } = auth();
  if (!userId) {
    console.log(userId);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const session = await mongoose.startSession();

  try {
    const data = await req.json();
    // const { customerId, stampNum } = data;

    const validationResult = giveStampSchema.safeParse(data);

    if (!validationResult.success) {
      const validationErrors = validationResult.error.errors;
      console.log(validationErrors, "validationErrors");
      return NextResponse.json(
        { message: "Invalid data from Z", errors: validationErrors },
        { status: 400 },
      );
    }
    const { customerId, stampNum } = validationResult.data;

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
        { message: "Business not found. Signing user out." },
        { status: 401 },
      );
    }

    //take one credit from the business
    if (business.credit === 0) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: "Fund not enough" }, { status: 404 });
    } else {
      business.credit--;
      business.stampGiven++;
      await business.save({ session });
    }

    //give one stamp to customer:
    //step one: check if the customer is in the database
    console.log(customerId, "customer ID");
    const customer = await Customer.findOne({ clerkUserId: customerId });

    if (!customer) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      );
    }

    //step two: if the business dose exist in the stamps array

    const existingStamp = customer.stamps.find(
      (stamp) => stamp.businessId.toString() === business._id.toString(),
    );

    //step three: if it dosent exists, add one object based on IStamp
    if (!existingStamp) {
      const newStamp: IStamp = {
        businessId: new Types.ObjectId(business._id),
        count: 1,
      };
      customer.stamps.push(newStamp);
    } else {
      //step four: if it dose exists, just increment the count by 1.

      existingStamp.count += 1;
    }

    await customer.save({ session });
    await session.commitTransaction();
    console.log("Transaction committed successfully");
    session.endSession();

    return NextResponse.json(
      { data: "A new stamp has been given.", newCredit: business.credit },
      { status: 200 },
    );
  } catch (e) {
    console.error("Error in main execution:", e);
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    return NextResponse.json(
      { error: e.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}, 100);
