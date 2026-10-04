import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaBook, FaDownload, FaFilePdf, FaExternalLinkAlt, FaChevronDown, FaChevronUp } from "../utils/icons";
import api from "../services/api";
import { downloadResourceFile } from "../utils/downloadHelper";
import "../styles/Modals.css";

function UploaderProfileModal({ uploader, currentResource, onClose }) {
  const [uploaderResources, setUploaderResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [downloadingIds, setDownloadingIds] = useState(new Set());

  if (!uploader) return null;

  const uploaderId = uploader._id || uploader.id;

  // Fetch uploader's resources on mount
  useEffect(() => {
    if (!uploaderId) return;

    const fetchUploaderResources = async () => {
      try {
        setLoadingResources(true);
        const response = await api.get(`/users/${uploaderId}`);
        const data = response.data;

        if (data.success && data.resources) {
          setUploaderResources(data.resources);
          const total = data.resources.reduce((sum, r) => sum + (r.downloads || 0), 0);
          setTotalDownloads(total);
        }
      } catch (err) {
        console.warn("Failed to fetch uploader resources:", err?.message || err);
      } finally {
        setLoadingResources(false);
      }
    };

    fetchUploaderResources();
  }, [uploaderId]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleDescription = (resourceId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [resourceId]: !prev[resourceId],
    }));
  };

  const handleResourceDownload = async (resource) => {
    const resourceId = resource._id || resource.id;
    if (downloadingIds.has(resourceId)) return;

    try {
      setDownloadingIds((prev) => new Set(prev).add(resourceId));

      // Optimistically update count in the local list
      setUploaderResources((prev) =>
        prev.map((r) =>
          (r._id || r.id) === resourceId
            ? { ...r, downloads: (r.downloads || 0) + 1 }
            : r
        )
      );
      setTotalDownloads((prev) => prev + 1);

      await downloadResourceFile(resource);
    } finally {
      setTimeout(() => {
        setDownloadingIds((prev) => {
          const next = new Set(prev);
          next.delete(resourceId);
          return next;
        });
      }, 800);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="uploader-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="uploader-modal-header">
          <button className="uploader-modal-close" onClick={onClose} aria-label="Close modal">
            <IoClose />
          </button>

          <div className="uploader-modal-avatar">
            {uploader.profile_image ? (
              <img src={uploader.profile_image} alt={uploader.name || "Uploader"} />
            ) : (
              <span className="uploader-modal-initials">
                {getInitials(uploader.name)}
              </span>
            )}
          </div>

          <h2 className="uploader-modal-name">{uploader.name || "Community Member"}</h2>
          <p className="uploader-modal-email">
            {uploader.email || "Community Knowledge Contributor"}
          </p>
        </div>

        {/* Body */}
        <div className="uploader-modal-body">
          {/* Quick Stats */}
          <div className="uploader-stats-row">
            <div className="uploader-stat-box">
              <div className="uploader-stat-num">
                <FaBook style={{ display: "inline", marginRight: "6px", fontSize: "16px" }} />
                {loadingResources ? "..." : uploaderResources.length}
              </div>
              <div className="uploader-stat-label">Resources Shared</div>
            </div>

            <div className="uploader-stat-box">
              <div className="uploader-stat-num">
                <FaDownload style={{ display: "inline", marginRight: "6px", fontSize: "15px" }} />
                {loadingResources ? "..." : totalDownloads}
              </div>
              <div className="uploader-stat-label">Total Downloads</div>
            </div>
          </div>

          {/* All Uploaded Resources */}
          <div className="uploader-resources-section">
            <h3 className="uploader-resources-title">
              <FaBook style={{ fontSize: "14px" }} />
              All Uploaded Resources
              {!loadingResources && (
                <span className="uploader-resources-count">{uploaderResources.length}</span>
              )}
            </h3>

            {loadingResources ? (
              <div className="uploader-resources-loading">
                <div className="uploader-resources-spinner"></div>
                <span>Loading resources...</span>
              </div>
            ) : uploaderResources.length === 0 ? (
              <div className="uploader-resources-empty">
                No resources uploaded yet.
              </div>
            ) : (
              <div className="uploader-resources-list">
                {uploaderResources.map((res) => {
                  const resId = res._id || res.id;
                  const desc = res.description || "";
                  const isLongDesc = desc.length > 80;
                  const isDescExpanded = expandedDescriptions[resId];
                  const isDownloading = downloadingIds.has(resId);

                  return (
                    <div className="uploader-resource-item" key={resId}>
                      {/* Thumbnail */}
                      <div className="uploader-resource-thumb">
                        {res.thumbnail_url ? (
                          <img src={res.thumbnail_url} alt={res.title} />
                        ) : (
                          <div className="uploader-resource-thumb-icon">
                            <FaFilePdf />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="uploader-resource-info">
                        <h4 className="uploader-resource-name">{res.title}</h4>

                        {/* Description with show more/less */}
                        {desc && (
                          <div className="uploader-resource-desc-wrap">
                            <p className="uploader-resource-desc">
                              {!isDescExpanded && isLongDesc
                                ? `${desc.slice(0, 80)}...`
                                : desc}
                            </p>
                            {isLongDesc && (
                              <button
                                type="button"
                                className="uploader-resource-desc-toggle"
                                onClick={() => toggleDescription(resId)}
                              >
                                {isDescExpanded ? (
                                  <>Show Less <FaChevronUp style={{ fontSize: "9px" }} /></>
                                ) : (
                                  <>Show More <FaChevronDown style={{ fontSize: "9px" }} /></>
                                )}
                              </button>
                            )}
                          </div>
                        )}

                        {/* Category */}
                        {res.category_id?.name && (
                          <span className="uploader-resource-category">
                            {res.category_id.name}
                          </span>
                        )}

                        {/* Resource Footer */}
                        <div className="uploader-resource-footer">
                          <span className="uploader-resource-downloads" title="Downloads">
                            <FaDownload style={{ fontSize: "10px" }} />
                            {res.downloads || 0}
                          </span>

                          <div className="uploader-resource-actions">
                            <button
                              type="button"
                              className="uploader-resource-dl-btn"
                              onClick={() => handleResourceDownload(res)}
                              disabled={isDownloading}
                              title="Download this resource"
                            >
                              <FaDownload style={{ fontSize: "10px" }} />
                              {isDownloading ? "..." : "Download"}
                            </button>

                            {res.file_url && (
                              <a
                                href={res.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="uploader-resource-view-btn"
                                title="View in new tab"
                              >
                                <FaExternalLinkAlt style={{ fontSize: "9px" }} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="uploader-modal-actions">
            <button type="button" className="uploader-close-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploaderProfileModal;
