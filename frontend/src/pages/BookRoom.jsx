import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { money } from "../money";

const gradients = {
  Standard: "linear-gradient(135deg,#1c1c22 0%,#3a2f2a 100%)",
  Deluxe: "linear-gradient(135deg,#221d24 0%,#4a3441 100%)",
  Executive: "linear-gradient(135deg,#1e2229 0%,#3c4356 100%)",
  Suite: "linear-gradient(135deg,#241d1a 0%,#5c4a3a 100%)",
  Presidential: "linear-gradient(135deg,#141416 0%,#6b5544 100%)",
};

export default function BookRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/rooms/" + roomId).then((res) => setRoom(res.data));
  }, [roomId]);

  const nights = checkIn && checkOut ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000) || 1 : 0;
  const total = room ? room.price * nights : 0;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/bookings", {
        room: roomId,
        checkIn,
        checkOut,
        guests,
      });
      navigate("/my-bookings");
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Booking failed" });
      setLoading(false);
    }
  };

  if (!room) return <p className="container section muted center">Loading...</p>;

  const imgStyle = room.image
    ? { backgroundImage: `url(${room.image})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { backgroundImage: gradients[room.type] || gradients.Standard };

  return (
    <div className="container section">
      <div className="book-wrap">
        <div className="book-room-info">
          <div className="room-img big" style={imgStyle}>
            <span className="room-type-mark">{room.type}</span>
          </div>
          <span className="lux-label">Room Reservation</span>
          <h2>{room.type} · Room #{room.roomNumber}</h2>
          <p className="muted">{room.description}</p>
          <div className="amenities">
            {room.amenities.map((a) => <span key={a} className="chip">{a}</span>)}
          </div>
          <div className="price">{money(room.price)} <span className="muted small">/ night</span></div>
        </div>

        <form className="book-form card" onSubmit={submit}>
          <h3>Book This Room</h3>
          {msg.text && <div className={"alert " + msg.type}>{msg.text}</div>}

          <label>Check In</label>
          <input type="date" required value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          <label>Check Out</label>
          <input type="date" required value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          <label>Guests</label>
          <select value={guests} onChange={(e) => setGuests(e.target.value)}>
            {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
            ))}
          </select>

          <div className="bill-line">
            <span>{money(room.price)} × {nights} night{nights > 1 ? "s" : ""}</span>
            <b>{money(total)}</b>
          </div>
          <div className="bill-line total">
            <span>Taxes will be added at check-in</span>
          </div>

          <button className="btn btn-gold btn-block" disabled={loading}>
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
