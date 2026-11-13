import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { LogoMark } from "../components/Icons";
import PasswordInput from "../components/PasswordInput";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === "guest" ? "/" : "/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo">
          {settings?.logoUrl ? <img src={settings.logoUrl} alt="logo" /> : <LogoMark size={44} />}
        </div>
        <h2>Welcome Back</h2>
        <p className="muted">Sign in to manage your stays</p>

        {error && <div className="alert error">{error}</div>}

        <label>Email Address</label>
        <input
          type="email"
          placeholder="you@example.com"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <label>Password</label>
        <PasswordInput
          placeholder="Your password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn btn-gold btn-block" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="muted small center">
          New here? <Link to="/register">Create an account</Link>
        </p>

       
      </form>
    </div>
  );
}
