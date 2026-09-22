import { Link } from "react-router-dom";

import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn
} from "react-icons/fa6";

import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            ResourceShare
          </Link>

          <p>
            A simple platform for sharing and discovering
            educational resources.
          </p>

          <div className="social-links">

            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>

            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>

            <a href="#" aria-label="X">
              <FaXTwitter />
            </a>

            <a href="#" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>

          </div>

        </div>

        {/* Quick Links */}
        <div className="footer-links">

          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/search">Search</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>

        </div>

        {/* Account */}
        <div className="footer-links">

          <h3>Account</h3>

          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/upload">Upload Resource</Link>

        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 ResourceShare. All rights reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;