import React, { useState, useEffect } from "react";
import { handleLogin,handleLogout,handleSignup } from "../auth";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseclient"; // Import Supabase client for session handling
import { isAuthenticated } from "../auth";

const LoginSignupPage = () => {
  const [activeForm, setActiveForm] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/appointments");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await handleLogin(loginData.email, loginData.password);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/appointments"), 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await handleSignup(signupData.fullName, signupData.email, signupData.password);
      setSuccess("Account created successfully! You can now log in.");
      setTimeout(() => {
        setSuccess(null);
        setActiveForm("login");
        setSignupData({ fullName: "", email: "", password: "", confirmPassword: "" });
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-purple-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Appointment System</h2>
        <div className="flex border-b mb-4">
          <button
            className={`w-1/2 p-2 ${activeForm === "login" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveForm("login")}
          >
            Login
          </button>
          <button
            className={`w-1/2 p-2 ${activeForm === "signup" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveForm("signup")}
          >
            Sign Up
          </button>
        </div>

        {activeForm === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="w-full p-2 border rounded"
              placeholder="Email"
            />
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="w-full p-2 border rounded"
              placeholder="Password"
            />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              value={signupData.fullName}
              onChange={handleSignupChange}
              className="w-full p-2 border rounded"
              placeholder="Full Name"
            />
            <input
              type="email"
              name="email"
              value={signupData.email}
              onChange={handleSignupChange}
              className="w-full p-2 border rounded"
              placeholder="Email"
            />
            <input
              type="password"
              name="password"
              value={signupData.password}
              onChange={handleSignupChange}
              className="w-full p-2 border rounded"
              placeholder="Password"
            />
            <input
              type="password"
              name="confirmPassword"
              value={signupData.confirmPassword}
              onChange={handleSignupChange}
              className="w-full p-2 border rounded"
              placeholder="Confirm Password"
            />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        )}

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {success && <p className="text-green-500 text-center mt-2">{success}</p>}
      </div>
    </div>
  );
};

export default LoginSignupPage;
