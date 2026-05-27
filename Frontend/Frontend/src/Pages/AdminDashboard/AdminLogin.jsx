import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
  const navigate = useNavigate(); // 🔥 Added navigate
  const [view, setView] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaInput, setCaptchaInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/admin`;


  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
  }, [view]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (parseInt(captchaInput) !== num1 + num2) {
      setError("Incorrect Security CAPTCHA. Please try again.");
      generateCaptcha();
      return;
    }

    if (!email || !password) {
      setError("Please enter both ID and Password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Credentials verified. An OTP has been sent to your email.");
        setView("otp");
      } else {
        setError(data.error || "Invalid Admin ID or Password");
        generateCaptcha();
      }
    } catch (err) {
      setError("Server error. Ensure Spring Boot is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🔥 SECURITY WALL 1: Give them the VIP pass and send them to the protected route!
        localStorage.setItem("reRideX_admin_auth", "true");
        navigate("/admin-dashboard");
      } else {
        setError(data.error || "Invalid or Expired OTP");
      }
    } catch (err) {
      setError("Server error while verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your Admin Email ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password reminder sent to your registered email.");
        setEmail("");
      } else {
        setError(data.error || "Unregistered Admin Email");
      }
    } catch (err) {
      setError("Server error. Could not send recovery email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.logoText}>
          ReRide<span>X</span>
        </div>

        <p className={styles.subtitle}>
          {view === "login" && "Admin Secure Login Portal"}
          {view === "otp" && "Two-Factor Authentication"}
          {view === "forgot" && "Reset Admin Password"}
        </p>

        {error && <div className={styles.errorMsg}>{error}</div>}
        {success && <div className={styles.successMsg}>{success}</div>}

        {view === "login" && (
          <form onSubmit={handleLoginSubmit}>
            <div className={styles.inputGroup}>
              <label>Admin ID / Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@reridex.com"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Security CAPTCHA</label>
              <div className={styles.captchaBox}>
                <span className={styles.captchaMath}>
                  {num1} + {num2} ={" "}
                </span>
                <input
                  type="number"
                  className={styles.captchaInput}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="?"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Secure Login"}
            </button>

            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => {
                setView("forgot");
                setError("");
                setSuccess("");
              }}
            >
              Forgot Password?
            </button>
          </form>
        )}

        {view === "otp" && (
          <form onSubmit={handleOtpSubmit}>
            <div className={styles.inputGroup}>
              <label>Enter 6-Digit OTP</label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                required
                style={{
                  textAlign: "center",
                  letterSpacing: "5px",
                  fontSize: "1.2rem",
                }}
              />
            </div>

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Access Dashboard"}
            </button>

            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => {
                setView("login");
                setError("");
                setSuccess("");
                setOtp("");
              }}
            >
              &larr; Back to Login
            </button>
          </form>
        )}

        {view === "forgot" && (
          <form onSubmit={handleForgotSubmit}>
            <div className={styles.inputGroup}>
              <label>Registered Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@reridex.com"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => {
                setView("login");
                setError("");
                setSuccess("");
              }}
            >
              &larr; Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
