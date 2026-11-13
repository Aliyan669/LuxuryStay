import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { PlusIcon } from "../components/Icons";

export default function Notifications() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ message: "", forRole: "all" });
  const [showModal, setShowModal] = useState(false);

  const load = () => api.get("/notifications").then((res) => setList(res.data));
  useEffect(() => { load(); }, []);

  const markRead = async () => {
    await api.put("/notifications/read");
    load();
  };

  const send = async (e) => {
    e.preventDefault();
    await api.post("/notifications", form);
    setForm({ message: "", forRole: "all" });
    setShowModal(false);
    load();
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="lux-label">Alerts</span>
          <h1>Notifications</h1>
          <p className="muted">System alerts for bookings, maintenance and updates.</p>
        </div>
        <div className="row-actions">
          <button className="btn btn-outline" onClick={markRead}>Mark All Read</button>
          {user.role === "admin" && (
            <button className="btn btn-gold" onClick={() => setShowModal(true)}>
              <PlusIcon size={16} /> Send
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <Modal title="Send Notification" onClose={() => setShowModal(false)}>
          <form onSubmit={send}>
            <label>Message</label>
            <textarea rows="3" placeholder="Notification text..." value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            <label>Audience</label>
            <select value={form.forRole} onChange={(e) => setForm({ ...form, forRole: e.target.value })}>
              <option value="all">Everyone</option>
              <option value="staff">Staff only</option>
              <option value="guest">Guests only</option>
            </select>
            <button className="btn btn-gold btn-block">Send Notification</button>
          </form>
        </Modal>
      )}

      <div className="notif-list">
        {list.map((n) => (
          <div key={n._id} className={"notif-row " + (n.isRead ? "" : "unread")}>
            <span className="dot blue" style={{ marginTop: 7 }}></span>
            <div>
              <p>{n.message}</p>
              <span className="muted small">for: {n.forRole} · {new Date(n.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="muted center" style={{ marginTop: 18 }}>No notifications.</p>}
    </div>
  );
}
