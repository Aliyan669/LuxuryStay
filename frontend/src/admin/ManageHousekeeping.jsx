import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";
import { PlusIcon, TrashIcon } from "../components/Icons";

const empty = { room: "", task: "", issue: "" };

export default function ManageHousekeeping() {
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    api.get("/housekeeping").then((res) => setTasks(res.data));
    api.get("/rooms").then((res) => setRooms(res.data));
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/housekeeping", form);
      setForm(empty);
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add task");
    }
  };

  const updateStatus = async (task, status) => {
    await api.put("/housekeeping/" + task._id, { status });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete("/housekeeping/" + id);
    load();
  };

  const badge = { pending: "badge orange", "in-progress": "badge blue", completed: "badge green" };

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="lux-label">Operations</span>
          <h1>Housekeeping & Maintenance</h1>
          <p className="muted">Schedule cleaning tasks and track maintenance issues.</p>
        </div>
        <button className="btn btn-gold" onClick={() => { setForm(empty); setError(""); setShowModal(true); }}>
          <PlusIcon size={16} /> New Task
        </button>
      </div>

      {showModal && (
        <Modal title="Add Housekeeping Task" onClose={() => setShowModal(false)}>
          {error && <div className="alert error" style={{ marginBottom: 12 }}>{error}</div>}
          <form onSubmit={submit}>
            <label>Room</label>
            <select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} required>
              <option value="">Select a room</option>
              {rooms.map((r) => <option key={r._id} value={r._id}>#{r.roomNumber} — {r.type}</option>)}
            </select>
            <label>Task</label>
            <input placeholder="e.g. Deep cleaning" value={form.task}
              onChange={(e) => setForm({ ...form, task: e.target.value })} required />
            <label>Maintenance Issue (optional)</label>
            <input placeholder="e.g. AC not cooling" value={form.issue}
              onChange={(e) => setForm({ ...form, issue: e.target.value })} />
            <button className="btn btn-gold btn-block">Add Task</button>
          </form>
        </Modal>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr><th>Room</th><th>Task</th><th>Issue</th><th>Status</th><th>Update</th><th></th></tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td><b>{task.room?.roomNumber && "#" + task.room.roomNumber}</b> {task.room?.type}</td>
                <td>{task.task}</td>
                <td>{task.issue || "-"}</td>
                <td><span className={badge[task.status]}>{task.status}</span></td>
                <td>
                  <select className="mini-select" value={task.status} onChange={(e) => updateStatus(task, e.target.value)}>
                    <option value="pending">pending</option>
                    <option value="in-progress">in-progress</option>
                    <option value="completed">completed</option>
                  </select>
                </td>
                <td className="row-actions">
                  <button className="icon-btn" title="Delete" onClick={() => remove(task._id)}><TrashIcon size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tasks.length === 0 && <p className="muted center" style={{ padding: 20 }}>No housekeeping tasks yet.</p>}
      </div>
    </div>
  );
}
