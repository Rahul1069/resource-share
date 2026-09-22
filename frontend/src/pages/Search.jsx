import { useState } from "react";
import {
  FaBook,
  FaDownload,
  FaExternalLinkAlt,
  FaTimes,
} from "../utils/icons";
import { IoSearch } from "react-icons/io5";
import "../styles/Search.css";

const API_URL = "http://localhost:3000";

function Search() {
  const [query, setQuery] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

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

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter something to search.");
      setResources([]);
      setSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      const response = await fetch(
        `${API_URL}/api/resources/search?q=${encodeURIComponent(
          query.trim()
        )}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log("SEARCH RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Search request failed"
        );
      }

      // Backend returns { success: true, resources: [...] }
      setResources(data.resources || []);
    } catch (error) {
      console.error("Search error:", error);

      setResources([]);
      setError(
        error.message || "Unable to search resources."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResources([]);
    setSearched(false);
    setError("");
  };

  return (
    <div className="search-page">
      <div className="search-container">

        {/* Header */}
        <div className="search-header">
          <h1>Search Resources</h1>

          <p>
            Find notes, study materials, projects,
            question papers and more by title,
            description, or uploader name.
          </p>
        </div>

        {/* Search Form */}
        <form
          className="search-form"
          onSubmit={handleSearch}
        >
          <div className="search-input-wrapper">

            <span className="search-icon">
              <IoSearch />
            </span>

            <input
              type="text"
              placeholder="Search by title, description or user name..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setError("");
              }}
            />

            {query && (
              <button
                type="button"
                className="clear-btn"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="search-btn"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="search-error">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="search-status">
            <div className="loader"></div>

            <p>
              Searching resources...
            </p>
          </div>
        )}

        {/* Search Results */}
        {!loading &&
          searched &&
          resources.length > 0 && (
            <div className="results-section">

              <div className="results-heading">
                <h2>Search Results</h2>

                <span>
                  {resources.length}{" "}
                  {resources.length === 1
                    ? "resource"
                    : "resources"}{" "}
                  found
                </span>
              </div>

              <div className="resource-grid">

                {resources.map((resource) => (
                  <div
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
                        <div className="thumbnail-placeholder">
                          <FaBook />
                        </div>
                      )}

                    </div>

                    {/* Content */}
                    <div className="resource-content">

                      <h3>
                        {resource.title}
                      </h3>

                      <p className="resource-description">
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
                      {resource.category_id?.name && (
                        <span className="resource-category">
                          {resource.category_id.name}
                        </span>
                      )}

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
                            className="view-btn"
                          >
                            View <FaExternalLinkAlt className="view-icon" />
                          </a>
                        )}

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            </div>
          )}

        {/* No Results */}
        {!loading &&
          searched &&
          resources.length === 0 &&
          !error && (
            <div className="no-results">

              <div className="no-results-icon">
                <IoSearch />
              </div>

              <h2>
                No resources found
              </h2>

              <p>
                We couldn't find any resources
                matching{" "}
                <strong>
                  "{query}"
                </strong>
                .
              </p>

              <span>
                Try searching with a different
                keyword or user name.
              </span>

            </div>
          )}

        {/* Initial State */}
        {!searched && !loading && (
          <div className="search-empty">

            <div className="search-empty-icon">
              <FaBook />
            </div>

            <h2>
              Discover Learning Resources
            </h2>

            <p>
              Search for programming notes,
              projects, presentations, question
              papers, e-books and other study
              materials by title, description or
              uploader name.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default Search;