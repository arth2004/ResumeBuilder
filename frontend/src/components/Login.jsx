import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import {Input} from "./Inputs";
import { validateEmail } from "../utils/helper";

const Login = ({ setCurrentPage: setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter password");
      return;
    }
    setError("");
    try {
      const response = await axiosInstance.post(API_PATHS.Auth.LOGIN, {
        email,
        password,
      });
      updateUser(response.data);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again"
      );
    }
  };
  return (
    <div className="w-[90vw] md:w-[400px] p-8 bg-gradient-to-br from-white to-violet-50 rounded-3xl border border-violet-100 shadow-2xl">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black text-slate-900 mb-2">
          Welcome Back
        </h3>
        <p className="text-slate-600 font-medium">
          Sign in to continue building amazing resumes
        </p>
      </div>
      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-6">
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email"
          placeholder="johnDoe@example.com"
          type="email"
        />
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 characters"
          type="password"
        />
        {error && (
          <div className="text-red-500 text-sm font-medium bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-violet-200 transition-all text-lg"
        >
          Sign In
        </button>
        <p className="text-center text-sm text-slate-600 font-medium">
          Dont have an account{" "}
          <button
            type="button"
            onClick={() => setCurrentPage("signup")}
            className="font-black text-violet-600 hover:text-fuchsia-600 transition-colors"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
