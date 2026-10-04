import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaBook } from "../utils/icons";
import ResourceCard from "../components/ResourceCard";
import UploaderProfileModal from "../components/UploaderProfileModal";
import ChatModal from "../components/ChatModal";
import { downloadResourceFile } from "../utils/downloadHelper";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/CategoryResources.css";

function CategoryResources() {
  const { id } = useParams();
  const { user } = useAuth();

  const [category, setCategory] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals state
  const [selectedUploader, setSelectedUploader] = useState(null);
  const [chatUploader, setChatUploader] = useState(null);

  useEffect(() => {
    fetchCategoryResources();
  }, [id]);

  const fetchCategoryResources = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/categories/${id}/resources`);
      const data = response.data;

      console.log("Category Resources Response:", data);

      if (data.success) {
        const resourceData = data.data || [];
        setResources(resourceData);

        if (resourceData.length > 0) {
          setCategory(resourceData[0].category_id);
        } else {
          await fetchCategory();
        }
      } else {
        setError(data.message || "Failed to load resources");
      }
    } catch (err) {
      console.error("Category resources error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load resources. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await api.get(`/categories/${id}`);
      const data = response.data;
      if (data.success) {
        setCategory(data.data);
      }
    } catch (err) {
      console.error("Category fetch error:", err);
    }
  };

  // Requirement 4: download button & count increment
  const handleDownload = async (resource) => {
    const resourceId = resource._id || resource.id;

    // Immediately increment in UI
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

  if (loading) {
    return (
      <main className="category-resources-page">
        <div className="category-resources-container">
          <div className="category-resources-loading">
            <div className="loading-spinner"></div>
            <p>Loading resources...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="category-resources-page">
      <div className="category-resources-container">
        {/* Back Button */}
        <Link to="/categories" className="back-to-categories">
          ← Back to Categories
        </Link>

        {/* Category Header */}
        <section className="category-resources-header">
          <span className="page-label">CATEGORY RESOURCES</span>
          <h1>{category?.name || "Category Resources"}</h1>
          <p>
            {category?.description || "Explore resources available in this category."}
          </p>
        </section>

        {/* Error */}
        {error && (
          <div className="category-resources-error">
            <p>{error}</p>
            <button onClick={fetchCategoryResources}>Try Again</button>
          </div>
        )}

        {/* Resource Count */}
        {!error && (
          <div className="resource-count">
            {resources.length} {resources.length === 1 ? "Resource" : "Resources"}
          </div>
        )}

        {/* Empty State */}
        {!error && resources.length === 0 && (
          <div className="resources-empty">
            <div className="empty-icon">
              <FaBook />
            </div>
            <h2>No Resources Yet</h2>
            <p>There are no resources available in this category yet.</p>
            <Link to="/upload" className="upload-resource-button">
              Upload Resource
            </Link>
          </div>
        )}

        {/* Resources Grid */}
        {!error && resources.length > 0 && (
          <section className="resources-grid">
            {resources.map((resource) => (
              <ResourceCard
                key={resource._id || resource.id}
                resource={resource}
                onDownload={handleDownload}
                onOpenUploader={handleOpenUploader}
              />
            ))}
          </section>
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
    </main>
  );
}

export default CategoryResources;