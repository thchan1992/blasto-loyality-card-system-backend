import { Business } from "./types/Business";

export const fetchBusinessAPI = async (): Promise<Response> => {
  try {
    const response = await fetch("/api/business/get/");
    return response;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};

export const changeBusinessAPI = async (
  business: Business,
): Promise<Business> => {
  try {
    const response = await fetch("/api/business/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business,
      }),
    });

    const data = await response.json();

    const { __v, ...filteredBusiness } = data.data;
    return filteredBusiness;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};

export const giveStampAPI = async (
  customerId: string,
  // businessId: string,
  stampNum: number,
): Promise<Boolean> => {
  try {
    const response = await fetch("/api/stamp/give", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId,
        // businessId,
        stampNum,
      }),
    });

    if (response.status !== 200) {
      return false;
    }
    return true;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};
export const giveRewardAPI = async (customerId: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/stamp/redeem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId,
      }),
    });

    if (response.status !== 200) {
      return false;
    }
    return true;
  } catch (e) {
    console.error("Network error:", e);
    return false;
  }
};
