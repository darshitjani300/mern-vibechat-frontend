import axiosInstace from "./axios/axiosInstance";

export const profileApi = async (data: any) => {
  const response = await axiosInstace.post("/v1/profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getProfileApi = async () => {
  const response = await axiosInstace.get("/v1/getProfile");
  return response;
};

export const getAllProfileApi = async () => {
  const response = await axiosInstace.get("/v1/getAllProfile");
  return response;
};


