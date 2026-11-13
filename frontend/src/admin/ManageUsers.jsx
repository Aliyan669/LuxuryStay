import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";
import PasswordInput from "../components/PasswordInput";
import { PlusIcon, TrashIcon } from "../components/Icons";

const empty = { name: "", email: "", password: "", role: "staff", phone: "" };

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const load = () => api.get("/users").then((res) => setUsers(res.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/users", form);
      setForm(empty);
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create user");
    }
  };

  const toggleActive = async (user) => {
    await api.put("/users/" + user._id, { isActive: !user.isActive });
    load();
  };

  const changeRole = async (user, role) => {
    await api.put("/users/" + user._id, { role });
    load();
  };

  const remove = async (user) => {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    try {
      await api.delete("/users/" + user._id);
      load();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const roleBadge = { admin: "badge purple", staff: "badge blue", guest: "badge gray" };

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="lux-label">Team & Guests</span>
          <h1>User Management</h1>
          <p className="muted">Create staff accounts, manage roles and deactivate users.</p>
        </div>
        <button className="btn btn-gold" onClick={() => { setForm(empty); setError(""); setShowModal(true); }}>
          <PlusIcon size={16} /> Add Staff
        </button>
      </div>

      {showModal && (
        <Modal title="Create New Account" onClose={() => setShowModal(false)}>
          {error && <div className="alert error" style={{ marginBottom: 12 }}>{error}</div>}
          <form onSubmit={submit}>
            <div className="grid-form">
              <div>
                <label>Full Name</label>
                <input placeholder="Reception staff name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label>Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="staff">staff (reception)</option>
                  <option value="guest">guest</option>
                </select>
              </div>
            </div>
            <label>Email</label>
            <input type="email" placeholder="name@luxurystay.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <div className="grid-form">
              <div>
                <label>Phone</label>
                <input placeholder="+91 98XXXXXXXX" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label>Password</label>
                <PasswordInput placeholder="Min 6 characters" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
              </div>
            </div>
            <button className="btn btn-gold btn-block">Create Account</button>
          </form>
        </Modal>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td><b>{user.name}</b></td>
                <td>{user.email}</td>
                <td>{user.phone || "-"}</td>
                <td>
                  {user.role === "admin" ? (
                    <span className={roleBadge.admin}>admin</span>
                  ) : (
                    <select className="mini-select" value={user.role} onChange={(e) => changeRole(user, e.target.value)}>
                      <option value="guest">guest</option>
                      <option value="staff">staff</option>
                      <option value="admin">admin</option>
                    </select>
                  )}
                </td>
                <td>
                  <span className={user.isActive ? "badge green" : "badge red"}>
                    {user.isActive ? "active" : "inactive"}
                  </span>
                </td>
                <td className="row-actions">
                  {user.role !== "admin" && (
                    <>
                      <button className="btn btn-outline btn-sm" onClick={() => toggleActive(user)}>
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button className="icon-btn" title="Delete" onClick={() => remove(user)}><TrashIcon size={15} /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
