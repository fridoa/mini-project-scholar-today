import axios from "axios";
import environment from "@/config/environment";

const headers = {
  "Content-Type": "application/json",
};

export const instance = axios.create({
  baseURL: environment.API_URL,
  headers,
  timeout: 60 * 1000,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default instance;