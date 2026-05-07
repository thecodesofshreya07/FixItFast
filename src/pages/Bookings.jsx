import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBookings, getProfessionals, getServices } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/Card";

const STATUS_FILTERS = ["All", "Pending", "Completed", "Cancelled"];

export default function Bookings() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const bRes = await getBookings(currentUser?.Customer_Id);
        const pRes = await getProfessionals();
        const sRes = await getServices();

        setBookings(bRes.data.data);
        setProfessionals(pRes.data.data);
        setServices(sRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) fetchData();
  }, [currentUser]);

  const displayed = filter === "All"
    ? bookings
    : bookings.filter(b => b.Booking_Status === filter);

  const getProfessional = id =>
    professionals.find(p => p.Professional_Id === id);

  const getService = id =>
    services.find(s => s.Service_Id === id);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="eyebrow">My Bookings</div>
          <h1 className="section-title">Booking History</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 8, fontSize: "0.9rem" }}>
            {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "32px 24px 64px" }}>

        {/* Status filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {STATUS_FILTERS.map(f => {
            const count = f === "All" ? bookings.length : bookings.filter(b => b.Booking_Status === f).length;
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: "var(--radius-full)",
                  border: `1.5px solid ${active ? "var(--brand-primary)" : "var(--border)"}`,
                  background: active ? "var(--brand-primary)" : "white",
                  color: active ? "white" : "var(--text-secondary)",
                  fontWeight: active ? 700 : 500, fontSize: "0.85rem",
                  cursor: "pointer", transition: "all 0.2s", fontFamily: "var(--font-body)",
                }}
              >
                {f}
                <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 7px", borderRadius: "var(--radius-full)", background: active ? "rgba(255,255,255,0.25)" : "var(--bg-muted)", color: active ? "white" : "var(--text-muted)" }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <Spinner />
        ) : displayed.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p className="empty-state-title">No {filter !== "All" ? filter.toLowerCase() + " " : ""}bookings found</p>
            <Link to="/services" className="btn btn-primary" style={{ marginTop: 12 }}>Book a Service</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {displayed.map(booking => {
              const professional = getProfessional(booking.Professional_Id);
              const service = getService(booking.Service_Id);
              return (
                <BookingCard
                  key={booking.Booking_Id}
                  booking={booking}
                  customerName={currentUser?.Customer_name}
                  professional={professional}
                  service={service}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, customerName, professional, service }) {
  const statusConfig = {
    Pending: { color: "#E65100", bg: "#FFF3E0", dot: "#FF9800" },
    Completed: { color: "#2E7D32", bg: "#E8F5E9", dot: "#4CAF50" },
    Cancelled: { color: "#C62828", bg: "#FEECEC", dot: "#F44336" },
  };
  const sc = statusConfig[booking.Booking_Status] || statusConfig.Pending;

  const formatDate = d => {
    try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return d; }
  };

  return (
    <div className="card" style={{ display: "flex", overflow: "hidden", padding: 0 }}>
      {/* Colour accent bar */}
      <div style={{ width: 4, background: sc.dot, flexShrink: 0 }} />

      <div style={{ flex: 1, padding: "18px 20px" }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "1.7rem", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-muted)", borderRadius: "var(--radius-md)", flexShrink: 0 }}>
              {service?.icon || "🔧"}
            </span>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem" }}>
                {service?.Service_type || "Service"}
              </p>
              <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: 2 }}>
                Ref #{booking.Booking_Id}
              </p>
            </div>
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 13px", borderRadius: "var(--radius-full)", background: sc.bg, color: sc.color, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
            {booking.Booking_Status}
          </div>
        </div>

        <div className="divider" style={{ margin: "14px 0" }} />

        {/* Detail grid — CSS class handles responsive breakpoints */}
        <div className="details-grid">
          <DetailItem icon="🔧" label="Professional" value={professional?.Professional_name || "—"} />
          <DetailItem icon="📅" label="Date" value={formatDate(booking.Booking_date)} />
          <DetailItem icon="💰" label="Charge" value={service ? `₹${service.Service_charge}` : "—"} />
          <DetailItem icon="⭐" label="Rating" value={professional ? `${professional?.Rating || 4.5} / 5` : "—"} />
        </div>

        {/* Pay Now — only show on Pending */}
        {booking.Booking_Status === "Pending" && (
          <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
            <Link
              to="/payment"
              state={{ bookingId: booking.Booking_Id, amount: service?.Service_charge }}
              className="btn btn-primary"
              style={{ fontSize: "0.82rem", padding: "9px 18px" }}
            >
              Pay Now →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {icon} {label}
      </span>
      <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{value}</span>
    </div>
  );
}
