import { stripe } from "@/lib/stripe/stripe";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
export async function POST(req: Request) {
  const { userId } = auth();
  const user = await clerkClient.users.getUser(userId);
  if (!userId) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: "http://localhost:3000",
      cancel_url: "https://www.google.com",
      payment_method_types: ["card"],
      customer_email: user.emailAddresses[0].emailAddress,

      line_items: [
        {
          price: "price_1Pux4OF7vFnfIb8b1PlCiXbI",
          quantity: 1,
        },
      ],
      metadata: { clerkUserId: userId },
      allow_promotion_codes: true,
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (e) {
    console.log(e, " payment error");
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
