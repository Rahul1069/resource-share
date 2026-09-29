import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  IoArrowForward,
  IoSearchOutline,
  IoHeartOutline,
  IoPeopleOutline
} from "react-icons/io5";

import { HiOutlineUpload } from "react-icons/hi";

import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleUploadClick = (e) => {
    if (e) e.preventDefault();

    if (user) {
      navigate("/upload");
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="home">

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-container">

          {/* Hero Content */}

          <div className="hero-content">

            <h1>
              Share, Learn,
              <br />

              <span>Grow Together.</span>
            </h1>

            <p>
              Discover useful resources, share knowledge and
              connect with a community of learners.
            </p>

            <Link to="/resources" className="hero-btn">
              Explore
            </Link>

          </div>

          {/* Hero Card */}

          <div
            className="hero-card clickable"
            onClick={handleUploadClick}
            title="Click to upload resource"
            style={{ cursor: "pointer" }}
          >

            <div className="hero-card-icon">
              <HiOutlineUpload />
            </div>

            <h2>
              Share Knowledge
            </h2>

            <p>
              Upload and discover notes, PDFs,
              presentations, projects and other useful
              resources.
            </p>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="features">

        <div className="features-heading">

          <span className="section-label">
            FEATURES
          </span>

          <h2>
            Everything You Need
          </h2>

          <p>
            A simple platform designed to make resource
            sharing easier.
          </p>

        </div>


        <div className="feature-grid">

          {/* Upload */}

          <div className="feature-card">

            <div className="feature-icon">
              <HiOutlineUpload />
            </div>

            <h3>
              Upload Resources
            </h3>

            <p>
              Upload notes, documents, presentations and
              educational materials.
            </p>

            <button
              onClick={handleUploadClick}
              className="feature-action-btn"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                color: "var(--primary)",
                fontSize: "11px",
                fontWeight: "600"
              }}
            >
              Upload Now <IoArrowForward />
            </button>

          </div>


          {/* Find */}

          <div className="feature-card">

            <div className="feature-icon">
              <IoSearchOutline />
            </div>

            <h3>
              Find Resources
            </h3>

            <p>
              Quickly search and find resources based on
              category and subject.
            </p>

            <Link to="/search">
              Explore <IoArrowForward />
            </Link>

          </div>


          {/* Favorites */}

          <div className="feature-card">

            <div className="feature-icon">
              <IoHeartOutline />
            </div>

            <h3>
              Save Favorites
            </h3>

            <p>
              Save useful resources and easily access them
              whenever you need.
            </p>

            <Link to="/signin">
              View Favorites <IoArrowForward />
            </Link>

          </div>


          {/* Community */}

          <div className="feature-card">

            <div className="feature-icon">
              <IoPeopleOutline />
            </div>

            <h3>
              Community
            </h3>

            <p>
              Connect with other students and share
              knowledge with everyone.
            </p>

            <Link to="/signup">
              Join Community <IoArrowForward />
            </Link>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="cta">

        <div className="cta-container">

          <h2>
            Ready to Share Your Knowledge?
          </h2>

          <p>
            Join our community and start sharing useful
            resources today.
          </p>

          <Link to="/signup" className="cta-btn">
            Create Account
          </Link>

        </div>

      </section>


      {/* ================= AUTH MODAL ================= */}

      {showAuthModal && (
        <div className="modal-backdrop" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <HiOutlineUpload />
            </div>
            <h3>Sign In Required</h3>
            <p>You need to be logged in to upload resources to ResourceShare.</p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() => setShowAuthModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-signin-btn"
                onClick={() => {
                  setShowAuthModal(false);
                  navigate("/signin", {
                    state: {
                      message: "Please sign in first to upload resources",
                      redirectAfterLogin: "/upload",
                    },
                  });
                }}
              >
                Sign In to Continue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;