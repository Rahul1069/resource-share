import { useEffect, useState } from "react";
import api from "../services/api";
import { FaBook } from "../utils/icons";
import ResourceCard from "../components/ResourceCard";
import UploaderProfileModal from "../components/UploaderProfileModal";
import ChatModal from "../components/ChatModal";
import { downloadResourceFile } from "../utils/downloadHelper";
import { useAuth } from "../context/AuthContext";
import "../styles/Resources.css";

function Resources() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals
  const [selectedUploader, setSelectedUploader] = useState(null);
  const [chatUploader, setChatUploader] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

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
    } catch (err) {
      console.error("Fetch resources error:", err);

      if (err.response) {
        setError(
          err.response.data?.message || "Failed to load resources."
        );
      } else if (err.request) {
        setError("Unable to connect to server.");
      } else {
        setError("Something went wrong.");
      }

      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  // Requirement 4: download button and download count increment
  const handleDownload = async (resource) => {
    const resourceId = resource._id || resource.id;

    // Immediately increment count in UI
    setResources((prev) =>
      prev.map((r) =>
        (r._id || r.id) === resourceId
          ? { ...r, downloads: (r.downloads || 0) + 1 }
          : r
      )
    );

    // Call download helper to record on backend and initiate file download
    await downloadResourceFile(resource);
  };

  // Requirement 3: Click uploader name/image to open profile and option to chat
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

  // Loading
  if (loading) {
    return (
      <main className="resources-page">
        <div className="resources-container">
          <div className="resources-header">
            <span className="resources-label">RESOURCE SHARE</span>
            <h1>Resources</h1>
            <p>
              Explore notes, study materials, projects and other useful resources
              shared by the community.
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
            <span className="resources-label">RESOURCE SHARE</span>
            <h1>Resources</h1>
            <p>
              Explore notes, study materials, projects and other useful resources
              shared by the community.
            </p>
          </div>

          <div className="resources-error">{error}</div>

          <div className="resources-error-action">
            <button
              className="resources-retry-btn"
              onClick={fetchResources}
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
          <span className="resources-label">RESOURCE SHARE</span>
          <h1>Resources</h1>
          <p>
            Explore notes, study materials, projects and other useful resources
            shared by the community.
          </p>
        </div>

        {/* Empty State */}
        {resources.length === 0 ? (
          <div className="resources-empty">
            <div className="empty-icon">
              <FaBook />
            </div>
            <h2>No Resources Available</h2>
            <p>
              There are no resources available at the moment. Please check back later.
            </p>
          </div>
        ) : (
          /* Resources Grid */
          <div className="resources-grid">
            {resources.map((resource) => (
              <ResourceCard
                key={resource._id || resource.id}
                resource={resource}
                onDownload={handleDownload}
                onOpenUploader={handleOpenUploader}
              />
            ))}
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
    </main>
  );
}

export default Resources;