import mongoose, {
  Schema,
  models,
  model,
  Types,
  Document,
  Model,
} from "mongoose";

export interface IStamp {
  businessId: Types.ObjectId;
  count: number;
}

export interface ICustomer extends Document {
  _id: Types.ObjectId;
  clerkUserId: string;
  email: string;
  stamps: IStamp[];
}

const customerSchema: Schema = new Schema<ICustomer>({
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

const Customer: Model<ICustomer> =
  models.Customer || model<ICustomer>("Customer", customerSchema);

export default Customer;
