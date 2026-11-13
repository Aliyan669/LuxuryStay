import { useEffect, useState } from "react";
import api from "../api";
import { PrintIcon, XIcon } from "../components/Icons";
import { money } from "../money";

export default function ManageInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null); 
  const [extra, setExtra] = useState({ item: "", amount: "" });

  const load = () => api.get("/invoices").then((res) => setInvoices(res.data));
  useEffect(() => { load(); }, []);

  const addItem = async (invoice) => {
    if (!extra.item || !extra.amount) return;
    await api.put("/invoices/" + invoice._id, { item: extra.item, amount: Number(extra.amount) });
    setExtra({ item: "", amount: "" });
    load();
  };

  const markPaid = async (invoice) => {
    await api.put("/invoices/" + invoice._id, { status: "paid" });
    load();
  };

  const print = () => window.print();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Billing & Invoices</h1>
          <p className="muted">Add extra service charges and manage payment status.</p>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr><th>Invoice</th><th>Guest</th><th>Room</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td><b>#{inv._id.slice(-6).toUpperCase()}</b></td>
                <td>{inv.user?.name}</td>
                <td>{inv.room?.roomNumber && "#" + inv.room.roomNumber} {inv.room?.type}</td>
                <td>{inv.items.length}</td>
                <td><b>{money(inv.grandTotal)}</b></td>
                <td><span className={inv.status === "paid" ? "badge green" : "badge orange"}>{inv.status}</span></td>
                <td className="row-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => setSelected(inv)}>View</button>
                  {inv.status === "unpaid" && (
                    <button className="btn btn-gold btn-sm" onClick={() => markPaid(inv)}>Mark Paid</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && <p className="muted center">No invoices yet. Invoices are generated when guests check in.</p>}
      </div>

      
      {selected && (
        <div className="modal-back" onClick={() => setSelected(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-head">
              <div>
                <h3>Invoice #{selected._id.slice(-6).toUpperCase()}</h3>
                <p className="muted small">
                  {selected.user?.name} · {selected.user?.email} · Room #{selected.room?.roomNumber}
                </p>
              </div>
              <button className="icon-btn" onClick={() => setSelected(null)}><XIcon size={16} /></button>
            </div>

            <table className="mini-table">
              <thead><tr><th>Item</th><th>Amount</th></tr></thead>
              <tbody>
                {selected.items.map((item, i) => (
                  <tr key={i}><td>{item.item}</td><td>{money(item.amount)}</td></tr>
                ))}
              </tbody>
            </table>

            <div className="bill-line"><span>Sub Total</span><span>{money(selected.subTotal)}</span></div>
            <div className="bill-line"><span>Tax ({selected.taxPercent}%)</span><span>{money(selected.taxAmount)}</span></div>
            <div className="bill-line total"><span>Grand Total</span><b>{money(selected.grandTotal)}</b></div>

            <div className="add-charge">
              <input placeholder="Extra item (e.g. Laundry)" value={extra.item}
                onChange={(e) => setExtra({ ...extra, item: e.target.value })} />
              <input type="number" placeholder="Amount" value={extra.amount}
                onChange={(e) => setExtra({ ...extra, amount: e.target.value })} />
              <button className="btn btn-outline" onClick={() => addItem(selected)}>+ Add Charge</button>
              <button className="btn btn-gold" onClick={print}><PrintIcon size={15} /> Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
