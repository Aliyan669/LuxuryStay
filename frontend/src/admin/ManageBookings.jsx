import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";
import { EditIcon, TrashIcon } from "../components/Icons";
import { money } from "../money";

const toDateInput = (d) => new Date(d).toISOString().slice(0, 10);

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    api.get("/bookings").then((res) => setBookings(res.data));
    api.get("/rooms").then((res) => setRooms(res.data));
  };
  useEffect(() => { load(); }, []);

  const action = async (id, what) => {
    if (!window.confirm(`Confirm ${what}?`)) return;
    try {
      await api.put(`/bookings/${id}/${what}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const openEdit = (b) => {
    setForm({
      id: b._id,
      room: b.room?._id || "",
      checkIn: toDateInput(b.checkIn),
      checkOut: toDateInput(b.checkOut),
      guests: b.guests,
      status: b.status,
    });
    setError("");
    setEditModal(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.put("/bookings/" + form.id, {
        room: form.room,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
        status: form.status,
      });
      setEditModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update booking");
    }
  };

  const remove = async (b) => {
    if (!window.confirm(`Delete booking of ${b.user?.name}?`)) return;
    try {
      await api.delete("/bookings/" + b._id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const badge = {
    booked: "badge blue",
    "checked-in": "badge green",
    "checked-out": "badge gray",
    cancelled: "badge red",
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="lux-label">Reservations</span>
          <h1>Bookings</h1>
          <p className="muted">Manage reservations, check-ins and check-outs.</p>
        </div>
      </div>

      {/* edit modal */}
      {editModal && form && (
        <Modal title="Edit Booking" onClose={() => setEditModal(false)}>
          {error && <div className="alert error" style={{ marginBottom: 12 }}>{error}</div>}
          <form onSubmit={saveEdit}>
            <label>Room</label>
            <select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} required>
              <option value="">Select room</option>
              {rooms.map((r) => (
                <option key={r._id} value={r._id}>#{r.roomNumber} — {r.type}</option>
              ))}
            </select>

            <div className="grid-form">
              <div>
                <label>Check In</label>
                <input type="date" value={form.checkIn}
                  onChange={(e) => setForm({ ...form, checkIn: e.target.value })} required />
              </div>
              <div>
                <label>Check Out</label>
                <input type="date" value={form.checkOut}
                  onChange={(e) => setForm({ ...form, checkOut: e.target.value })} required />
              </div>
            </div>

            <div className="grid-form">
              <div>
                <label>Guests</label>
                <input type="number" min="1" value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })} required />
              </div>
              <div>
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="booked">booked</option>
                  <option value="checked-in">checked-in</option>
                  <option value="checked-out">checked-out</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
            </div>

            <button className="btn btn-gold btn-block">Save Changes</button>
          </form>
        </Modal>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Guest</th><th>Room</th><th>Check In</th><th>Check Out</th><th>Guests</th><th>Amount</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>
                  <b>{b.user?.name}</b>
                  <div className="muted small">{b.user?.email}</div>
                </td>
                <td><b>{b.room?.type}</b> #{b.room?.roomNumber}</td>
                <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                <td>{b.guests}</td>
                <td>{money(b.totalAmount)}</td>
                <td><span className={badge[b.status]}>{b.status}</span></td>
                <td className="row-actions">
                  {b.status === "booked" && (
                    <>
                      <button className="btn btn-gold btn-sm" onClick={() => action(b._id, "checkin")}>Check In</button>
                      <button className="btn btn-outline btn-sm" onClick={() => action(b._id, "cancel")}>Cancel</button>
                    </>
                  )}
                  {b.status === "checked-in" && (
                    <button className="btn btn-danger btn-sm" onClick={() => action(b._id, "checkout")}>Check Out</button>
                  )}
                  <button className="icon-btn" title="Edit" onClick={() => openEdit(b)}><EditIcon size={15} /></button>
                  <button className="icon-btn" title="Delete" onClick={() => remove(b)}><TrashIcon size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p className="muted center" style={{ padding: 20 }}>No bookings yet.</p>}
      </div>
    </div>
  );
}
