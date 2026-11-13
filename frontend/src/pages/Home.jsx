import { Link } from "react-router-dom";
import api from "../api";
import { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import {
  ConciergeIcon, SpaIcon, DiningIcon, CarIcon, WifiIcon, GymIcon,
  CheckIcon, StarIcon,
} from "../components/Icons";
const services = [
  { icon: ConciergeIcon, title: "24×7 Concierge", text: "Personalized assistance for every request, any hour of the day." },
  { icon: SpaIcon, title: "Spa & Wellness", text: "Rejuvenating therapies, sauna and signature wellness rituals." },
  { icon: DiningIcon, title: "Fine Dining", text: "Award-winning restaurants serving global and local cuisine." },
  { icon: CarIcon, title: "Airport Transfer", text: "Chauffeur-driven luxury cars for seamless arrivals and departures." },
  { icon: WifiIcon, title: "High-Speed WiFi", text: "Complimentary premium internet across every corner of the hotel." },
  { icon: GymIcon, title: "Fitness Center", text: "State-of-the-art equipment with personal training on request." },
];

const testimonials = [
  { name: "Aarav Mehta", role: "Business Traveller", stars: 5, text: "The most refined stay I have had in years. Impeccable service and the suite was simply stunning." },
  { name: "Sofia D'Souza", role: "Leisure Guest", stars: 5, text: "From booking to check-out everything was effortless. The spa and dining were world class." },
  { name: "Rajat Kapoor", role: "Regular Guest", stars: 4, text: "My go-to hotel for every visit. Staff remembers your preferences, that is true luxury." },
];

const aboutPoints = [
  "Award-winning hospitality recognised across the country",
  "Rooms and suites designed by celebrated interior architects",
  "Personalised guest profiles remembered for every return visit",
  "Transparent billing with detailed, itemised invoices",
  "Dedicated housekeeping and 24×7 maintenance support",
  "Secure bookings with instant confirmation",
];

export default function Home() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get("/rooms?status=available").then((res) => setRooms(res.data.slice(0, 3)));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-content">
          <span className="lux-label">Luxury Redefined</span>
          <h1>
            Welcome to <em>LuxuryStay</em><br />Hospitality
          </h1>
          <p>
            Experience world-class comfort, seamless booking and premium services
            across our hotels. Your perfect stay is only a few clicks away.
          </p>
          <div className="hero-btns">
            <Link to="/rooms" className="btn btn-gold">Explore Rooms</Link>
            <Link to="/register" className="btn btn-outline-light">Create Account</Link>
          </div>

          <div className="hero-glass">
            <div className="hg-block">
              <div className="hg-stars">
                {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} size={15} />)}
              </div>
              <span>Rated 4.8 / 5 by our guests</span>
            </div>
            <div className="hg-div"></div>
            <div className="hg-block">
              <b>50+</b>
              <span>Hotels Worldwide</span>
            </div>
            <div className="hg-div"></div>
            <div className="hg-block">
              <b>1200+</b>
              <span>Luxury Rooms</span>
            </div>
            <div className="hg-div"></div>
            <div className="hg-block">
              <b>25</b>
              <span>Years of Excellence</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="about-grid">
          <div className="about-photo">
            <img
              src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80"
              alt="LuxuryStay suite"
            />
            <span className="about-est">EST. 1998</span>
          </div>
          <div>
            <span className="lux-label">Our Story</span>
            <h2 className="section-title">A Legacy of <em style={{ fontStyle: "italic", color: "var(--gold-2)" }}>Elegance</em></h2>
            <div className="divider" />
            <p className="muted">
              Since 1998, LuxuryStay has set the standard for refined hospitality.
              Every detail — from the warmth of our welcome to the comfort of our suites —
              is crafted around one promise: an unforgettable stay.
            </p>
            <ul className="about-list">
              {aboutPoints.map((point, i) => (
                <li key={i}>
                  <span className="li-ic"><CheckIcon size={16} /></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <span className="lux-label">Hotel Services</span>
        <h2 className="section-title">Everything You Need</h2>
        <div className="divider" />
        <div className="feature-grid">
          {services.map((s) => (
            <div className="feature" key={s.title}>
              <div className="f-icon"><s.icon size={22} /></div>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <span className="lux-label">Accommodation</span>
        <h2 className="section-title">Rooms & Suites</h2>
        <div className="divider" />
        <div className="rooms-grid">
          {rooms.map((room) => <RoomCard key={room._id} room={room} />)}
        </div>
        <div className="center" style={{ marginTop: 28 }}>
          <Link to="/rooms" className="btn btn-outline">View All Rooms</Link>
        </div>
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <span className="lux-label">Guest Stories</span>
        <h2 className="section-title">Loved by Our Guests</h2>
        <div className="divider" />
        <div className="testi-grid">
          {testimonials.map((t) => (
            <div className="testi" key={t.name}>
              <div className="t-stars">
                {Array.from({ length: t.stars }).map((_, i) => <StarIcon key={i} size={14} />)}
              </div>
              <p>{t.text}</p>
              <div className="t-by">
                <div className="avatar small">{t.name[0]}</div>
                <div>
                  <b>{t.name}</b>
                  <div className="muted small">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="cta-banner">
          <span className="lux-label">Begin Your Journey</span>
          <h2>Reserve Your Stay Today</h2>
          <p>Best rates, instant confirmation and complimentary upgrades for members.</p>
          <Link to="/rooms" className="btn btn-gold">Book Now</Link>
        </div>
      </section>
    </div>
  );
}
