import { Link } from "react-router-dom";

import {
  IoArrowForward,
  IoSearchOutline,
  IoHeartOutline,
  IoPeopleOutline
} from "react-icons/io5";

import { HiOutlineUpload } from "react-icons/hi";

import "../styles/Home.css";

function Home() {
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

          <div className="hero-card">

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

            <Link to="/upload">
              Learn More <IoArrowForward />
            </Link>

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

    </div>
  );
}

export default Home;