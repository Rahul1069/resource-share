import { IoClose, IoChatbubbleEllipses, IoPersonOutline } from "react-icons/io5";
import { FaBook, FaDownload } from "../utils/icons";
import "../styles/Modals.css";

function UploaderProfileModal({ uploader, currentResource, onClose, onStartChat }) {
  if (!uploader) return null;

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
                1+
              </div>
              <div className="uploader-stat-label">Resources Shared</div>
            </div>

            <div className="uploader-stat-box">
              <div className="uploader-stat-num">
                <FaDownload style={{ display: "inline", marginRight: "6px", fontSize: "15px" }} />
                {currentResource?.downloads || 0}
              </div>
              <div className="uploader-stat-label">Total Downloads</div>
            </div>
          </div>

          {/* Current Resource context */}
          {currentResource && (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "12px 14px",
                marginBottom: "20px",
                border: "1px solid #e2e8f0",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  color: "#64748b",
                  letterSpacing: "0.5px",
                }}
              >
                Shared Resource
              </span>
              <h4
                style={{
                  margin: "4px 0 2px",
                  fontSize: "14px",
                  color: "#0f172a",
                  fontWeight: "600",
                }}
              >
                {currentResource.title}
              </h4>
              {currentResource.category_id?.name && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#2563eb",
                    fontWeight: "500",
                  }}
                >
                  Category: {currentResource.category_id.name}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="uploader-modal-actions">
            <button
              type="button"
              className="uploader-chat-btn"
              onClick={() => {
                onClose();
                onStartChat(uploader);
              }}
            >
              <IoChatbubbleEllipses style={{ fontSize: "18px" }} />
              Chat with {uploader.name ? uploader.name.split(" ")[0] : "Uploader"}
            </button>

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
