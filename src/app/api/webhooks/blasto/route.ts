import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import Customer from "@/lib/models/Customer";
import Business from "@/lib/models/Business";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);
  if (evt.type === "user.created") {
    console.log("userId:", evt.data.id);

    console.log(evt.data.unsafe_metadata.accountType, "account type");

    try {
      console.log("connecting to the database");
      await dbConnect();
      console.log("finished connecting to the database");
      if (evt.data.unsafe_metadata.accountType) {
        const newCustomer = new Customer({
          clerkUserId: evt.data.id,
          email: evt.data.email_addresses[0].email_address,
          stamps: [],
        });
        await newCustomer.save();
      } else {
        console.log("creating business account");
        const newBusiness = new Business({
          clerkUserId: evt.data.id,
          name: "",
          email: evt.data.email_addresses[0].email_address,
          logo: "",
          loyaltyProgram: 5,
          rewardsRedeemed: 0,
          credit: 100,
          stampGiven: 0,
        });
        console.log("saving business account");
        await newBusiness.save();
        console.log("finished saving ");
        return new Response("", { status: 200 });
      }
    } catch (e) {
      console.log(e, "Error from database");
      return new Response(e, { status: 500 });
    }
  }
}
