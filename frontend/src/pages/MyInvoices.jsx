import { useEffect, useState } from "react";
import api from "../api";
import { money } from "../money";

export default function MyInvoices() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    api.get("/invoices/my").then((res) => setInvoices(res.data));
  }, []);

  return (
    <div className="container section">
      <h2 className="section-title">My Invoices</h2>

      {invoices.length === 0 && <p className="muted">No invoices yet. Invoices are generated at check-in.</p>}

      {invoices.map((inv) => (
        <div className="invoice card" key={inv._id}>
          <div className="invoice-head">
            <div>
              <b>Invoice #{inv._id.slice(-6).toUpperCase()}</b>
              <p className="muted small">{new Date(inv.createdAt).toLocaleString()}</p>
            </div>
            <span className={inv.status === "paid" ? "badge green" : "badge orange"}>{inv.status}</span>
          </div>

          <table className="mini-table">
            <thead>
              <tr><th>Item</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {inv.items.map((item, i) => (
                <tr key={i}><td>{item.item}</td><td>{money(item.amount)}</td></tr>
              ))}
            </tbody>
          </table>

          <div className="bill-line"><span>Sub Total</span><span>{money(inv.subTotal)}</span></div>
          <div className="bill-line"><span>Tax ({inv.taxPercent}%)</span><span>{money(inv.taxAmount)}</span></div>
          <div className="bill-line total"><span>Grand Total</span><b>{money(inv.grandTotal)}</b></div>
        </div>
      ))}
    </div>
  );
}
