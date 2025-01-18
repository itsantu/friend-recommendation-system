import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { setUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";

export const useLogin = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const dispatch = useDispatch();

  const login = async ({ username, password }) => {
    setLoginLoading(true);
    setLoginError(null);

    try {
      const response = await axiosInstance.post(
        "/auth/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const json = response.data;

      localStorage.setItem("authData", JSON.stringify(json));
      dispatch(setUser(json));
    } catch (error) {
      if (error.response) {
        setLoginError(error.response.data.message || error.response.data.error);
      } else {
        setLoginError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  return { login, loginLoading, loginError };
};
