import dbConnect from "@/lib/dbConnect";
import Business from "@/lib/models/Business";
import Customer, { ICustomer, IStamp } from "@/lib/models/Customer";
import rateLimitMiddleware from "@/lib/rateLimit";
import { auth } from "@clerk/nextjs/server";
import mongoose, { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// export const POST = rateLimitMiddleware(async (req: NextRequest) => {
export const POST = async (req: NextRequest) => {
  console.log("requested request");
  const session = await mongoose.startSession();
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }

    const data = await req.json();
    const {
      customerId,
      // businessId,
      stampNum,
    } = data;

    if (
      !customerId ||
      // !businessId ||
      !stampNum
    ) {
      return NextResponse.json({
        status: 404,
        message: "Missing required fields",
      });
    }

    // if (businessId !== userId) {
    //   return NextResponse.json({
    //     status: 401,
    //     message: "No Authorized",
    //   });
    // }

    console.log("Starting transaction");
    await dbConnect();
    session.startTransaction();

    //check business id to see if they are authorised to do the transaction.
    console.log("Looking up business:", userId);
    const business = await Business.findOne({
      clerkUserId:
        // businessId
        userId,
    });
    console.log("Business lookup result:", business);

    if (!business) {
      console.log("Business not found, aborting transaction");
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({
        status: 404,
        message: "Business not found",
      });
    }

    //take one credit from the business
    if (business.credit === 0) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({
        status: 400,
        message: "Fund not enough",
      });
    } else {
      console.log("Business found, checking credit:", business.credit);
      business.credit--;
      await business.save({ session });
    }

    //give one stamp to customer:
    //step one: check if the customer is in the database
    const customer = await Customer.findOne({ clerkUserId: customerId });
    console.log("Customer lookup result:", customer);
    if (!customer) {
      console.log("Customer not found, aborting transaction");
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({
        status: 404,
        message: "Customer not found",
      });
    }

    console.log(customer, "customer found");

    //step two: if the business dose exist in the stamps array
    console.log("Customer found, updating stamps");
    const existingStamp = customer.stamps.find(
      (stamp) => stamp.businessId.toString() === business._id.toString(),
    );

    //step three: if it dosent exists, add one object based on IStamp
    if (!existingStamp) {
      console.log("Stamp not found, creating new one");
      const newStamp: IStamp = {
        businessId: new Types.ObjectId(business._id),
        count: 1,
      };
      customer.stamps.push(newStamp);
    } else {
      //step four: if it dose exists, just increment the count by 1.
      console.log("Stamp found, incrementing count");
      existingStamp.count += 1;
    }

    await customer.save({ session });
    console.log("Customer stamps updated:", customer.stamps);
    await session.commitTransaction();
    console.log("Transaction committed successfully");
    session.endSession();

    return NextResponse.json(
      { data: "A new stamp has been given." },
      { status: 200 },
    );
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    console.log(e.message, "e.message");
    return NextResponse.json(
      { error: e.message || "Internal Server Error" },
      { status: 500 },
    );
  }
  // });
};
