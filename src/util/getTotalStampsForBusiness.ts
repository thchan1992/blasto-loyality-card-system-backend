import mongoose, { Types } from "mongoose";
import Customer from "@/lib/models/Customer";

export const getTotalStampsForBusiness = async (
  businessId: string | mongoose.Types.ObjectId,
): Promise<number> => {
  const businessObjectId = new Types.ObjectId(businessId);

  const result = await Customer.aggregate([
    { $unwind: "$stamps" }, // deconstruct the stamps array
    { $match: { "stamps.businessId": businessObjectId } }, // filter by businessId
    { $group: { _id: null, totalStamps: { $sum: "$stamps.count" } } },
  ]);

  return result.length > 0 ? result[0].totalStamps : 0;
};
