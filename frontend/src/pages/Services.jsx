import { useEffect, useState } from "react";
import api from "../api";

const types = ["room-service", "wake-up-call", "transport", "laundry", "other"];

export default function Services() {
  const [requests, setRequests] = useState([]);
  const [type, setType] = useState("room-service");
  const [details, setDetails] = useState("");
  const [sent, setSent] = useState(false);

  const load = () => api.get("/services/my").then((res) => setRequests(res.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/services", { type, details });
    setDetails("");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    load();
  };

  const badge = { pending: "badge orange", approved: "badge blue", completed: "badge green", rejected: "badge red" };

  return (
    <div className="container section">
      <h2 className="section-title">Guest Services</h2>
      <p className="muted">Request room service, wake-up calls, transport and more.</p>

      <div className="two-col">
        <form className="card" onSubmit={submit}>
          <h3>New Request</h3>
          {sent && <div className="alert success">Request sent! Staff will handle it shortly.</div>}

          <label>Service Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {types.map((t) => (
              <option key={t} value={t}>{t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
            ))}
          </select>

          <label>Details (optional)</label>
          <textarea
            rows="3"
            placeholder="e.g. Breakfast for 2 at 9 AM"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <button className="btn btn-gold">Send Request</button>
        </form>

        <div>
          <h3>My Requests</h3>
          {requests.length === 0 && <p className="muted">No requests yet.</p>}
          {requests.map((r) => (
            <div className="request-row card" key={r._id}>
              <div>
                <b>{r.type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</b>
                <p className="muted small">{r.details || "No extra details"}</p>
                <p className="muted small">{new Date(r.createdAt).toLocaleString()}</p>
              </div>
              <span className={badge[r.status]}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
