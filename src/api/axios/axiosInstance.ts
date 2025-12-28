import axios from "axios";
import { logout } from "../authApi";
import { toastMessage } from "../../utils/toastMessage";

const BaseUrl = import.meta.env.VITE_BASE_URL;

const axiosInstace = axios.create({
  baseURL: BaseUrl,
  timeout: 10000,
  withCredentials: true,
});

const handleLogout = async () => {
  try {
    const response = await logout();

    if (response.status === true) {
      toastMessage("success", "Sign-out");
      window.location.reload();
    }
  } catch (error) {
    toastMessage("error", "Error signing out");
  }
};

axiosInstace.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.url?.includes("/v1/auth/me")) {
      return Promise.reject(error);
    }

    if (originalRequest?.url?.includes("/v1/auth/refresh")) {
      await handleLogout();
      return Promise.reject(error);
    }

    // If access token is expired
    console.log("REtry ",originalRequest._retry)
    if (error.response?.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;


      try {
        await axiosInstace.post(
          "/v1/auth/refresh",
          {},
          { withCredentials: true }
        );
        return axiosInstace(originalRequest);
      } catch (error) {
        await handleLogout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstace;
