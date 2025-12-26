import axiosInstace from "./axios/axiosInstance";

export const homeApi = async () => {
  const response = await axiosInstace.get("/home");
  return response.data;
};
