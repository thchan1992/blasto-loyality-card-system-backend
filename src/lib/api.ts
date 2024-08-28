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
    console.log(business, "business data");
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

    const { __v, _id, ...filteredBusiness } = data.data;
    return filteredBusiness;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};
