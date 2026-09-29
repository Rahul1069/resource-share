import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "../utils/icons";
import { FaInfoCircle, FaExclamationCircle, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import "../styles/Auth.css";

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const infoMessage = location.state?.message || "";
  const redirectPath = location.state?.redirectAfterLogin || "/profile";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      setSuccess("Welcome back! Signing you in...");

      setTimeout(() => {
        navigate(redirectPath);
      }, 600);
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data?.message ||
          "Invalid email or password. Please try again."
        );
      } else if (error.request) {
        setError("Unable to connect to server. Please check your network connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background ambient glow shapes */}
      <div className="auth-bg-blob blob-1"></div>
      <div className="auth-bg-blob blob-2"></div>

      <div className="auth-card">

        {/* Brand Header Badge */}
        <div className="auth-brand-badge">
          <span className="brand-logo-icon">R</span>
          <span className="brand-badge-text">ResourceShare</span>
        </div>

        <div className="auth-header">
          <span className="auth-label">WELCOME BACK</span>
          <h1>Sign In</h1>
          <p>
            Sign in to access your ResourceShare account, upload resources, and connect.
          </p>
        </div>

        {/* Info Banner if redirected */}
        {infoMessage && (
          <div className="auth-message auth-info">
            <FaInfoCircle className="auth-msg-icon" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="auth-message auth-error">
            <FaExclamationCircle className="auth-msg-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Banner */}
        {success && (
          <div className="auth-message auth-success">
            <FaCheckCircle className="auth-msg-icon" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">

          {/* Email */}
          <div className="auth-form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <FaEnvelope />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-form-group">
            <label htmlFor="password">Password</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="auth-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#forgot" onClick={(e) => e.preventDefault()} className="forgot-link">
              Forgot Password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading-state">
                <span className="auth-spinner"></span>
                Signing In...
              </span>
            ) : (
              <span className="btn-normal-state">
                Sign In <FaArrowRight className="btn-arrow" />
              </span>
            )}
          </button>

        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-signup-link">
              Sign Up for Free
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default SignIn;