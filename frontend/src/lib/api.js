import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:5001/api1" });
export default api;


export const axiosInstance = axios.create({
  baseURL : "http://localhost:5001/api1",
  withCredentials : true,
});


export const signup = async (signupData) => {
  const response = await axiosInstance.post("/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};