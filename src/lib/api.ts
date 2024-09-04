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
): Promise<Response> => {
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

    // if (response.status !== 200) {
    //   return false;
    // }
    // return true;
    return response;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};
export const giveRewardAPI = async (customerId: string): Promise<Response> => {
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
    return response;

    // if (response.status !== 200) {
    //   return false;
    // }
    // return true;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};

export const handlePaymentAPI = async () => {
  try {
    const response = await fetch("/api/payment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
    // if (response.ok) {
    //   const data = await response.json();

    //   return data;
    // } else {
    //   console.error("Failed to create checkout session");
    // }
  } catch (error) {
    console.error("Error:", error);
  }
};
