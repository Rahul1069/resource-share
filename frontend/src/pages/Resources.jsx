import { useEffect, useState } from "react";
import api from "../services/api";
import {
  FaBook,
  FaDownload,
  FaExternalLinkAlt,
  FaUserCircle,
  FaFilePdf,
} from "../utils/icons";
import "../styles/Resources.css";

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/resources");

        console.log("Resources response:", response.data);

        const resourceData =
          response.data?.data ||
          response.data?.resources ||
          response.data;

        if (Array.isArray(resourceData)) {
          setResources(resourceData);
        } else {
          setResources([]);
        }
      } catch (error) {
        console.error("Fetch resources error:", error);

        if (error.response) {
          setError(
            error.response.data?.message ||
              "Failed to load resources."
          );
        } else if (error.request) {
          setError("Unable to connect to server.");
        } else {
          setError("Something went wrong.");
        }

        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Get user initials for avatar fallback
  const getUserInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading
  if (loading) {
    return (
      <main className="resources-page">
        <div className="resources-container">

          <div className="resources-header">
            <span className="resources-label">
              RESOURCE SHARE
            </span>

            <h1>Resources</h1>

            <p>
              Explore notes, study materials, projects
              and other useful resources shared by the
              community.
            </p>
          </div>

          <div className="resources-loading">
            <div className="loading-spinner"></div>
            <span>Loading resources...</span>
          </div>

        </div>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <main className="resources-page">
        <div className="resources-container">

          <div className="resources-header">
            <span className="resources-label">
              RESOURCE SHARE
            </span>

            <h1>Resources</h1>

            <p>
              Explore notes, study materials, projects
              and other useful resources shared by the
              community.
            </p>
          </div>

          <div className="resources-error">
            {error}
          </div>

          <div className="resources-error-action">
            <button
              className="resources-retry-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="resources-page">

      <div className="resources-container">

        {/* Page Header */}
        <div className="resources-header">

          <span className="resources-label">
            RESOURCE SHARE
          </span>

          <h1>Resources</h1>

          <p>
            Explore notes, study materials, projects
            and other useful resources shared by the
            community.
          </p>

        </div>

        {/* Empty State */}
        {resources.length === 0 ? (

          <div className="resources-empty">

            <div className="empty-icon">
              <FaBook />
            </div>

            <h2>
              No Resources Available
            </h2>

            <p>
              There are no resources available at the
              moment. Please check back later.
            </p>

          </div>

        ) : (

          /* Resources Grid */
          <div className="resources-grid">

            {resources.map((resource) => (

              <div
                className="resource-card"
                key={resource._id || resource.id}
              >

                {/* Thumbnail */}
                <div className="resource-thumbnail">

                  {resource.thumbnail_url ? (

                    <img
                      src={resource.thumbnail_url}
                      alt={resource.title || "Resource"}
                    />

                  ) : (

                    <div className="resource-file-icon">
                      <FaFilePdf />
                    </div>

                  )}

                </div>

                {/* Resource Content */}
                <div className="resource-content">

                  <h2>
                    {resource.title}
                  </h2>

                  <p>
                    {resource.description}
                  </p>

                  {/* User Info */}
                  {resource.user_id &&
                    typeof resource.user_id === "object" && (
                      <div className="resource-user">
                        {resource.user_id.profile_image ? (
                          <img
                            src={resource.user_id.profile_image}
                            alt={resource.user_id.name || "User"}
                            className="resource-user-avatar"
                          />
                        ) : (
                          <div className="resource-user-initials">
                            {getUserInitials(resource.user_id.name)}
                          </div>
                        )}
                        <span className="resource-user-name">
                          {resource.user_id.name || "Unknown User"}
                        </span>
                      </div>
                    )}

                  {/* Category */}
                  <div className="resource-category">

                    {resource.category_id &&
                    typeof resource.category_id === "object"
                      ? resource.category_id.name
                      : "Resource"}

                  </div>

                  {/* Footer */}
                  <div className="resource-footer">

                    <span className="download-count">
                      <FaDownload className="download-icon" />
                      {resource.downloads || 0}
                    </span>

                    {resource.file_url && (

                      <a
                        href={resource.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-view-btn"
                      >
                        View <FaExternalLinkAlt className="view-icon" />
                      </a>

                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}

export default Resources;