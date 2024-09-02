import rateLimitMiddleware from "@/lib/rateLimit";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Customer from "@/lib/models/Customer";
import dbConnect from "@/lib/dbConnect";
import Business from "@/lib/models/Business";
import { CustomerModel, BusinessModel } from "@/lib/models";

export const GET = rateLimitMiddleware(async (req: NextRequest) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();

    const customer = await CustomerModel.findOne({ clerkUserId: userId })
      .populate({
        path: "stamps.businessId", //  populate
        select: "name", // select the name field from business
      })
      .exec();

    return NextResponse.json({ data: customer }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: e.message || "Internal Server Error" },
      { status: 500 },
    );
  }
});
