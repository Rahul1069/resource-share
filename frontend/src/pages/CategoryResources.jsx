import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaBook,
  FaFilePdf,
  FaDownload,
  FaExternalLinkAlt,
  FaUserCircle,
} from "../utils/icons";
import "../styles/CategoryResources.css";

function CategoryResources() {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategoryResources();
  }, [id]);

  const fetchCategoryResources = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://resource-share.onrender.com/api/categories/${id}/resources`
      );

      const data = await response.json();

      console.log("Category Resources Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch resources"
        );
      }

      if (data.success) {
        const resourceData = data.data || [];

        setResources(resourceData);

        // Category information comes from populated category_id
        if (resourceData.length > 0) {
          setCategory(resourceData[0].category_id);
        } else {
          // Fetch category separately when no resources exist
          await fetchCategory();
        }
      } else {
        setError(
          data.message || "Failed to load resources"
        );
      }
    } catch (error) {
      console.error("Category resources error:", error);

      setError(
        error.message ||
          "Unable to load resources. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch category information separately
  const fetchCategory = async () => {
    try {
      const response = await fetch(
        `https://resource-share.onrender.com/api/categories/${id}`
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setCategory(data.data);
      }
    } catch (error) {
      console.error("Category fetch error:", error);
    }
  };

  // Get file type from URL
  const getFileType = (resource) => {
    const fileUrl =
      resource.file_url ||
      resource.fileUrl ||
      "";

    const extension = fileUrl
      .split(".")
      .pop()
      .split("?")[0]
      .toLowerCase();

    if (extension === "pdf") return "PDF";
    if (extension === "ppt" || extension === "pptx") {
      return "PPT";
    }
    if (extension === "doc" || extension === "docx") {
      return "DOC";
    }
    if (extension === "zip" || extension === "rar") {
      return "ZIP";
    }

    return "FILE";
  };

  // Loading
  if (loading) {
    return (
      <main className="category-resources-page">
        <div className="category-resources-container">

          <div className="category-resources-loading">
            <div className="loading-spinner"></div>

            <p>
              Loading resources...
            </p>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="category-resources-page">
      <div className="category-resources-container">

        {/* Back Button */}
        <Link
          to="/categories"
          className="back-to-categories"
        >
          ← Back to Categories
        </Link>


        {/* Category Header */}
        <section className="category-resources-header">

          <span className="page-label">
            CATEGORY RESOURCES
          </span>

          <h1>
            {category?.name || "Category Resources"}
          </h1>

          <p>
            {category?.description ||
              "Explore resources available in this category."}
          </p>

        </section>


        {/* Error */}
        {error && (
          <div className="category-resources-error">

            <p>{error}</p>

            <button onClick={fetchCategoryResources}>
              Try Again
            </button>

          </div>
        )}


        {/* Resource Count */}
        {!error && (
          <div className="resource-count">
            {resources.length}{" "}
            {resources.length === 1
              ? "Resource"
              : "Resources"}
          </div>
        )}


        {/* Empty State */}
        {!error && resources.length === 0 && (
          <div className="resources-empty">

            <div className="empty-icon">
              <FaBook />
            </div>

            <h2>
              No Resources Yet
            </h2>

            <p>
              There are no resources available in this
              category yet.
            </p>

            <Link
              to="/upload"
              className="upload-resource-button"
            >
              Upload Resource
            </Link>

          </div>
        )}


        {/* Resources Grid */}
        {!error && resources.length > 0 && (
          <section className="resources-grid">

            {resources.map((resource) => (
              <article
                className="resource-card"
                key={resource._id}
              >

                {/* Thumbnail */}
                <div className="resource-thumbnail">

                  {resource.thumbnail_url ? (
                    <img
                      src={resource.thumbnail_url}
                      alt={resource.title}
                    />
                  ) : (
                    <div className="resource-file-icon">
                      <FaFilePdf />
                    </div>
                  )}

                  <span className="file-type">
                    {getFileType(resource)}
                  </span>

                </div>


                {/* Content */}
                <div className="resource-content">

                  <h2>
                    {resource.title}
                  </h2>

                  <p>
                    {resource.description ||
                      "No description available."}
                  </p>


                  {/* User */}
                  {resource.user_id && (
                    <div className="resource-user">

                      {resource.user_id.profile_image ? (
                        <img
                          src={
                            resource.user_id.profile_image
                          }
                          alt={
                            resource.user_id.name ||
                            "User"
                          }
                        />
                      ) : (
                        <div className="user-placeholder">
                          <FaUserCircle />
                        </div>
                      )}

                      <span>
                        {resource.user_id.name ||
                          "Unknown User"}
                      </span>

                    </div>
                  )}


                  {/* Footer */}
                  <div className="resource-footer">

                    <span className="downloads">
                      <FaDownload style={{ fontSize: '12px', marginRight: '5px' }} />
                      {resource.downloads || 0}
                    </span>

                    {resource.file_url && (
                      <a
                        href={resource.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-resource-button"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        View Resource <FaExternalLinkAlt style={{ fontSize: '10px' }} />
                      </a>
                    )}

                  </div>

                </div>

              </article>
            ))}

          </section>
        )}

      </div>
    </main>
  );
}

export default CategoryResources;