/** @format */

// Import axios and cookie-parser
import axios from "axios";

// Create an axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Use an interceptor to set the access token to the Authorization header
axiosInstance.interceptors.request.use(
  function (config) {
    // Get the access token from the local storage
    const accessToken = localStorage.getItem("accessToken");
    // Set the Authorization header with the access token
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Use another interceptor to handle token expiration and refresh
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    // Get the original request config and the error status code
    const originalRequest = error.config;
    const statusCode = error.response.status;
    // If the status code is 401 (Unauthorized) and the request is not a retry
    if (statusCode === 401 && !originalRequest._retry) {
      // Set the retry flag to true
      originalRequest._retry = true;
      try {
        // Get the refresh token from the client-side cookies
        const refreshToken = document.cookie
          .split("; ")
          .find((cookie) => cookie.startsWith("refreshToken="))
          ?.split("=")[1];

        if (!refreshToken) {
          // Handle the case where refreshToken is not found
          console.error("Refresh token not found in cookies");
          return Promise.reject(error);
        }

        // Send a POST request to refresh the access token
        const response = await axios.post(
          "http://localhost:3000/api/auth/refresh-token",
          {
            refreshToken,
          }
        );
        // Get the new access token from the response
        const newAccessToken = response.data.accessToken;
        // Save the new access token to the local storage
        localStorage.setItem("accessToken", newAccessToken);
        // Set the Authorization header with the new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // Return the original request with the new access token
        return axios(originalRequest);
      } catch (error) {
        // Handle refresh error
        console.error(error);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
