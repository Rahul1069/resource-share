import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Upload.css";


// Default thumbnail according to file type
const getThumbnailPath = (file) => {
  if (!file) return "/thumbnails/file.png";

  const extension = file.name
    .split(".")
    .pop()
    .toLowerCase();

  if (extension === "pdf") {
    return "/thumbnails/pdf.png";
  }

  if (extension === "ppt" || extension === "pptx") {
    return "/thumbnails/ppt.png";
  }

  if (extension === "doc" || extension === "docx") {
    return "/thumbnails/doc.png";
  }

  if (
    extension === "xls" ||
    extension === "xlsx" ||
    extension === "csv"
  ) {
    return "/thumbnails/excel.png";
  }

  if (
    extension === "zip" ||
    extension === "rar" ||
    extension === "7z"
  ) {
    return "/thumbnails/zip.png";
  }

  if (file.type.startsWith("image/")) {
    return "/thumbnails/image.png";
  }

  return "/thumbnails/file.png";
};


// Convert public thumbnail into File
const getDefaultThumbnailFile = async (file) => {
  const thumbnailPath = getThumbnailPath(file);

  const response = await fetch(thumbnailPath);

  if (!response.ok) {
    throw new Error("Default thumbnail not found");
  }

  const blob = await response.blob();

  return new File(
    [blob],
    thumbnailPath.split("/").pop(),
    {
      type: blob.type,
    }
  );
};


function Upload() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");

        const data =
          response.data?.categories ||
          response.data?.data ||
          response.data;

        setCategories(
          Array.isArray(data) ? data : []
        );

      } catch (error) {
        console.error("Category Error:", error);

        setError("Failed to load categories");

      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };


  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError("");
  };


  const handleThumbnailChange = (e) => {
    const selectedThumbnail = e.target.files?.[0];

    if (!selectedThumbnail) {
      setThumbnail(null);
      return;
    }

    setThumbnail(selectedThumbnail);
    setError("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    if (!file) {
      setError("Please select a resource file");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // Text fields
      data.append("title", formData.title.trim());
      data.append(
        "description",
        formData.description.trim()
      );

      // IMPORTANT
      data.append("category", formData.category);

      // IMPORTANT
      data.append("file", file);


      // Thumbnail
      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      } else {
        const defaultThumbnail =
          await getDefaultThumbnailFile(file);

        data.append(
          "thumbnail",
          defaultThumbnail
        );
      }


      // Send multipart/form-data
      await api.post("/resources", data);

      setSuccess("Resource uploaded successfully!");

      setTimeout(() => {
        navigate("/profile");
      }, 1000);

    } catch (error) {
      console.error("Upload Error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to upload resource"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="upload-page">

      <div className="upload-container">

        <div className="upload-header">
          <h1>Upload Resource</h1>

          <p>
            Share your study material with the
            ResourceShare community.
          </p>
        </div>


        {error && (
          <div className="upload-message upload-error">
            {error}
          </div>
        )}


        {success && (
          <div className="upload-message upload-success">
            {success}
          </div>
        )}


        <form
          className="upload-form"
          onSubmit={handleSubmit}
        >

          {/* Title */}
          <div className="form-group">

            <label htmlFor="title">
              Resource Title
            </label>

            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter resource title"
            />

          </div>


          {/* Description */}
          <div className="form-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your resource"
              rows="5"
            />

          </div>


          {/* Category */}
          <div className="form-group">

            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={categoryLoading}
            >

              <option value="">
                {categoryLoading
                  ? "Loading categories..."
                  : "Select category"}
              </option>

              {categories.map((category) => (
                <option
                  key={category._id || category.id}
                  value={category._id || category.id}
                >
                  {category.name}
                </option>
              ))}

            </select>

          </div>


          {/* Resource File */}
          <div className="form-group">

            <label htmlFor="file">
              Resource File
            </label>

            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
            />

            {file && (
              <p className="file-name">
                Selected: {file.name}
              </p>
            )}

          </div>


          {/* Thumbnail */}
          <div className="form-group">

            <label htmlFor="thumbnail">
              Thumbnail
            </label>

            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
            />

            <p className="form-help">
              Optional. A default thumbnail will be
              automatically selected if you don't upload one.
            </p>

          </div>


          {/* Submit */}
          <button
            type="submit"
            className="upload-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Uploading..."
              : "Upload Resource"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Upload;