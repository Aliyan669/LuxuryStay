import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";

export default function Profile() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || "",
    address: user.address || "",
    password: "",
  });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/me", form);
      setMsg("Profile updated successfully!");
      setTimeout(() => {
        logout();
        window.location.href = "/login";
      }, 1200);
    } catch {
      setMsg("Something went wrong");
    }
  };

  return (
    <div className="container section narrow">
      <h2 className="section-title">My Profile</h2>

      <form className="card" onSubmit={submit}>
        <div className="profile-top">
          <div className="avatar">{user.name[0].toUpperCase()}</div>
          <div>
            <b>{user.name}</b>
            <p className="muted small">{user.email} · {user.role}</p>
          </div>
        </div>

        {msg && <div className="alert success">{msg}</div>}

        <label>Full Name</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label>Phone</label>
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <label>Address</label>
        <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <label>New Password (leave empty to keep old)</label>
        <PasswordInput
          placeholder="••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn btn-gold">Save Changes</button>
      </form>
    </div>
  );
}
