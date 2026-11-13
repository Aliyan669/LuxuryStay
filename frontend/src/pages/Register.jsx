import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { LogoMark } from "../components/Icons";
import PasswordInput from "../components/PasswordInput";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo">
          {settings?.logoUrl ? <img src={settings.logoUrl} alt="logo" /> : <LogoMark size={44} />}
        </div>
        <h2>Create Account</h2>
        <p className="muted">Join LuxuryStay for your perfect stay</p>

        {error && <div className="alert error">{error}</div>}

        <label>Full Name</label>
        <input
          placeholder="Your full name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <label>Email Address</label>
        <input
          type="email"
          placeholder="you@example.com"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <label>Phone Number</label>
        <input
          placeholder="+92 XXX XXXXXXX"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <label>Password</label>
        <PasswordInput
          placeholder="Minimum 6 characters"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn btn-gold btn-block" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="muted small center">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
