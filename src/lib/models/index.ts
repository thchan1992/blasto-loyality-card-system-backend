import mongoose from "mongoose";
import Customer, { ICustomer } from "./Customer";
import Business, { IBusiness } from "./Business";

const CustomerModel = mongoose.model<ICustomer>("Customer", Customer.schema);
const BusinessModel = mongoose.model<IBusiness>("Business", Business.schema);

export { CustomerModel, BusinessModel };
