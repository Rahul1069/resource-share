import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "../utils/icons";
import { FaExclamationCircle, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import api from "../services/api";
import "../styles/Auth.css";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError("");
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log("Signup response:", response.data);

      setSuccess(
        response.data?.message || "Account created successfully! Redirecting..."
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Go to Sign In after successful signup
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (error) {
      console.error("Signup error:", error);

      if (error.response) {
        setError(
          error.response.data?.message || "Unable to create account."
        );
      } else if (error.request) {
        setError(
          "Cannot connect to the server. Please check your network connection."
        );
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
          <span className="auth-label">GET STARTED</span>
          <h1>Create Account</h1>
          <p>
            Join ResourceShare to upload resources, connect with others, and start sharing knowledge.
          </p>
        </div>

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

          {/* Name */}
          <div className="auth-form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <FaUser />
              </span>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
          </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="auth-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="terms-checkbox">
            <input type="checkbox" required />
            <span>
              I agree to the{" "}
              <a href="#terms" onClick={(e) => e.preventDefault()} className="forgot-link">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#privacy" onClick={(e) => e.preventDefault()} className="forgot-link">
                Privacy Policy
              </a>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading-state">
                <span className="auth-spinner"></span>
                Creating Account...
              </span>
            ) : (
              <span className="btn-normal-state">
                Create Account <FaArrowRight className="btn-arrow" />
              </span>
            )}
          </button>

        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/signin" className="auth-signup-link">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default SignUp;