import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { LogoMark, LogoutIcon, MenuIcon, XIcon } from "./Icons";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (location.pathname.startsWith("/admin")) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-inner container">
        <Link to="/" className="brand">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="logo" className="brand-logo" />
          ) : (
            <span className="brand-mark"><LogoMark size={24} /></span>
          )}
          <span className="brand-text">
            Luxury<span>Stay</span>
          </span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
        </button>

        <div className={"nav-links" + (menuOpen ? " open" : "")} onClick={() => setMenuOpen(false)}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/rooms">Rooms</NavLink>

          {user ? (
            <>
              <NavLink to="/my-bookings">My Bookings</NavLink>
              <NavLink to="/my-invoices">Invoices</NavLink>
              <NavLink to="/services">Services</NavLink>
              <NavLink to="/feedback">Feedback</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              {(user.role === "admin" || user.role === "staff") && (
                <NavLink to="/admin" className="admin-link">Dashboard</NavLink>
              )}
              <button className="btn btn-outline btn-sm nav-logout" onClick={handleLogout}>
                <LogoutIcon size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link to="/register" className="btn btn-gold nav-signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
