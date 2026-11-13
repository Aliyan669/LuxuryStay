import { useEffect, useState } from "react";
import api from "../api";
import { money } from "../money";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/reports/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) return <p className="muted">Loading dashboard...</p>;

  const stats = [
    { label: "Total Revenue", value: money(data.totalRevenue), sub: "from paid invoices", cls: "green" },
    { label: "Occupancy Rate", value: data.occupancyRate + "%", sub: `${data.occupied}/${data.totalRooms} rooms occupied`, cls: "blue" },
    { label: "Active Bookings", value: data.activeBookings, sub: "currently checked-in", cls: "orange" },
    { label: "Guests Registered", value: data.guests, sub: `avg rating ${data.avgRating} / 5`, cls: "purple" },
  ];

  const roomStatus = [
    { label: "Available", count: data.available, cls: "green" },
    { label: "Occupied", count: data.occupied, cls: "red" },
    { label: "Cleaning", count: data.cleaning, cls: "orange" },
    { label: "Maintenance", count: data.maintenance, cls: "gray" },
  ];

  const maxWeek = Math.max(...data.week.map((w) => w.count), 1);

  return (
    <div>
      <span className="lux-label">Overview</span>
      <h1>Dashboard</h1>
      <p className="muted">Live snapshot of hotel operations</p>

      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className={"stat-card " + s.cls}>
            <p className="muted small">{s.label}</p>
            <h2>{s.value}</h2>
            <span className="muted small">{s.sub}</span>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="card">
          <h3>Bookings - Last 7 Days</h3>
          <div className="bar-chart">
            {data.week.map((w) => (
              <div key={w.day} className="bar-col">
                <div className="bar" style={{ height: (w.count / maxWeek) * 100 + "%" }}></div>
                <span className="small">{w.day}</span>
                <b className="small">{w.count}</b>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Room Status</h3>
          {roomStatus.map((r) => (
            <div key={r.label} className="status-row">
              <span className={"dot " + r.cls}></span>
              <span>{r.label}</span>
              <b>{r.count}</b>
            </div>
          ))}
          <div className="bill-line total" style={{ marginTop: 12 }}>
            <span>Pending Revenue (unpaid bills)</span>
            <b>{money(data.pendingRevenue)}</b>
          </div>
          <div className="bill-line total">
            <span>Total Bookings</span>
            <b>{data.totalBookings}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
