import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/EditProfile.css";

function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [removeImage, setRemoveImage] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // LOAD PROFILE
  // =========================
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/profile");

      const userData =
        response.data?.data ||
        response.data?.user ||
        response.data;

      setFormData({
        name: userData?.name || "",
        email: userData?.email || "",
      });

      setPreviewImage(userData?.profile_image || "");
      setRemoveImage(false);

    } catch (error) {
      console.error("Profile error:", error);
      setError(
        error.response?.data?.message ||
          "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================
  // IMAGE CHANGE
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Check image type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    // Check image size - 2MB
    if (file.size > 2 * 1024 * 1024) {
      setError("Profile image must be less than 2MB.");
      return;
    }

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
    setRemoveImage(false);

    setError("");
    setSuccess("");
  };

  // =========================
  // REMOVE IMAGE
  // =========================
  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewImage("");
    setRemoveImage(true);

    setError("");
    setSuccess("");
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name.trim()) {
    setError("Name is required.");
    return;
  }

  setSaving(true);
  setError("");
  setSuccess("");

  try {
    const data = new FormData();

    data.append("name", formData.name.trim());

    if (profileImage) {
      data.append("profile_image", profileImage);
    } else if (removeImage) {
      data.append("remove_image", "true");
    }

    const response = await api.put(
      "/users/profile",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const updatedUser =
      response.data?.data ||
      response.data?.user ||
      response.data;

    setUser(updatedUser);

    setSuccess("Profile updated successfully.");

    setTimeout(() => {
      navigate("/profile");
    }, 700);

  } catch (error) {
    console.error("Update profile error:", error);

    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);

    setError(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to update profile."
    );
  } finally {
    setSaving(false);
  }
};

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="edit-profile-loading">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <main className="edit-profile-page">
      <div className="edit-profile-container">

        {/* Header */}
        <div className="edit-profile-header">
          <div>
            <h1>Edit Profile</h1>
            <p>
              Update your profile information
            </p>
          </div>

          <Link
            to="/profile"
            className="back-profile-btn"
          >
            Back to Profile
          </Link>
        </div>


        {/* Edit Card */}
        <section className="edit-profile-card">

          <form onSubmit={handleSubmit}>

            {/* =========================
                PROFILE IMAGE
            ========================= */}
            <div className="edit-image-section">

              <div className="edit-profile-avatar">

                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile preview"
                  />
                ) : (
                  <span>
                    {formData.name
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </span>
                )}

              </div>

              <div className="image-actions">

                <label
                  htmlFor="profile-image"
                  className="change-image-btn"
                >
                  Change Photo
                </label>

                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {previewImage && (
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </button>
                )}

                <p>
                  JPG, PNG or WEBP. Maximum 2MB.
                </p>

              </div>

            </div>


            {/* =========================
                NAME
            ========================= */}
            <div className="edit-form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />

            </div>


            {/* =========================
                EMAIL
            ========================= */}
            <div className="edit-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
              />

              <small>
                Email address cannot be changed.
              </small>

            </div>


            {/* =========================
                MESSAGE
            ========================= */}
            {error && (
              <div className="edit-profile-message edit-profile-error">
                {error}
              </div>
            )}

            {success && (
              <div className="edit-profile-message edit-profile-success">
                {success}
              </div>
            )}


            {/* =========================
                ACTIONS
            ========================= */}
            <div className="edit-profile-actions">

              <Link
                to="/profile"
                className="cancel-profile-btn"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="save-profile-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </section>

      </div>
    </main>
  );
}

export default EditProfile;