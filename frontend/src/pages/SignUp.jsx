import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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


  // Handle input changes
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Remove old error when user starts typing
    setError("");
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


      const response = await api.post(
        "/auth/signup",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );


      console.log("Signup response:", response.data);


      setSuccess(
        response.data?.message ||
        "Account created successfully!"
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
          error.response.data?.message ||
          "Unable to create account."
        );

      } else if (error.request) {

        setError(
          "Cannot connect to the server. Please make sure the backend is running."
        );

      } else {

        setError(
          "Something went wrong. Please try again."
        );
      }


    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* Header */}

        <div className="auth-header">

          <h1>
            Create Account
          </h1>

          <p>
            Join ResourceShare and start sharing knowledge
          </p>

        </div>


        {/* Card */}

        <div className="auth-card">

          <form onSubmit={handleSubmit}>

            {/* Name */}

            <div className="auth-form-group">

              <label htmlFor="name">
                Name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />

            </div>


            {/* Email */}

            <div className="auth-form-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

            </div>


            {/* Password */}

            <div className="auth-form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />

            </div>


            {/* Confirm Password */}

            <div className="auth-form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />

            </div>


            {/* Error */}

            {error && (
              <div className="auth-message auth-error">
                {error}
              </div>
            )}


            {/* Success */}

            {success && (
              <div className="auth-message auth-success">
                {success}
              </div>
            )}


            {/* Terms */}

            <label className="terms-checkbox">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the terms and conditions.
              </span>

            </label>


            {/* Submit */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"
              }

            </button>

          </form>


          {/* Sign In */}

          <div className="auth-footer">

            <p>
              Already have an account?
              {" "}

              <Link to="/signin">
                Sign In
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default SignUp;