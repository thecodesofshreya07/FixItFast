import { useEffect, useState } from "react";
import { getServices } from "../services/api";
import { getBookings, getProfessionals } from "../services/api";
import { useNavigate } from "react-router-dom";
import { StarRating } from "../components/Card";

const PRICE_OPTIONS = [
  { label: "All Prices", value: Infinity },
  { label: "Under ₹700", value: 700 },
  { label: "Under ₹1000", value: 1000 },
  { label: "Under ₹1200", value: 1200 },
  { label: "Under ₹1500", value: 1500 },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const [serviceRes, profRes] = await Promise.all([
        getServices(),
        getProfessionals()
      ]);
      setServices(serviceRes?.data?.data || []);
      setProfessionals(profRes?.data?.data || []);
    }
    fetchData();
  }, []);

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(Infinity);

  const filtered = services.filter(s =>
    s.Service_type.toLowerCase().includes(search.toLowerCase()) &&
    s.Service_charge <= maxPrice
  );

  const getPro = (serviceId) =>
  professionals.find(p => p.Service_Id === serviceId);


  return (
    <div style={{ width: "100%" }}>

      {/* ── Page header ── */}
      <div className="page-header">
        <div className="container">
          <div className="eyebrow">All Services</div>
          <h1 className="section-title">Choose Your Service</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 8, fontSize: "var(--text-sm)" }}>
            {services.length} professional services for your home
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "var(--space-md)", paddingBottom: "var(--space-xl)" }}>

        {/* ── Filters bar ── */}
        <div style={S.filtersBar}>
          {/* Search */}
          <div style={S.searchWrap}>
            <span style={S.searchIcon}>🔍</span>
            <input
              className="form-input"
              style={{ paddingLeft: 40, background: "white", flex: 1 }}
              placeholder="Search services…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Price chips */}
          <div style={S.chips}>
            {PRICE_OPTIONS.map(opt => (
              <button
                key={opt.label}
                onClick={() => setMaxPrice(opt.value)}
                style={{
                  ...S.chip,
                  background: maxPrice === opt.value ? "var(--brand-primary)" : "var(--bg-muted)",
                  color: maxPrice === opt.value ? "white" : "var(--text-secondary)",
                  border: `1.5px solid ${maxPrice === opt.value ? "var(--brand-primary)" : "var(--border)"}`,
                  fontWeight: maxPrice === opt.value ? 700 : 500,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "var(--space-sm)", marginTop: 4 }}>
          Showing {filtered.length} service{filtered.length !== 1 ? "s" : ""}
        </p>
        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p className="empty-state-title">No services found</p>
            <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>Try adjusting your search or price filter</p>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => { setSearch(""); setMaxPrice(Infinity); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map(service => (
              <ServiceCard
                key={service.Service_Id}
                service={service}
                professional={getPro(service.Service_Id)} 
                onBook={() => navigate("/book", { state: service })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceCard({ service, professional, onBook }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="card"
      style={{
        display: "flex", flexDirection: "column",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transform: hovered ? "translateY(-5px)" : "none",
        borderColor: hovered ? "var(--brand-accent)" : "var(--border)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon band */}
      <div style={S.iconBand}>
        <span style={S.svcIcon}>{service.icon}</span>
        <span style={S.svcPrice}>₹{service.Service_charge}</span>
      </div>

      {/* Body */}
      <div style={S.cardBody}>
        <h3 style={S.svcName}>{service.Service_type}</h3>
        <p style={S.svcDesc}>{service.description}</p>

        {professional && (
          <div style={S.proRow}>
            <div style={S.proAvatar}>{professional.Professional_name[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={S.proName}>{professional.Professional_name}</p>
              <p style={S.proLabel}>Assigned Professional</p>
            </div>
            <StarRating rating={professional.Rating} />
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
          onClick={onBook}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

const S = {
  /* Filters */
  filtersBar: {
    display: "flex",
    gap: "clamp(10px,2vw,16px)",
    alignItems: "center",
    flexWrap: "wrap",
    background: "white",
    padding: "clamp(12px,2vw,18px) clamp(14px,2vw,20px)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border)",
    marginBottom: "var(--space-sm)",
  },
  searchWrap: { position: "relative", flex: "1 1 200px", display: "flex" },
  searchIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: "0.9rem", pointerEvents: "none" },
  chips: { display: "flex", gap: 8, flexWrap: "wrap" },
  chip: {
    padding: "8px clamp(10px,1.5vw,16px)",
    fontSize: "clamp(0.72rem,1.5vw,0.82rem)",
    borderRadius: "var(--radius-full)",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },

  /* Service card */
  iconBand: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "clamp(14px,2vw,22px) clamp(14px,2vw,20px) clamp(12px,1.5vw,18px)",
    background: "linear-gradient(135deg,#FFF5F0,#FFF0E8)",
    borderBottom: "1px solid rgba(255,90,31,0.1)",
  },
  svcIcon: { fontSize: "clamp(1.8rem,3vw,2.4rem)" },
  svcPrice: { fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem,2vw,1.3rem)", fontWeight: 800, color: "var(--brand-primary)" },

  cardBody: { padding: "clamp(14px,2vw,20px)", display: "flex", flexDirection: "column", gap: "clamp(8px,1.5vw,12px)" },
  svcName: { fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 700 },
  svcDesc: { fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: 1.55 },

  proRow: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "clamp(8px,1.5vw,12px)",
    background: "var(--bg-muted)", borderRadius: "var(--radius-sm)",
  },
  proAvatar: {
    width: "clamp(28px,3.5vw,36px)", height: "clamp(28px,3.5vw,36px)",
    borderRadius: "50%",
    background: "linear-gradient(135deg,var(--brand-primary),var(--brand-deep))",
    color: "white", fontWeight: 700, fontSize: "var(--text-sm)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  proName: { fontWeight: 600, fontSize: "var(--text-xs)", color: "var(--text-primary)" },
  proLabel: { fontSize: "clamp(0.6rem,1.2vw,0.72rem)", color: "var(--text-muted)" },
};
