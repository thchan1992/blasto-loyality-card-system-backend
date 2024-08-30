import mongoose, { Schema, models, Types, Document, Model } from "mongoose";

export interface IBusiness extends Document {
  _id: Types.ObjectId;
  clerkUserId: string;
  name: string;
  email: string;
  logo: string;
  loyaltyProgram: number;
  rewardsRedeemed: number;
  credit: number;
}

const businessSchema = new Schema<IBusiness>({
  clerkUserId: { type: String, required: true, unique: true },
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  logo: { type: String, required: false },
  loyaltyProgram: {
    type: Number,
    required: true,
    enum: [5, 10],
  },
  rewardsRedeemed: { type: Number, required: true },
  credit: { type: Number, required: true, default: 0 },
});

const Business: Model<IBusiness> =
  mongoose.models.Business ||
  mongoose.model<IBusiness>("Business", businessSchema);

export default Business;
