import useApi from "@/api/useApi";

export const userService = {
  addHolding: async (payload: any) => {
    const response = await useApi.post('/dashboard/user_request/', payload);
    return response.data;
  },
};