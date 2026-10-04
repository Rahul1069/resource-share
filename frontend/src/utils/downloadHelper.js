import api from "../services/api";

export const downloadResourceFile = async (resource) => {
  if (!resource) return;

  const resourceId = resource._id || resource.id;

  // 1. Record download on backend to increment count
  try {
    await api.post(`/resources/${resourceId}/download`);
  } catch (err) {
    console.warn("Backend download recording notice:", err?.message || err);
  }

  // 2. Trigger file download to user's computer
  const fileUrl = resource.file_url || resource.fileUrl;
  if (!fileUrl) return;

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Fetch failed");
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    const ext = fileUrl.split(".").pop().split("?")[0] || "pdf";
    const filename = `${(resource.title || "resource").replace(/[^a-zA-Z0-9_-]/g, "_")}.${ext}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
  } catch {
    // Direct link fallback
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = resource.title || "resource";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
