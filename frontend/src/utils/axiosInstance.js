import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout, setNewToken } from '../redux/slices/userSlice';

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",  // Your backend URL
});


// Interceptor to catch token expiration errors and refresh the token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const dispatch = useDispatch()
      try {
        // Try to refresh the token by calling the refresh endpoint
        const response = await axios.get('http://localhost:8000/api/auth/refresh', { withCredentials: true });
        const newAccessToken = response.data.accessToken;


        dispatch(setNewToken(newAccessToken))

        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        console.log("Token refresh failed", error);
        // Perform logout
        dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
