import { useEffect, useState } from "react";
import api from "../api";
import { money } from "../money";

const badge = {
  booked: "badge blue",
  "checked-in": "badge green",
  "checked-out": "badge gray",
  cancelled: "badge red",
};

const gradients = {
  Standard: "linear-gradient(135deg,#1c1c22 0%,#3a2f2a 100%)",
  Deluxe: "linear-gradient(135deg,#221d24 0%,#4a3441 100%)",
  Executive: "linear-gradient(135deg,#1e2229 0%,#3c4356 100%)",
  Suite: "linear-gradient(135deg,#241d1a 0%,#5c4a3a 100%)",
  Presidential: "linear-gradient(135deg,#141416 0%,#6b5544 100%)",
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const load = () => api.get("/bookings/my").then((res) => setBookings(res.data));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    await api.put("/bookings/" + id + "/cancel");
    load();
  };

  return (
    <div className="container section">
      <div className="center">
        <span className="lux-label">My Stays</span>
        <h2 className="section-title">My Bookings</h2>
        <div className="divider" style={{ margin: "16px auto 8px" }} />
      </div>

      {bookings.length === 0 && (
        <p className="muted center">No bookings yet. <a href="/rooms">Book a room</a> now!</p>
      )}

      <div className="booking-list">
        {bookings.map((b) => (
          <div className="booking-card" key={b._id}>
            <div
              className="b-img"
              style={
                b.room?.image
                  ? { backgroundImage: `url(${b.room.image})` }
                  : { backgroundImage: gradients[b.room?.type] || gradients.Standard }
              }
            >
              <span className={badge[b.status]}>{b.status}</span>
            </div>

            <div className="b-info">
              <div className="b-head">
                <h3>{b.room?.type} — Room #{b.room?.roomNumber}</h3>
                <span className="muted small">Booking #{b._id.slice(-6).toUpperCase()}</span>
              </div>

              <div className="b-meta">
                <div className="b-item">
                  <span>Check In</span>
                  <b>{new Date(b.checkIn).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</b>
                </div>
                <div className="b-item">
                  <span>Check Out</span>
                  <b>{new Date(b.checkOut).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</b>
                </div>
                <div className="b-item">
                  <span>Guests</span>
                  <b>{b.guests}</b>
                </div>
                <div className="b-item">
                  <span>Amount</span>
                  <b className="gold-text">{money(b.totalAmount)}</b>
                </div>
              </div>

              {b.status === "booked" && (
                <div className="b-actions">
                  <button className="btn btn-danger btn-sm" onClick={() => cancel(b._id)}>
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
