import { useState } from "react";
import api from "../api";
import { XIcon } from "./Icons";

export default function ImageUpload({ value, onChange, label = "Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await api.post("/upload", fd);
      onChange(res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div>
      <label>{label}</label>

      {value && (
        <div className="upload-preview">
          <img src={value} alt="preview" />
          <button type="button" className="icon-btn" title="Remove" onClick={() => onChange("")}>
            <XIcon size={14} />
          </button>
        </div>
      )}

      <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
      {error && <p className="small" style={{ color: "var(--red)", marginTop: 4 }}>{error}</p>}
      <p className="muted small" style={{ marginTop: 5 }}>
        {uploading ? "Uploading..." : "JPG / PNG, max 5 MB"}
      </p>
    </div>
  );
}
