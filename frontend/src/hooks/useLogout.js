import { useDispatch } from "react-redux";
import { logout as logoutUser } from "../redux/slices/userSlice";
import axiosInstance from "../utils/axiosInstance";

export const useLogout = () => {
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");

      if (response.status === 200) {
        localStorage.removeItem("authData");
        dispatch(logoutUser());
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return { logout };
};
