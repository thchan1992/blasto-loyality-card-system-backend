import Stripe from "stripe";
import { stripe } from "@/lib/stripe/stripe";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Business from "@/lib/models/Business";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (e) {
    console.log(e, " invalid singature message");
    return new NextResponse("invalid signature", { status: 400 });
  }
  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    console.log("payment was successful");
    console.log(session.metadata.clerkUserId);
    await dbConnect();
    try {
      const business = await Business.findOne({
        clerkUserId: session.metadata.clerkUserId,
      }).exec();

      if (!business) {
        return NextResponse.json(
          { message: "Business not found" },
          { status: 404 },
        );
      }
      business.credit = business.credit + 500;

      await business.save();

      return NextResponse.json(
        { message: "Credit has been added." },
        { status: 200 },
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 },
      );
    }
  }

  return new NextResponse("ok", { status: 200 });
}
