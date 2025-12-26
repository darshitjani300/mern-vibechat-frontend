import axiosInstace from "./axios/axiosInstance";

export const getMessagesApi = async (id: string) => {
  const response = await axiosInstace.get(`v1/messages/${id}`);
  return response.data;
};
