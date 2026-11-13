import { useEffect, useState } from "react";
import api from "../api";
import { StarIcon, TrashIcon } from "../components/Icons";

export default function ManageFeedback() {
  const [list, setList] = useState([]);

  const load = () => api.get("/feedback").then((res) => setList(res.data));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    await api.delete("/feedback/" + id);
    load();
  };

  const avg = list.length
    ? (list.reduce((s, f) => s + f.rating, 0) / list.length).toFixed(1)
    : "0.0";

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="lux-label">Guest Voice</span>
          <h1>Feedback & Ratings</h1>
          <p className="muted">Average rating: <b style={{ color: "var(--gold-2)" }}>{avg} / 5</b> from {list.length} reviews</p>
        </div>
      </div>

      <div className="feedback-grid">
        {list.map((fb) => (
          <div className="card" key={fb._id}>
            <div className="fb-head">
              <div className="avatar small">{fb.user?.name?.[0]?.toUpperCase()}</div>
              <div>
                <b>{fb.user?.name}</b>
                <p className="muted small">{new Date(fb.createdAt).toLocaleString()}</p>
              </div>
              <span className="stars-inline">
                {Array.from({ length: fb.rating }).map((_, i) => <StarIcon key={i} size={13} />)}
                {Array.from({ length: 5 - fb.rating }).map((_, i) => <StarIcon key={"e" + i} size={13} filled={false} />)}
              </span>
            </div>
            <p className="muted">{fb.comment || "No comment given."}</p>
            <button className="icon-btn" title="Delete" onClick={() => remove(fb._id)}><TrashIcon size={15} /></button>
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="muted center">No feedback yet.</p>}
    </div>
  );
}
