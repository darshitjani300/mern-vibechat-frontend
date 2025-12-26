import axios from "axios";

const BaseUrl = import.meta.env.VITE_BASE_URL;

const axiosInstace = axios.create({
  baseURL: BaseUrl,
  timeout: 10000,
  // headers: {
  //   "Content-Type": "application/json",
  // },
  withCredentials: true,
});

async function serverLogout() {
  try {
    await axiosInstace.post("/auth/logout", {}, { withCredentials: true });
    localStorage.removeItem("user");
    window.location.href = "/login";
  } catch (error) {
    console.log(error);
  }
}

axiosInstace.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes("/auth/refresh")) {
      await serverLogout();
      return Promise.reject(error);
    }

    // If access token is expired
    if (error.response?.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axiosInstace.post("/auth/refresh", {}, { withCredentials: true });
        return axiosInstace(originalRequest);
      } catch (error) {
        Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstace;
