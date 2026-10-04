import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resourceLoading, setResourceLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchMyResources();
  }, []);

  const [removingPhoto, setRemovingPhoto] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState({});

  const toggleDesc = (id) => {
    setExpandedDesc((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm("Are you sure you want to remove your profile picture?")) {
      return;
    }

    try {
      setRemovingPhoto(true);
      const data = new FormData();
      data.append("remove_image", "true");

      const response = await api.put("/users/profile", data);
      const updatedUser =
        response.data?.data ||
        response.data?.user ||
        response.data;

      setProfile(updatedUser);
      setUser(updatedUser);
    } catch (err) {
      console.error("Remove photo error:", err);
      alert(err.response?.data?.message || "Failed to remove photo.");
    } finally {
      setRemovingPhoto(false);
    }
  };

  // =========================
  // FETCH PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/profile");

      const userData =
        response.data?.data ||
        response.data?.user ||
        response.data;

      setProfile(userData);
      setUser(userData);
    } catch (error) {
      console.error("Profile error:", error);
      setError("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH MY RESOURCES
  // =========================
  const fetchMyResources = async () => {
    try {
      const response = await api.get("/resources");

      const data =
        response.data?.data ||
        response.data?.resources ||
        response.data;

      const allResources = Array.isArray(data) ? data : [];

      const currentUserId = user?._id || user?.id;

      const myResources = allResources.filter((resource) => {
        const resourceUser = resource.user_id || resource.user;

        if (!resourceUser) {
          return false;
        }

        const resourceUserId =
          typeof resourceUser === "object"
            ? resourceUser._id || resourceUser.id
            : resourceUser;

        return String(resourceUserId) === String(currentUserId);
      });

      setResources(myResources);
    } catch (error) {
      console.error("Resources error:", error);
    } finally {
      setResourceLoading(false);
    }
  };

  // =========================
  // DELETE RESOURCE
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/resources/${id}`);

      setResources((previousResources) =>
        previousResources.filter(
          (resource) => String(resource._id || resource.id) !== String(id)
        )
      );
    } catch (error) {
      console.error("Delete error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete resource."
      );
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="profile-loading">
        <p>Loading profile...</p>
      </div>
    );
  }

  // =========================
  // NOT LOGGED IN
  // =========================
  if (!profile && !user) {
    return (
      <div className="profile-empty">
        <h2>Please sign in</h2>
        <p>You need to sign in to view your profile.</p>

        <Link to="/signin" className="profile-primary-btn">
          Sign In
        </Link>
      </div>
    );
  }

  const currentProfile = profile || user;

  return (
    <main className="profile-page">
      <div className="profile-container">

        {/* =========================
            PROFILE CARD
        ========================= */}
        <section className="profile-card">

          <div className="profile-info">

            {/* Profile Image */}
            <div className="profile-avatar">
              {currentProfile?.profile_image ? (
                <img
                  src={currentProfile.profile_image}
                  alt="Profile"
                />
              ) : (
                <span>
                  {currentProfile?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </span>
              )}
            </div>

            {/* Profile Details */}
            <div className="profile-details">
              <h1>
                {currentProfile?.name || "User"}
              </h1>

              <p>
                {currentProfile?.email || "No email available"}
              </p>
            </div>

          </div>

          {/* Profile Actions */}
          <div className="profile-card-actions">
            <Link
              to="/profile/edit"
              className="edit-profile-btn"
            >
              Edit Profile
            </Link>

            {currentProfile?.profile_image && (
              <button
                type="button"
                className="remove-photo-profile-btn"
                onClick={handleRemovePhoto}
                disabled={removingPhoto}
                title="Remove profile image"
              >
                {removingPhoto ? "Removing..." : "Remove Photo"}
              </button>
            )}
          </div>

        </section>


        {/* =========================
            UPLOAD BUTTON
            OUTSIDE PROFILE CARD
        ========================= */}
        <div className="upload-resource-section">
          <Link
            to="/upload"
            className="upload-resource-btn"
          >
            <span>+</span>
            Upload Resource
          </Link>
        </div>


        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}


        {/* =========================
            MY RESOURCES
        ========================= */}
        <section className="my-resources">

          <div className="my-resources-header">
            <div>
              <h2>My Resources</h2>
              <p>
                Resources uploaded by you
              </p>
            </div>

            <span className="resource-count">
              {resources.length}{" "}
              {resources.length === 1
                ? "Resource"
                : "Resources"}
            </span>
          </div>


          {/* Loading */}
          {resourceLoading ? (
            <div className="resources-loading">
              <p>Loading resources...</p>
            </div>
          ) : resources.length === 0 ? (

            /* Empty State */
            <div className="my-resources-empty">
              <div className="empty-icon">📚</div>

              <h3>No resources yet</h3>

              <p>
                You haven't uploaded any resources yet.
              </p>

              <Link
                to="/upload"
                className="profile-primary-btn"
              >
                Upload Your First Resource
              </Link>
            </div>

          ) : (

            /* Resource Grid */
            <div className="my-resources-grid">

              {resources.map((resource) => {

                const resourceId =
                  resource._id || resource.id;

                return (
                  <article
                    className="my-resource-card"
                    key={resourceId}
                  >

                    {/* Thumbnail */}
                    <div className="my-resource-thumbnail">

                      {resource.thumbnail_url ? (
                        <img
                          src={resource.thumbnail_url}
                          alt={resource.title}
                        />
                      ) : (
                        <div className="default-thumbnail">
                          📄
                        </div>
                      )}

                    </div>


                    {/* Content */}
                    <div className="my-resource-content">

                      <span className="my-resource-category">
                        {resource.category_id?.name ||
                          resource.category?.name ||
                          "Resource"}
                      </span>

                      <h3>
                        {resource.title}
                      </h3>

                      <p className={`my-resource-desc ${!expandedDesc[resourceId] && resource.description?.length > 95 ? "clamped" : ""}`}>
                        {!expandedDesc[resourceId] && resource.description?.length > 95
                          ? `${resource.description.slice(0, 95)}...`
                          : resource.description}
                      </p>

                      {resource.description?.length > 95 && (
                        <button
                          type="button"
                          className="desc-toggle-btn"
                          onClick={() => toggleDesc(resourceId)}
                          style={{
                            background: "none",
                            border: "none",
                            padding: "4px 0",
                            color: "var(--primary, #2563eb)",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            marginBottom: "10px",
                          }}
                        >
                          {expandedDesc[resourceId] ? "Show Less ↑" : "Show More ↓"}
                        </button>
                      )}


                      {/* Footer */}
                      <div className="my-resource-footer">

                        <span>
                          {resource.downloads || 0} downloads
                        </span>

                        <div className="resource-actions">

                          {/* View */}
                          {resource.file_url && (
                            <a
                              href={resource.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="resource-view-btn"
                            >
                              View
                            </a>
                          )}

                          {/* Edit */}
                          <Link
                            to={`/resources/edit/${resourceId}`}
                            className="resource-edit-btn"
                          >
                            Edit
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            className="resource-delete-btn"
                            onClick={() =>
                              handleDelete(resourceId)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default Profile;