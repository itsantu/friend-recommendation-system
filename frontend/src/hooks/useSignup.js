import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { setUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";

export const useSignup = () => {
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const dispatch = useDispatch();

  const signup = async ({username, password}) => {
    setSignupLoading(true);
    setSignupError(null);

    try {
      const response = await axiosInstance.post(
        "/auth/signup",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const json = response.data;

      localStorage.setItem("authData", JSON.stringify(json));
      dispatch(setUser(json));
    } catch (error) {
      if (error.response) {
        setSignupError(
          error.response.data.message || error.response.data.error
        );
      } else {
        setSignupError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSignupLoading(false);
    }
  };

  return { signup, signupLoading, signupError };
};
