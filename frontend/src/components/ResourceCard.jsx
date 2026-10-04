import { useState } from "react";
import {
  FaBook,
  FaFilePdf,
  FaDownload,
  FaExternalLinkAlt,
  FaChevronDown,
  FaChevronUp,
} from "../utils/icons";
import "../styles/ResourceCard.css";

function ResourceCard({ resource, onDownload, onOpenUploader }) {
  const [showMore, setShowMore] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const description = resource.description || "";
  const isLongDescription = description.length > 95;

  const getUserInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const user = resource.user_id && typeof resource.user_id === "object"
    ? resource.user_id
    : resource.user && typeof resource.user === "object"
    ? resource.user
    : null;

  const handleDownloadClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (downloading) return;

    try {
      setDownloading(true);
      if (onDownload) {
        await onDownload(resource);
      }
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const handleUploaderClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenUploader && user) {
      onOpenUploader(user, resource);
    }
  };

  const categoryName =
    resource.category_id?.name ||
    (typeof resource.category_id === "string" ? resource.category_id : null) ||
    resource.category?.name ||
    null;

  return (
    <article className="resource-card">
      {/* Thumbnail */}
      <div className="resource-thumbnail">
        {resource.thumbnail_url ? (
          <img src={resource.thumbnail_url} alt={resource.title || "Resource"} />
        ) : (
          <div className="resource-file-icon">
            <FaFilePdf />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="resource-content">
        <h2 className="resource-title">{resource.title}</h2>

        {/* Description with Show More / Show Less */}
        <div className="resource-desc-wrapper">
          <p className={`resource-desc-text ${!showMore && isLongDescription ? "clamped" : ""}`}>
            {!showMore && isLongDescription
              ? `${description.slice(0, 95)}...`
              : description}
          </p>

          {isLongDescription && (
            <button
              type="button"
              className="desc-toggle-btn"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? (
                <>
                  Show Less <FaChevronUp style={{ fontSize: "10px" }} />
                </>
              ) : (
                <>
                  Show More <FaChevronDown style={{ fontSize: "10px" }} />
                </>
              )}
            </button>
          )}
        </div>

        {/* Clickable Uploader Info */}
        {user && (
          <div
            className="resource-user-clickable"
            onClick={handleUploaderClick}
            title={`View ${user.name || "user"}'s profile & resources`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleUploaderClick(e)}
          >
            {user.profile_image ? (
              <img
                src={user.profile_image}
                alt={user.name || "User"}
                className="resource-user-avatar"
              />
            ) : (
              <div className="resource-user-initials">
                {getUserInitials(user.name)}
              </div>
            )}

            <div className="resource-user-meta">
              <span className="resource-user-name">
                {user.name || "Unknown User"}
              </span>
              <span className="resource-user-role">Click to view profile</span>
            </div>
          </div>
        )}

        {/* Category Badge */}
        {categoryName && (
          <span className="resource-category-badge">{categoryName}</span>
        )}

        {/* Footer */}
        <div className="resource-footer">
          <span className="download-count" title="Total downloads">
            <FaDownload className="download-icon" />
            {resource.downloads || 0}
          </span>

          <div className="resource-actions-group">
            {/* Download Button */}
            <button
              type="button"
              className="resource-download-btn"
              onClick={handleDownloadClick}
              disabled={downloading}
              title="Download resource and increment download count"
            >
              <FaDownload style={{ fontSize: "11px" }} />
              {downloading ? "Downloading..." : "Download"}
            </button>

            {/* View Button */}
            {resource.file_url && (
              <a
                href={resource.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-view-btn"
                title="View in new tab"
              >
                View <FaExternalLinkAlt className="view-icon" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ResourceCard;
