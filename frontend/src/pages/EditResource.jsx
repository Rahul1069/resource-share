import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/Upload.css";

function EditResource() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
  });

  const [categories, setCategories] = useState([]);

  const [resource, setResource] = useState(null);

  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // Default Thumbnail
  // ========================================

  const getDefaultThumbnail = (selectedFile) => {
    if (!selectedFile) {
      return "";
    }

    const fileName = selectedFile.name.toLowerCase();

    if (fileName.endsWith(".pdf")) {
      return "/thumbnails/pdf.png";
    }

    if (
      fileName.endsWith(".ppt") ||
      fileName.endsWith(".pptx")
    ) {
      return "/thumbnails/ppt.png";
    }

    if (
      fileName.endsWith(".doc") ||
      fileName.endsWith(".docx")
    ) {
      return "/thumbnails/doc.png";
    }

    if (
      fileName.endsWith(".xls") ||
      fileName.endsWith(".xlsx")
    ) {
      return "/thumbnails/excel.png";
    }

    if (
      fileName.endsWith(".zip") ||
      fileName.endsWith(".rar")
    ) {
      return "/thumbnails/zip.png";
    }

    if (
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg") ||
      fileName.endsWith(".png") ||
      fileName.endsWith(".webp")
    ) {
      return "/thumbnails/image.png";
    }

    return "/thumbnails/file.png";
  };

  // ========================================
  // Fetch Resource + Categories
  // ========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [resourceResponse, categoryResponse] =
          await Promise.all([
            api.get(`/resources/${id}`),
            api.get("/categories"),
          ]);

        // Resource
        const resourceData =
          resourceResponse.data?.data ||
          resourceResponse.data?.resource ||
          resourceResponse.data;

        setResource(resourceData);

        setFormData({
          title: resourceData?.title || "",
          description: resourceData?.description || "",
          category_id:
            typeof resourceData?.category_id === "object"
              ? resourceData.category_id?._id ||
                resourceData.category_id?.id ||
                ""
              : resourceData?.category_id || "",
        });

        // Categories
        const categoryData =
          categoryResponse.data?.data ||
          categoryResponse.data?.categories ||
          categoryResponse.data;

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load resource:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load resource."
        );
      } finally {
        setLoading(false);
        setCategoryLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ========================================
  // Handle Input
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ========================================
  // Handle Resource File
  // ========================================

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    setFile(selectedFile);

    setError("");
    setSuccess("");
  };

  // ========================================
  // Handle Thumbnail
  // ========================================

  const handleThumbnailChange = (e) => {
    const selectedThumbnail =
      e.target.files[0];

    if (!selectedThumbnail) {
      setThumbnail(null);
      return;
    }

    setThumbnail(selectedThumbnail);

    setError("");
    setSuccess("");
  };

  // ========================================
  // Submit
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Please enter a resource title.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter a description.");
      return;
    }

    if (!formData.category_id) {
      setError("Please select a category.");
      return;
    }

    setSaving(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append(
        "description",
        formData.description
      );
      data.append(
        "category_id",
        formData.category_id
      );

      /*
        File is optional during editing.

        If user selects a new file,
        send the new file.
      */

      if (file) {
        data.append("file", file);
      }

      /*
        Thumbnail is optional.

        If user selects a new thumbnail,
        send it.

        Otherwise keep existing thumbnail_url.
      */

      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      } else if (resource?.thumbnail_url) {
        data.append(
          "thumbnail_url",
          resource.thumbnail_url
        );
      } else if (file) {
        /*
          Frontend default thumbnail.
        */

        const defaultThumbnail =
          getDefaultThumbnail(file);

        if (defaultThumbnail) {
          data.append(
            "thumbnail_url",
            defaultThumbnail
          );
        }
      }

      const response = await api.put(
        `/resources/${id}`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "Update response:",
        response.data
      );

      setSuccess(
        "Resource updated successfully!"
      );

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error(
        "Update resource error:",
        error
      );

      if (error.response) {
        setError(
          error.response.data?.message ||
            "Failed to update resource."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to server."
        );
      } else {
        setError(
          "Something went wrong."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // Loading
  // ========================================

  if (loading) {
    return (
      <main className="upload-page">
        <div className="upload-container">

          <div className="upload-header">
            <span className="upload-label">
              RESOURCE SHARE
            </span>

            <h1>
              Edit Resource
            </h1>

            <p>
              Update your resource information.
            </p>
          </div>

          <div className="upload-card">
            <div className="upload-loading">
              Loading resource...
            </div>
          </div>

        </div>
      </main>
    );
  }

  // ========================================
  // Error
  // ========================================

  if (!resource) {
    return (
      <main className="upload-page">
        <div className="upload-container">

          <div className="upload-header">
            <span className="upload-label">
              RESOURCE SHARE
            </span>

            <h1>
              Edit Resource
            </h1>
          </div>

          <div className="upload-card">

            <div className="upload-message upload-error">
              {error ||
                "Resource not found."}
            </div>

            <div className="upload-actions">

              <button
                type="button"
                className="upload-cancel"
                onClick={() =>
                  navigate("/profile")
                }
              >
                Back to Profile
              </button>

            </div>

          </div>

        </div>
      </main>
    );
  }

  // ========================================
  // Main UI
  // ========================================

  return (
    <main className="upload-page">

      <div className="upload-container">

        {/* Header */}

        <div className="upload-header">

          <span className="upload-label">
            RESOURCE SHARE
          </span>

          <h1>
            Edit Resource
          </h1>

          <p>
            Update your resource information
            and keep it useful for the community.
          </p>

        </div>

        {/* Form Card */}

        <div className="upload-card">

          <form onSubmit={handleSubmit}>

            {/* Error */}

            {error && (
              <div className="upload-message upload-error">
                {error}
              </div>
            )}

            {/* Success */}

            {success && (
              <div className="upload-message upload-success">
                {success}
              </div>
            )}

            {/* Title */}

            <div className="upload-group">

              <label htmlFor="title">
                Resource Title
              </label>

              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter resource title"
                value={formData.title}
                onChange={handleChange}
              />

            </div>

            {/* Description */}

            <div className="upload-group">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Describe your resource..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
              />

            </div>

            {/* Category */}

            <div className="upload-group">

              <label htmlFor="category_id">
                Category
              </label>

              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                disabled={categoryLoading}
              >

                <option value="">
                  {categoryLoading
                    ? "Loading categories..."
                    : "Select a category"}
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={
                        category._id ||
                        category.id
                      }
                      value={
                        category._id ||
                        category.id
                      }
                    >
                      {category.name}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* Existing File */}

            <div className="upload-group">

              <label>
                Current Resource File
              </label>

              <div className="current-file">

                <span>
                  📄
                </span>

                <div>
                  <strong>
                    {resource.file_url
                      ? "Current resource file"
                      : "No file available"}
                  </strong>

                  {resource.file_url && (
                    <a
                      href={
                        resource.file_url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View current file
                    </a>
                  )}
                </div>

              </div>

            </div>

            {/* New File */}

            <div className="upload-group">

              <label htmlFor="resource-file">
                Replace Resource File
              </label>

              <div className="file-box">

                <input
                  type="file"
                  id="resource-file"
                  onChange={handleFileChange}
                />

                {file ? (
                  <p>
                    New file: {file.name}
                  </p>
                ) : (
                  <p>
                    Leave empty to keep the
                    current file.
                  </p>
                )}

              </div>

            </div>

            {/* Current Thumbnail */}

            <div className="upload-group">

              <label>
                Current Thumbnail
              </label>

              <div className="current-thumbnail">

                {resource.thumbnail_url ? (

                  <img
                    src={
                      resource.thumbnail_url
                    }
                    alt="Current thumbnail"
                  />

                ) : (

                  <div>
                    📄
                  </div>

                )}

              </div>

            </div>

            {/* New Thumbnail */}

            <div className="upload-group">

              <label htmlFor="thumbnail">
                Replace Thumbnail
              </label>

              <div className="file-box">

                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={
                    handleThumbnailChange
                  }
                />

                {thumbnail ? (
                  <p>
                    New thumbnail:{" "}
                    {thumbnail.name}
                  </p>
                ) : (
                  <p>
                    Leave empty to keep the
                    current thumbnail.
                  </p>
                )}

              </div>

            </div>

            {/* Actions */}

            <div className="upload-actions">

              <button
                type="button"
                className="upload-cancel"
                onClick={() =>
                  navigate("/profile")
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="upload-submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </main>
  );
}

export default EditResource;