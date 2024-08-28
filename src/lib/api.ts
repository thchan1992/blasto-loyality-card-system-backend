import { Business } from "./types/Business";

export const fetchBusinessAPI = async (id: string): Promise<Response> => {
  try {
    const response = await fetch("/api/business/get/" + id);
    return response;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};

export const changeBusinessAPI = async (
  business: Business,
): Promise<Response> => {
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
    console.log(data, " api  data");

    return data;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};
