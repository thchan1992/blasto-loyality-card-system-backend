import mongoose, { Schema, models, model, Types, Document } from "mongoose";

export interface ICustomer extends Document {
  clerkUserId: string;
  email: string;
}

const customerSchema: Schema = new Schema({
  clerkUserId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  stamps: [
    {
      businessId: {
        type: Schema.Types.ObjectId,
        ref: "Business",
        required: true,
      },
      count: { type: Number, default: 0 },
    },
  ],
});

const Customer = mongoose.model<ICustomer>("Customer", customerSchema);
export default Customer;
