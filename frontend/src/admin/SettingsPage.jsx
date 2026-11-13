import { useEffect, useState } from "react";
import api from "../api";
import ImageUpload from "../components/ImageUpload";

export default function SettingsPage() {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/settings").then((res) => setForm(res.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.put("/settings", form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!form) return <p className="muted">Loading settings...</p>;

  return (
    <div className="narrow-page">
      <div className="page-head">
        <div>
          <span className="lux-label">Configuration</span>
          <h1>System Settings</h1>
          <p className="muted">Hotel branding, taxes and policies.</p>
        </div>
      </div>

      <form className="card" onSubmit={submit}>
        {saved && <div className="alert success">Settings saved!</div>}

        <label>Hotel Name</label>
        <input value={form.hotelName} onChange={(e) => setForm((f) => ({ ...f, hotelName: e.target.value }))} />

        <div style={{ margin: "14px 0" }}>
          <ImageUpload
            label="Website Logo"
            value={form.logoUrl}
            onChange={(url) => setForm((f) => ({ ...f, logoUrl: url }))}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <ImageUpload
            label="Favicon (browser tab icon)"
            value={form.faviconUrl}
            onChange={(url) => setForm((f) => ({ ...f, faviconUrl: url }))}
          />
        </div>

        <label>Tax Percentage (%)</label>
        <input type="number" value={form.taxPercent} onChange={(e) => setForm((f) => ({ ...f, taxPercent: Number(e.target.value) }))} />

        <label>Check-In Time</label>
        <input value={form.checkInTime} onChange={(e) => setForm((f) => ({ ...f, checkInTime: e.target.value }))} />

        <label>Check-Out Time</label>
        <input value={form.checkOutTime} onChange={(e) => setForm((f) => ({ ...f, checkOutTime: e.target.value }))} />

        <label>Cancellation Policy</label>
        <textarea rows="3" value={form.cancellationPolicy}
          onChange={(e) => setForm((f) => ({ ...f, cancellationPolicy: e.target.value }))} />

        <button className="btn btn-gold">Save Settings</button>
        <p className="muted small" style={{ marginTop: 10 }}>
          Logo/favicon change karne ke baad page refresh karo — sab jagah update ho jayega.
        </p>
      </form>
    </div>
  );
}
