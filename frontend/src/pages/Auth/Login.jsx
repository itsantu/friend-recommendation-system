import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import { IoEye, IoEyeOffSharp } from "react-icons/io5";

const Login = () => {
  const { login, loginError, loginLoading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-2 mt-2 text-gray-700 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 mt-2 text-gray-700 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 focus:border-indigo-500"
                required
              />
              <span onClick={handleShowPassword} className="p-2 text-xl">
                {showPassword ? <IoEye /> : <IoEyeOffSharp />}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className={`${
              !loginLoading ? "bg-indigo-500" : "bg-indigo-300"
            } w-full px-4 py-2 font-medium text-white  rounded-md hover:bg-indigo-600`}
            disabled={loginLoading}
          >
            Login
          </button>
        </form>
        {loginError && <p className="text-sm text-red-600">{loginError}</p>}
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-500 hover:underline focus:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
