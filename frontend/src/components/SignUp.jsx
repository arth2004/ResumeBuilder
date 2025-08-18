import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import {Input} from "./Inputs";

const SignUp = ({ setCurrentPage }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fullName) {
      setError("Please enter FullName");
      return;
    }
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
      const response = await axiosInstance.post(
        API_PATHS.Auth.REGISTER,
        {
          name: fullName,
          email,
          password,
        },
        { withCredentials: true }
      );
      //   const { token } = response.data;
      //   if (token) {
      //     localStorage.setItem("token", token);
      updateUser(response.data);
      navigate("/dashboard");
      //   }
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
          Create Account
        </h3>
        <p className="text-slate-600 font-medium">
          Join thousands of professionals today
        </p>
      </div>
      {/* Form */}
      <form onSubmit={handleSignup} className="space-y-4">
        <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          label="Full Name"
          placeholder="John Doe"
          type="text"
        />
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email"
          placeholder="example@example.com"
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
          className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-rose-200 transition-all text-lg  "
        >
          Create Account
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-slate-600 font-medium">
          Already have an account?{" "}
          <button
            onClick={() => setCurrentPage("login")}
            type="button"
            className="font-black text-rose-600 hover:text-pink-600 transition-colors"
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
