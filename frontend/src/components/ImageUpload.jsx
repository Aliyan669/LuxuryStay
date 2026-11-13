import { useState } from "react";
import api from "../api";
import { XIcon } from "./Icons";

// Vercel ka request body limit ~4.5MB hota hai, is liye 4MB rakha hai
const MAX_MB = 4;

export default function ImageUpload({ value, onChange, label = "Image", onUploading }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [urlText, setUrlText] = useState("");

  const setBusy = (busy) => {
    setUploading(busy);
    if (onUploading) onUploading(busy);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Image ${MAX_MB} MB se choti honi chahiye (aapki ${(file.size / 1024 / 1024).toFixed(1)} MB)`);
      return;
    }

    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await api.post("/upload", fd);
      if (!res.data.url) throw new Error("Upload se URL nahi mila");
      onChange(res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Upload failed");
    }
    setBusy(false);
  };

  const applyUrl = () => {
    const url = urlText.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      setError("URL https:// se shuru hona chahiye");
      return;
    }
    setError("");
    onChange(url);
    setUrlText("");
    setShowUrl(false);
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

      <p className="muted small" style={{ marginTop: 5 }}>
        {uploading ? "Uploading..." : `JPG / PNG / WEBP, max ${MAX_MB} MB`}
      </p>

      {!showUrl ? (
        <button
          type="button"
          className="link-btn"
          onClick={() => { setShowUrl(true); setError(""); }}
        >
          Image URL
        </button>
      ) : (
        <div className="url-row">
          <input
            placeholder="https://example.com/room.jpg"
            value={urlText}
            onChange={(e) => setUrlText(e.target.value)}
          />
          <button type="button" className="btn btn-outline-light" onClick={applyUrl}>Use</button>
          <button type="button" className="icon-btn" title="Cancel"
            onClick={() => { setShowUrl(false); setUrlText(""); setError(""); }}>
            <XIcon size={14} />
          </button>
        </div>
      )}

      {error && <p className="small" style={{ color: "var(--red)", marginTop: 4 }}>{error}</p>}
    </div>
  );
}
