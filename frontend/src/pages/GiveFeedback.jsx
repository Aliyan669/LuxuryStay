import { useState } from "react";
import api from "../api";
import { StarIcon } from "../components/Icons";

export default function GiveFeedback() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/feedback", { rating, comment });
      setDone(true);
      setComment("");
    } catch (err) {
      setError("Could not submit feedback");
    }
  };

  return (
    <div className="container section narrow">
      <div className="center">
        <span className="lux-label">Guest Feedback</span>
        <h2 className="section-title">Rate Your Experience</h2>
        <div className="divider" style={{ margin: "16px auto 22px" }} />
      </div>

      <form className="card center" onSubmit={submit}>
        {done && <div className="alert success">Thank you for your valuable feedback</div>}
        {error && <div className="alert error">{error}</div>}

        <label style={{ textAlign: "center" }}>Your Rating</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={n <= rating ? "star on" : "star"} onClick={() => setRating(n)}>
              <StarIcon size={30} />
            </span>
          ))}
        </div>
        <div className="muted small">{rating} / 5</div>

        <label>Comments</label>
        <textarea
          rows="4"
          placeholder="Tell us about your stay..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="btn btn-gold">Submit Feedback</button>
      </form>
    </div>
  );
}
