import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import api from "../api";
import { useEffect, useState } from "react";
import {
  LogoMark, DashboardIcon, BedIcon, CalendarIcon, InvoiceIcon, BroomIcon,
  UsersIcon, StarIcon, BellIcon, GearIcon, LogoutIcon, MenuIcon, XIcon,
} from "../components/Icons";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api.get("/notifications").then((res) => {
      setUnread(res.data.filter((n) => !n.isRead).length);
    });
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const links = [
    { to: "/admin", label: "Dashboard", icon: DashboardIcon, end: true },
    { to: "/admin/rooms", label: "Rooms", icon: BedIcon },
    { to: "/admin/bookings", label: "Bookings", icon: CalendarIcon },
    { to: "/admin/invoices", label: "Invoices", icon: InvoiceIcon },
    { to: "/admin/housekeeping", label: "Housekeeping", icon: BroomIcon },
    { to: "/admin/users", label: "Users", icon: UsersIcon },
    { to: "/admin/feedback", label: "Feedback", icon: StarIcon },
    { to: "/admin/notifications", label: unread ? `Notifications (${unread})` : "Notifications", icon: BellIcon },
    ...(user.role === "admin" ? [{ to: "/admin/settings", label: "Settings", icon: GearIcon }] : []),
  ];

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <button
          type="button"
          className="icon-btn admin-burger"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <MenuIcon size={20} />
        </button>
        <span className="atb-brand">Luxury<span>Stay</span></span>
        <span className="atb-user">{user.name}</span>
      </header>

      {menuOpen && <div className="sb-overlay" onClick={() => setMenuOpen(false)} />}

      <aside className={"sidebar" + (menuOpen ? " open" : "")}>
        <button
          type="button"
          className="sb-close"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        >
          <XIcon size={18} />
        </button>

        <div className="sidebar-brand">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="logo" />
          ) : (
            <LogoMark size={26} />
          )}
          <span className="sb-text">Luxury<span>Stay</span></span>
        </div>

        <div className="sidebar-user">
          <div className="avatar small">{user.name[0].toUpperCase()}</div>
          <div>
            <b style={{ fontSize: ".88rem" }}>{user.name}</b>
            <div className="muted small" style={{ textTransform: "capitalize" }}>{user.role}</div>
          </div>
        </div>

        <nav className="sidebar-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              <l.icon size={17} /> {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="btn btn-outline-light btn-block"
          onClick={() => { logout(); navigate("/login"); }}
        >
          <LogoutIcon size={15} /> Logout
        </button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
