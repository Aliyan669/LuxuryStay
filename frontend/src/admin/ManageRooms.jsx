import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";
import { PlusIcon, EditIcon, TrashIcon } from "../components/Icons";
import ImageUpload from "../components/ImageUpload";
import { money } from "../money";

const emptyRoom = {
  roomNumber: "",
  type: "Standard",
  price: "",
  capacity: 2,
  amenities: "",
  description: "",
  image: "",
  status: "available",
};

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyRoom);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const load = () => api.get("/rooms").then((res) => setRooms(res.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm(emptyRoom);
    setEditId(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (room) => {
    setForm({ ...room, amenities: room.amenities.join(", ") });
    setEditId(room._id);
    setError("");
    setShowModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const body = {
      ...form,
      price: Number(form.price),
      capacity: Number(form.capacity),
      amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
    };
    try {
      if (editId) {
        await api.put("/rooms/" + editId, body);
      } else {
        await api.post("/rooms", body);
      }
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save room");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    await api.delete("/rooms/" + id);
    load();
  };

  const changeStatus = async (room, status) => {
    await api.put("/rooms/" + room._id, { status });
    load();
  };

  const badge = { available: "badge green", occupied: "badge red", cleaning: "badge orange", maintenance: "badge gray" };

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="lux-label">Inventory</span>
          <h1>Room Management</h1>
          <p className="muted">Add rooms, update pricing and change room status in real-time.</p>
        </div>
        <button className="btn btn-gold" onClick={openAdd}>
          <PlusIcon size={16} /> Add Room
        </button>
      </div>

     
      {showModal && (
        <Modal title={editId ? "Edit Room" : "Add New Room"} onClose={() => setShowModal(false)}>
          {error && <div className="alert error" style={{ marginBottom: 12 }}>{error}</div>}
          <form onSubmit={submit}>
            <div className="grid-form">
              <div>
                <label>Room Number</label>
                <input placeholder="e.g. 105" value={form.roomNumber}
                  onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} required />
              </div>
              <div>
                <label>Room Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {["Standard", "Deluxe", "Executive", "Suite", "Presidential"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label>Price / Night</label>
                <input type="number" placeholder="2500" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div>
                <label>Capacity</label>
                <input type="number" placeholder="2" value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
              </div>
            </div>
            <label>Amenities (comma separated)</label>
            <input placeholder="AC, WiFi, TV, Mini Bar" value={form.amenities}
              onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
            <label>Description</label>
            <input placeholder="Short description of the room" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div style={{ marginTop: 10 }}>
              <ImageUpload
                label="Room Image"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />
            </div>
            <button className="btn btn-gold btn-block">
              {editId ? "Update Room" : "Add Room"}
            </button>
          </form>
        </Modal>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Room</th><th>Type</th><th>Price</th><th>Capacity</th><th>Status</th><th>Change Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id}>
                <td><b>#{room.roomNumber}</b></td>
                <td>{room.type}</td>
                <td>{money(room.price)}</td>
                <td>{room.capacity}</td>
                <td><span className={badge[room.status]}>{room.status}</span></td>
                <td>
                  <select value={room.status} onChange={(e) => changeStatus(room, e.target.value)} className="mini-select">
                    <option value="available">available</option>
                    <option value="occupied">occupied</option>
                    <option value="cleaning">cleaning</option>
                    <option value="maintenance">maintenance</option>
                  </select>
                </td>
                <td className="row-actions">
                  <button className="icon-btn" title="Edit" onClick={() => openEdit(room)}><EditIcon size={15} /></button>
                  <button className="icon-btn" title="Delete" onClick={() => remove(room._id)}><TrashIcon size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
