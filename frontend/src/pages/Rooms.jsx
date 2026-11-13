import { useEffect, useState } from "react";
import api from "../api";
import RoomCard from "../components/RoomCard";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/rooms").then((res) => {
      setRooms(res.data);
      setLoading(false);
    });
  }, []);

  const types = ["all", ...new Set(rooms.map((r) => r.type))];
  const shown = type === "all" ? rooms : rooms.filter((r) => r.type === type);

  return (
    <div className="container section">
      <h2 className="section-title">Our Rooms</h2>
      <p className="muted">Choose from our range of premium rooms and suites.</p>

      <div className="filter-bar">
        {types.map((t) => (
          <button
            key={t}
            className={"filter-chip" + (type === t ? " active" : "")}
            onClick={() => setType(t)}
          >
            {t === "all" ? "All Types" : t}
          </button>
        ))}
      </div>

      {loading ? <p className="muted center">Loading rooms...</p> : (
        <div className="rooms-grid">
          {shown.map((room) => <RoomCard key={room._id} room={room} />)}
        </div>
      )}
    </div>
  );
}
