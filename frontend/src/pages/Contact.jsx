import {
  FaPhoneAlt,
  FaEnvelope
} from "react-icons/fa";

import "../styles/Contact.css";

function Contact() {
  return (
    <div className="contact-page">

      <section className="contact-section">

        <div className="contact-container">

          {/* ================= LEFT ================= */}

          <div className="contact-info">

            <h1>
              Get in Touch
            </h1>

            <p className="contact-description">
              Have a question, suggestion, or feedback?
              Fill out the form and start a conversation
              with us.
            </p>


            {/* Phone */}

            <div className="contact-item">

              <div className="contact-icon">
                <FaPhoneAlt />
              </div>

              <div>
                <h3>
                  Phone
                </h3>

                <a href="tel:+919876543210">
                  +91 9876543210
                </a>
              </div>

            </div>


            {/* Email */}

            <div className="contact-item">

              <div className="contact-icon">
                <FaEnvelope />
              </div>

              <div>
                <h3>
                  Email
                </h3>

                <a href="mailto:info@resourceshare.org">
                  info@resourceshare.org
                </a>
              </div>

            </div>

          </div>


          {/* ================= FORM ================= */}

          <div className="contact-form-card">

            <form>

              {/* Name */}

              <div className="form-group">

                <label htmlFor="name">
                  Name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                />

              </div>


              {/* Email */}

              <div className="form-group">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                />

              </div>


              {/* Subject */}

              <div className="form-group">

                <label htmlFor="subject">
                  Subject
                </label>

                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Enter subject here..."
                />

              </div>


              {/* Message */}

              <div className="form-group">

                <label htmlFor="message">
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="7"
                  placeholder="Enter your message here..."
                />

              </div>


              {/* Submit */}

              <button
                type="submit"
                className="contact-submit"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Contact;