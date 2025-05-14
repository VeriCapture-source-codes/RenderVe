// src/components/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ForgotPassword.css"; 
import { apiRequest } from "./utils/api";
import {toast, Toaster} from 'react-hot-toast'

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.email) {
      toast.error("Please fill in your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await apiRequest({
        method: "POST",
        route: "/users/password-reset-otp",
        body: { email: form.email },
      });

      if (data.success) {
        toast.success("Request successful! Redirecting...");
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
        }, 1000);
      } else {
        toast.error(data.message || "Request failed.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred." + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <Toaster position="top-center" reverseOrder={false} />
-
     {/* Logo Header */}
      <div className="logo-header">
        <img src = "/vericapture.png" alt="Logo" className="logo" />
      </div>

      {/* Header Text */}
      <div className="forgot-container">
        <h1 className="forgot-header">Forgot Password?</h1>
        <img src= "/forgetPassword img.png" alt="Lock Icon" className="lock-icon" />

        <p className="forgot-text">
          We'll Send you an Email to <span className="span-text">
          Reset your Password </span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="forgot-input">
            <img src="/message img.png" alt="Email Icon" className="email-icon" />
            <input
              type="email"
              name="email"
              placeholder=" Enter Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Requesting..." : "Submit"}
          </button>

          {message && <p className="message">{message}</p>}
        </form>

        <Link to ="/login" className="back-link">
           BACK TO LOGIN
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
