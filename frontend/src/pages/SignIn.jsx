import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "../utils/icons";
import "../styles/Auth.css";

function SignIn() {
  const navigate = useNavigate();

  const { login } = useAuth();

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Login through AuthContext
      await login(
        formData.email,
        formData.password
      );

      setSuccess("Login successful!");

      // Header updates immediately
      // Then navigate to profile
      setTimeout(() => {
        navigate("/profile");
      }, 500);

    } catch (error) {
      if (error.response) {
        setError(
          error.response.data?.message ||
          "Invalid email or password"
        );
      } else if (error.request) {
        setError("Unable to connect to server.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">
          <span className="auth-label">
            WELCOME BACK
          </span>

          <h1>Sign In</h1>

          <p>
            Sign in to access your ResourceShare account.
          </p>
        </div>


        {error && (
          <div className="auth-message auth-error">
            {error}
          </div>
        )}


        {success && (
          <div className="auth-message auth-success">
            {success}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <div className="auth-form-group">
            <label>Email</label>

            <div className="input-icon-wrapper">
              <span className="input-icon">
                <FaEnvelope />
              </span>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>


          <div className="auth-form-group">
            <label>Password</label>

            <div className="input-icon-wrapper">
              <span className="input-icon">
                <FaLock />
              </span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
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


          <div className="auth-options">

            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <span>
              Forgot Password?
            </span>

          </div>


          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>


        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </div>

      </div>

    </div>
  );
}

export default SignIn;