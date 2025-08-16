import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // This allows cookies to be sent with requests
});

//Request interceptor
axiosInstance.interceptors.request.use(
    (config)=>{
        // const accessToken =localStorage.getItem('token')
        // if(accessToken){
        //     config.headers.Authorization = `Bearer${accessToken}`
        // }
        return config;
    },
    (error)=>{
        return Promise.reject(error)
    }
)

//Response Inerceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.response) {
      if (error.response.status === 403) {
        console.error("Server Error:", error.response.data?.message);
      } else if (error.code === "ECONNABORTED") {
        console.error("Request timed out. Please try again later.");
      }
      // return the full error object so caller can inspect status, data, etc.
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;