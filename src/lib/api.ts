export const fetchBusinessAPI = async (id: string): Promise<Response> => {
  try {
    const response = await fetch("/api/business/get/" + id);
    return response;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};
