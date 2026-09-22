import "../styles/About.css";

function About() {
  return (
    <div className="about-page">

      {/* ================= HERO ================= */}

      <section className="about-hero">

        <span className="about-label">
          About ResourceShare
        </span>

        <h1>
          Learn Together.
          <br />

          <span>Share Resources.</span>
          <br />

          Grow Together.
        </h1>

        <p>
          ResourceShare is a platform designed for
          students and learners to easily share,
          discover, and access useful educational
          resources.
        </p>

      </section>


      {/* ================= WHO WE ARE ================= */}

      <section className="about-content">

        <div className="about-content-inner">

          <span className="about-section-label">
            WHO WE ARE
          </span>

          <h2>
            About ResourceShare
          </h2>

          <p>
            ResourceShare is a platform designed for
            students and learners to easily share,
            discover, and access useful educational
            resources.
          </p>

          <p>
            Our goal is to create a simple and
            collaborative environment where students
            can share notes, study materials, PDFs,
            previous year question papers, projects,
            and other learning resources.
          </p>

        </div>

      </section>


      {/* ================= MISSION ================= */}

      <section className="about-mission">

        <div className="mission-card">

          <span className="about-section-label">
            OUR MISSION
          </span>

          <h2>
            Learn, Share and Grow Together
          </h2>

          <p>
            We believe that knowledge becomes more
            valuable when it is shared. ResourceShare
            aims to make educational resources easier
            to find, share, and access for everyone.
          </p>

        </div>

      </section>

    </div>
  );
}

export default About;