import dbConnect from "@/lib/dbConnect";
import Business from "@/lib/models/Business";
import rateLimitMiddleware from "@/lib/rateLimit";
import { businessUpdateSchema } from "@/util/apiTypeSchema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PUT = rateLimitMiddleware(async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const request = await req.json();
    const data = request.business;
    // console.log(data);

    const validationResult = businessUpdateSchema.safeParse(data);

    if (!validationResult.success) {
      const validationErrors = validationResult.error.errors;
      return NextResponse.json(
        { message: "Invalid data from Z", errors: validationErrors },
        { status: 400 },
      );
    }

    const { name, logo, loyaltyProgram, clerkUserId } = validationResult.data;

    await dbConnect();
    const updatedBusiness = await Business.findOneAndUpdate(
      { clerkUserId },
      { loyaltyProgram, logo, name },
      { new: true },
    );

    if (!updatedBusiness) {
      return NextResponse.json(
        { message: "Business not found. Signing user out." },
        { status: 401 },
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
