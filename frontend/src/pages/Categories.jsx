import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCode,
  FaGlobe,
  FaRobot,
  FaBook,
} from "react-icons/fa";
import {
  FaLaptopCode,
} from "react-icons/fa6";
import {
  IoArrowForward,
} from "react-icons/io5";
import {
  SiMongodb,
} from "react-icons/si";
import {
  MdSecurity,
  MdDesignServices,
  MdDevices,
  MdComputer,
} from "react-icons/md";
import {
  TbBinaryTree,
} from "react-icons/tb";
import "../styles/Categories.css";

// Map category names to icons
const categoryIcons = {
  "Web Development": <FaGlobe />,
  "Mobile Development": <MdDevices />,
  "Data Science": <FaRobot />,
  "Programming Languages": <FaCode />,
  "Database": <SiMongodb />,
  "DevOps": <FaLaptopCode />,
  "Cyber Security": <MdSecurity />,
  "UI/UX Design": <MdDesignServices />,
  "DSA": <TbBinaryTree />,
  "Computer Science": <MdComputer />,
};

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:3000/api/categories"
      );

      const data = await response.json();

      console.log("Categories API Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch categories"
        );
      }

      if (data.success) {
        setCategories(data.data || []);
      } else {
        setError(
          data.message || "Failed to load categories"
        );
      }
    } catch (error) {
      console.error("Categories Error:", error);

      setError(
        error.message ||
          "Unable to load categories. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="categories-page">
        <div className="categories-container">

          <section className="categories-header">
            <span className="page-label">
              RESOURCE CATEGORIES
            </span>

            <h1>Explore Categories</h1>

            <p>
              Discover useful resources organized by
              category.
            </p>
          </section>

          <div className="categories-loading">
            <div className="loading-spinner"></div>

            <p>Loading categories...</p>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="categories-page">
      <div className="categories-container">

        {/* =================================
            Page Header
        ================================= */}
        <section className="categories-header">

          <span className="page-label">
            RESOURCE CATEGORIES
          </span>

          <h1>Explore Categories</h1>

          <p>
            Discover useful notes, study materials,
            projects, previous year papers and other
            learning resources.
          </p>

        </section>


        {/* =================================
            Error Message
        ================================= */}
        {error && (
          <div className="categories-error">

            <p>{error}</p>

            <button onClick={fetchCategories}>
              Try Again
            </button>

          </div>
        )}


        {/* =================================
            Empty State
        ================================= */}
        {!error && categories.length === 0 && (
          <div className="categories-empty">

            <div className="empty-icon">
              <FaBook />
            </div>

            <h2>No Categories Available</h2>

            <p>
              There are currently no categories available.
              Please check again later.
            </p>

          </div>
        )}


        {/* =================================
            Categories Grid
        ================================= */}
        {!error && categories.length > 0 && (
          <section className="categories-grid">

            {categories.map((category) => (
              <article
                className="category-card"
                key={category._id}
              >

                {/* Category Icon */}
                <div className="category-icon">
                  {categoryIcons[category.name] || <FaBook />}
                </div>


                {/* Category Content */}
                <div className="category-content">

                  <h2>
                    {category.name}
                  </h2>

                  <p>
                    {category.description ||
                      "Explore resources available in this category."}
                  </p>


                  {/* View Resources */}
                  <Link
                    to={`/categories/${category._id}/resources`}
                    className="category-link"
                  >
                    <span>
                      View Resources
                    </span>

                    <IoArrowForward className="arrow-icon" />
                  </Link>

                </div>

              </article>
            ))}

          </section>
        )}

      </div>
    </main>
  );
}

export default Categories;