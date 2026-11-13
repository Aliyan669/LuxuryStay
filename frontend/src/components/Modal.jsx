import { XIcon } from "./Icons";

export default function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="modal-back" onClick={onClose}>
      <div className={"modal " + (wide ? "modal-wide" : "")} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose}><XIcon /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
