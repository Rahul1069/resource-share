import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

function Header() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const {
    user,
    loading,
    logout,
  } = useAuth();


  const handleLogout = async () => {
    try {
      await logout();

      setIsOpen(false);

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return (
    <header className="header">

      <div className="header-container">

        {/* Logo */}

        <Link
          to="/"
          className="logo"
        >
          <span className="logo-icon">
            R
          </span>
        </Link>


        {/* Desktop Navigation */}

        <nav className="desktop-nav">

          <NavLink
            to="/"
            className="nav-link"
          >
            Home
          </NavLink>

          <NavLink
            to="/categories"
            className="nav-link"
          >
            Categories
          </NavLink>

          <NavLink
            to="/resources"
            className="nav-link"
          >
            Resources
          </NavLink>

          <NavLink
            to="/community"
            className="nav-link"
          >
            Community
          </NavLink>

          <NavLink
            to="/search"
            className="nav-link"
          >
            Search
          </NavLink>

          <NavLink
            to="/about"
            className="nav-link"
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className="nav-link"
          >
            Contact
          </NavLink>


          {/* Authentication */}

          {!loading && !user && (
            <div className="auth-buttons">

              <Link
                to="/signin"
                className="signin-btn"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="signup-btn"
              >
                Sign Up
              </Link>

            </div>
          )}


          {/* Logged In */}

          {!loading && user && (
            <div className="auth-buttons">

              <Link
                to="/profile"
                className="profile-btn"
              >
                Profile
              </Link>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          )}

        </nav>


        {/* Mobile Menu Button */}

        <button
          className="menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <IoClose />
          ) : (
            <IoMenu />
          )}
        </button>

      </div>


      {/* Mobile Menu */}

      <div
        className={`mobile-menu ${
          isOpen ? "open" : ""
        }`}
      >

        <NavLink
          to="/"
          className="mobile-nav-link"
          onClick={() => setIsOpen(false)}
        >
          Home
        </NavLink>

        <NavLink
          to="/categories"
          className="mobile-nav-link"
          onClick={() => setIsOpen(false)}
        >
          Categories
        </NavLink>

        <NavLink
          to="/resources"
          className="mobile-nav-link"
          onClick={() => setIsOpen(false)}
        >
          Resources
        </NavLink>

        <NavLink
          to="/community"
          className="mobile-nav-link"
          onClick={() => setIsOpen(false)}
        >
          Community
        </NavLink>

        <NavLink
          to="/search"
          className="mobile-nav-link"
          onClick={() => setIsOpen(false)}
        >
          Search
        </NavLink>

        <NavLink
          to="/about"
          className="mobile-nav-link"
          onClick={() => setIsOpen(false)}
        >
          About
        </NavLink>

        <NavLink
          to="/contact"
          className="mobile-nav-link"
          onClick={() => setIsOpen(false)}
        >
          Contact
        </NavLink>


        {/* Mobile Authentication */}

        {!loading && !user && (
          <div className="mobile-auth">

            <Link
              to="/signin"
              className="signin-btn"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              className="signup-btn"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>

          </div>
        )}


        {/* Mobile Logged In */}

        {!loading && user && (
          <div className="mobile-auth">

            <Link
              to="/profile"
              className="profile-btn"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        )}

      </div>

    </header>
  );
}

export default Header;