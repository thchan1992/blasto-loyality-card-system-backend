import mongoose, { Schema, models, Types, Document } from "mongoose";

export interface IBusiness extends Document {
  clerkUserId: string;
  name: string;
  email: string;
  logo: string;
}

const businessSchema = new Schema({
  clerkUserId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  logo: { type: String },
  loyaltyProgram: {
    stampsRequired: { type: Number, enum: [5, 10], required: true },
  },
});

const Business = mongoose.model<IBusiness>("Business", businessSchema);
export default Business;
