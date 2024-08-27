import mongoose, { Schema, models, Types, Document } from "mongoose";

export interface IBusiness extends Document {
  clerkUserId: string;
  name: string;
  email: string;
  logo: string;
  loyaltyProgram: number;
}

const businessSchema = new Schema({
  clerkUserId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  logo: { type: String, required: false },
  loyaltyProgram: {
    type: Number,
    required: true,
    enum: [5, 10],
  },
});

const Business = mongoose.model<IBusiness>("Business", businessSchema);
export default Business;
