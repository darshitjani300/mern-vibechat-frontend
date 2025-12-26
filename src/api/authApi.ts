import axiosInstace from "./axios/axiosInstance";

export const signupApi = async (userData: any) => {
  const response = await axiosInstace.post("/v1/auth/signup", userData);
  return response?.data;
};

export const loginApi = async (userData: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstace.post("/v1/auth/login", userData);
  return response?.data;
};

export const forgetApi = async (data: { email: string }) => {
  const response = await axiosInstace.post("/v1/auth/forgotPassword", data);
  return response.data;
};

export const resetApi = async (data: {
  password: string;
  confirmPassword: string;
  token: string;
}) => {
  const response = await axiosInstace.post("/v1/auth/resetPassword", data);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstace.post("/v1/auth/logout");
  return response.data;
};
