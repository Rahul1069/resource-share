import { useState, useRef, useEffect } from "react";
import { FaBook, FaTimes } from "../utils/icons";
import { IoSearch } from "react-icons/io5";
import ResourceCard from "../components/ResourceCard";
import UploaderProfileModal from "../components/UploaderProfileModal";
import ChatModal from "../components/ChatModal";
import { downloadResourceFile } from "../utils/downloadHelper";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/Search.css";

function Search() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // Modals state
  const [selectedUploader, setSelectedUploader] = useState(null);
  const [chatUploader, setChatUploader] = useState(null);

  const debounceTimer = useRef(null);

  const performSearch = async (searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) {
      setResources([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      const response = await api.get(
        `/resources/search?q=${encodeURIComponent(searchTerm.trim())}`
      );

      console.log("SEARCH RESPONSE:", response.data);

      const data = response.data;
      setResources(data.resources || []);
    } catch (err) {
      console.error("Search error:", err);
      setResources([]);
      setError(
        err.response?.data?.message || err.message || "Unable to search resources."
      );
    } finally {
      setLoading(false);
    }
  };

  // Requirement 1: Use onChange in search bar instead of search button
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setError("");

    if (!val.trim()) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      setResources([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(val);
    }, 350);
  };

  const handleClear = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setQuery("");
    setResources([]);
    setSearched(false);
    setError("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    performSearch(query);
  };

  // Requirement 4: download button & increment count
  const handleDownload = async (resource) => {
    const resourceId = resource._id || resource.id;

    // Increment count in UI immediately
    setResources((prev) =>
      prev.map((r) =>
        (r._id || r.id) === resourceId
          ? { ...r, downloads: (r.downloads || 0) + 1 }
          : r
      )
    );

    // Call helper to hit backend and trigger file download
    await downloadResourceFile(resource);
  };

  // Requirement 3: uploader profile & chat
  const handleOpenUploader = (uploaderUser, resource) => {
    setSelectedUploader({
      uploader: uploaderUser,
      resource,
    });
  };

  const handleStartChat = (uploaderUser) => {
    setSelectedUploader(null);
    setChatUploader(uploaderUser);
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <div className="search-page">
      <div className="search-container">
        {/* Header */}
        <div className="search-header">
          <h1>Search Resources</h1>
          <p>
            Find notes, study materials, projects, question papers and more by title,
            description, or uploader name.
          </p>
        </div>

        {/* Search Form without search button (triggers on change) */}
        <form className="search-form" onSubmit={handleFormSubmit}>
          <div className="search-input-wrapper">
            <span className="search-icon">
              <IoSearch />
            </span>

            <input
              type="text"
              placeholder="Search live by title, description or uploader name..."
              value={query}
              onChange={handleInputChange}
              autoFocus
            />

            {query && (
              <button
                type="button"
                className="clear-btn"
                onClick={handleClear}
                aria-label="Clear search"
                title="Clear"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </form>

        {/* Error */}
        {error && <div className="search-error">{error}</div>}

        {/* Loading Indicator */}
        {loading && (
          <div className="search-status">
            <div className="loader"></div>
            <p>Searching resources...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && searched && resources.length > 0 && (
          <div className="results-section">
            <div className="results-heading">
              <h2>Search Results</h2>
              <span>
                {resources.length} {resources.length === 1 ? "resource" : "resources"} found
              </span>
            </div>

            <div className="resource-grid">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource._id || resource.id}
                  resource={resource}
                  onDownload={handleDownload}
                  onOpenUploader={handleOpenUploader}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && searched && resources.length === 0 && !error && (
          <div className="no-results">
            <div className="no-results-icon">
              <IoSearch />
            </div>

            <h2>No resources found</h2>
            <p>
              We couldn't find any resources matching <strong>"{query}"</strong>.
            </p>
            <span>Try searching with a different keyword or user name.</span>
          </div>
        )}

        {/* Initial Empty State */}
        {!searched && !loading && (
          <div className="search-empty">
            <div className="search-empty-icon">
              <FaBook />
            </div>

            <h2>Discover Learning Resources</h2>
            <p>
              Start typing above to instantly search for programming notes, projects,
              presentations, question papers, and other study materials.
            </p>
          </div>
        )}
      </div>

      {/* Uploader Profile Modal (Requirement 3) */}
      {selectedUploader && (
        <UploaderProfileModal
          uploader={selectedUploader.uploader}
          currentResource={selectedUploader.resource}
          onClose={() => setSelectedUploader(null)}
          onStartChat={handleStartChat}
        />
      )}

      {/* Chat with Uploader Modal (Requirement 3) */}
      {chatUploader && (
        <ChatModal
          uploader={chatUploader}
          currentUser={user}
          onClose={() => setChatUploader(null)}
        />
      )}
    </div>
  );
}

export default Search;