import { Link, useLocation } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { LogoMark } from "./Icons";

export default function Footer() {
  const { settings } = useSettings();
  const location = useLocation();

  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin")
  ) return null;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: 14 }}>
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="logo" className="brand-logo" />
              ) : (
                <span className="brand-mark"><LogoMark size={22} /></span>
              )}
              <span className="brand-text">Luxury<span>Stay</span></span>
            </div>
            <p>
              A collection of luxury hotels offering timeless elegance,
              sincere service and unforgettable experiences.
            </p>
          </div>
          <div>
            <h5>Explore</h5>
            <Link to="/rooms">Rooms & Suites</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/my-bookings">My Bookings</Link>
          </div>
          <div>
            <h5>Guest Services</h5>
            <Link to="/services">Room Service</Link>
            <Link to="/feedback">Feedback</Link>
            <Link to="/my-invoices">Invoices</Link>
          </div>
          <div>
            <h5>Contact</h5>
            <p>Shahrah-e-Faisal, Karachi</p>
            <p>+92 308 2788266</p>
            <p>stay@luxurystay.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {settings?.hotelName || "LuxuryStay Hospitality"}</span>
          <span>Hotel Management System · MERN Stack</span>
        </div>
      </div>
    </footer>
  );
}
