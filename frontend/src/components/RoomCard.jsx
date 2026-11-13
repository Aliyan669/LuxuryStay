import { Link } from "react-router-dom";
import { money } from "../money";

const gradients = {
  Standard: "linear-gradient(135deg,#1c1c22 0%,#3a2f2a 100%)",
  Deluxe: "linear-gradient(135deg,#221d24 0%,#4a3441 100%)",
  Executive: "linear-gradient(135deg,#1e2229 0%,#3c4356 100%)",
  Suite: "linear-gradient(135deg,#241d1a 0%,#5c4a3a 100%)",
  Presidential: "linear-gradient(135deg,#141416 0%,#6b5544 100%)",
};

export default function RoomCard({ room }) {
  const statusClass = {
    available: "badge green",
    occupied: "badge red",
    cleaning: "badge orange",
    maintenance: "badge gray",
  }[room.status];

  return (
    <div className="room-card">
      <div
        className="room-img"
        style={room.image ? { backgroundImage: `url(${room.image})`, backgroundSize: "cover", backgroundPosition: "center" } : { backgroundImage: gradients[room.type] || gradients.Standard }}
      >
        <span className="room-type-mark">{room.type}</span>
        <span className={statusClass}>{room.status}</span>
      </div>
      <div className="room-body">
        <div className="room-head">
          <h3>{room.type}</h3>
          <span className="room-no">#{room.roomNumber}</span>
        </div>
        <p className="muted small">{room.description}</p>
        <div className="amenities">
          {room.amenities && room.amenities.slice(0, 4).map((a) => (
            <span key={a} className="chip">{a}</span>
          ))}
        </div>
        <div className="room-foot">
          <div>
            <div className="price">{money(room.price)}</div>
            <span className="muted small">per night · {room.capacity} guests</span>
          </div>
          {room.status === "available" ? (
            <Link to={`/book/${room._id}`} className="btn btn-gold btn-sm">Book Now</Link>
          ) : (
            <button className="btn btn-outline btn-sm" disabled>Unavailable</button>
          )}
        </div>
      </div>
    </div>
  );
}
