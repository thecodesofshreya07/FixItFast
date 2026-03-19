import { Link } from "react-router-dom";
import { SERVICES } from "../services/api";

const FEATURES = [
  { icon: "✅", title: "Verified Professionals", desc: "Background-checked experts you can trust" },
  { icon: "⏱️", title: "On-Time Guarantee",      desc: "Professionals arrive within the scheduled slot" },
  { icon: "💰", title: "Transparent Pricing",    desc: "Fixed prices — zero surprise charges" },
  { icon: "🛡️", title: "Service Warranty",       desc: "Free re-service if you're not satisfied" },
];

const STATS = [
  { value: "10+",  label: "Services"      },
  { value: "10",   label: "Professionals" },
  { value: "4.8★", label: "Avg Rating"    },
  { value: "100%", label: "Satisfaction"  },
];

const STEPS = [
  { n: "01", icon: "🔍", title: "Browse Services",  desc: "Pick from 10+ home services tailored to your needs." },
  { n: "02", icon: "📅", title: "Book Instantly",   desc: "Choose a date and confirm your booking in seconds." },
  { n: "03", icon: "🏠", title: "Get It Fixed",     desc: "A verified professional arrives and gets the job done." },
];

export default function Home() {
  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>

      {/* ════════════════════════════════ HERO */}
      <section style={S.hero}>
        <div style={S.heroBg} aria-hidden="true" />

        <div className="container" style={S.heroInner}>
          {/* Badge */}
          <span style={S.badge}>🏆 Trusted Home Repair Platform</span>

          {/* Title */}
          <h1 style={S.heroTitle}>
            Expert Services,<br />
            <span style={S.heroHighlight}>Right at Your Door</span>
          </h1>

          {/* Sub-text */}
          <p style={S.heroSub}>
            From plumbing to painting — book verified professionals
            for any home service in minutes. Transparent pricing, guaranteed quality.
          </p>

          {/* CTAs — uses .hero-ctas CSS class */}
          <div className="hero-ctas" style={{ marginTop: "var(--space-sm)" }}>
            <Link to="/services" className="btn btn-primary" style={S.ctaBtn}>
              Explore Services →
            </Link>
            <Link to="/bookings" className="btn btn-ghost" style={S.ctaBtn}>
              View My Bookings
            </Link>
          </div>

          {/* Stats — uses .stats-bar / .stat-item CSS classes */}
          <div className="stats-bar" style={{ marginTop: "var(--space-lg)" }}>
            {STATS.map(({ value, label }) => (
              <div key={label} className="stat-item">
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ SERVICES PREVIEW */}
      <section className="section" style={{ background: "var(--bg-muted)" }}>
        <div className="container">
          <div style={S.sectionHeader}>
            <div>
              <div className="eyebrow">Our Services</div>
              <h2 className="section-title">What can we help with?</h2>
            </div>
            <Link to="/services" className="btn btn-outline">View All →</Link>
          </div>

          <div className="grid-3" style={{ marginTop: "var(--space-md)" }}>
            {SERVICES.slice(0, 6).map(s => (
              <Link key={s.Service_Id} to="/services" style={{ textDecoration: "none" }}>
                <div className="card" style={S.serviceCard}>
                  <span style={S.serviceIcon}>{s.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={S.serviceName}>{s.Service_type}</p>
                    <p style={S.servicePrice}>Starts at ₹{s.Service_charge}</p>
                  </div>
                  <span style={S.arrow}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <div style={S.centredHead}>
            <div className="eyebrow">Simple Process</div>
            <h2 className="section-title" style={{ marginTop: 6 }}>How it works</h2>
          </div>
          <div className="grid-3" style={{ marginTop: "var(--space-md)" }}>
            {STEPS.map(({ n, icon, title, desc }) => (
              <div key={n} className="card" style={S.stepCard}>
                <span style={S.stepNum}>{n}</span>
                <span style={S.stepIcon}>{icon}</span>
                <p style={S.stepTitle}>{title}</p>
                <p style={S.stepDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ WHY FIXITFAST */}
      <section className="section" style={{ background: "var(--bg-muted)" }}>
        <div className="container">
          <div style={S.centredHead}>
            <div className="eyebrow">Why FixItFast?</div>
            <h2 className="section-title" style={{ marginTop: 6 }}>
              We make home care{" "}
              <em style={{ fontStyle: "italic", color: "var(--brand-primary)" }}>effortless</em>
            </h2>
          </div>
          <div className="grid-2" style={{ marginTop: "var(--space-md)" }}>
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="card" style={S.featureCard}>
                <span style={S.featureIcon}>{icon}</span>
                <div>
                  <p style={S.featureTitle}>{title}</p>
                  <p style={S.featureDesc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ CTA BANNER */}
      <section style={S.ctaBanner}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={S.bannerTitle}>Ready to book a service?</h2>
          <p style={S.bannerSub}>Choose from 10+ services. Get started in under 2 minutes.</p>
          <Link to="/services" className="btn" style={S.bannerBtn}>
            Book Now →
          </Link>
        </div>
      </section>

    </div>
  );
}

const S = {
  /* ── Hero ── */
  hero: {
    position: "relative",
    width: "100%",
    padding: "clamp(52px,8vw,100px) 0 clamp(44px,6vw,80px)",
    overflow: "hidden",
  },
  heroBg: {
    position: "absolute", inset: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,90,31,0.09) 0%, transparent 70%)",
  },
  heroInner: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",   /* centres children horizontally */
    textAlign: "center",    /* centres inline text */
    gap: "clamp(14px,2.5vw,22px)",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(255,90,31,0.09)",
    color: "var(--brand-primary)",
    padding: "6px 16px",
    borderRadius: "var(--radius-full)",
    fontSize: "clamp(0.65rem,1.5vw,0.8rem)",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    border: "1px solid rgba(255,90,31,0.2)",
  },
  heroTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-3xl)",
    fontWeight: 800,
    lineHeight: 1.06,
    letterSpacing: "-0.03em",
    color: "var(--text-primary)",
    maxWidth: "14em",
    width: "100%",
  },
  heroHighlight: {
    background: "linear-gradient(135deg,var(--brand-primary),var(--brand-deep))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSub: {
    fontSize: "var(--text-md)",
    color: "var(--text-secondary)",
    lineHeight: 1.65,
    maxWidth: "36em",
    width: "100%",
  },
  ctaBtn: { fontSize: "var(--text-base)", minWidth: 160 },

  /* ── Section header ── */
  sectionHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "var(--space-sm)",
  },
  centredHead: {
    textAlign: "center",
    marginBottom: "var(--space-md)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  /* ── Service cards ── */
  serviceCard: {
    display: "flex",
    alignItems: "center",
    gap: "clamp(10px,2vw,16px)",
    padding: "clamp(14px,2vw,20px)",
    cursor: "pointer",
  },
  serviceIcon: {
    fontSize: "clamp(1.4rem,3vw,1.9rem)",
    flexShrink: 0,
    width: "clamp(38px,5vw,50px)",
    height: "clamp(38px,5vw,50px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg-muted)",
    borderRadius: "var(--radius-md)",
  },
  serviceName:  { fontWeight: 600, fontSize: "var(--text-base)", color: "var(--text-primary)" },
  servicePrice: { fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: 2 },
  arrow: { marginLeft: "auto", color: "var(--text-muted)", fontSize: "1rem", flexShrink: 0 },

  /* ── How steps ── */
  stepCard: {
    display: "flex", flexDirection: "column",
    alignItems: "center", textAlign: "center",
    padding: "clamp(20px,3vw,32px) clamp(16px,2.5vw,24px)",
    gap: 6,
  },
  stepNum: {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-xs)",
    fontWeight: 800,
    color: "var(--brand-primary)",
    letterSpacing: "0.08em",
    background: "rgba(255,90,31,0.1)",
    padding: "3px 10px",
    borderRadius: "var(--radius-full)",
    border: "1px solid rgba(255,90,31,0.18)",
  },
  stepIcon:  { fontSize: "clamp(1.6rem,3vw,2.2rem)", margin: "6px 0 2px" },
  stepTitle: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-base)", marginTop: 2 },
  stepDesc:  { fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 4 },

  /* ── Features ── */
  featureCard:  { display: "flex", alignItems: "flex-start", gap: "clamp(12px,2vw,18px)", padding: "clamp(20px,2.5vw,28px)" },
  featureIcon:  { fontSize: "clamp(1.4rem,2.5vw,1.7rem)", flexShrink: 0 },
  featureTitle: { fontWeight: 700, fontSize: "var(--text-base)", marginBottom: 4 },
  featureDesc:  { fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.55 },

  /* ── CTA Banner ── */
  ctaBanner: {
    background: "linear-gradient(135deg,var(--brand-primary) 0%,var(--brand-deep) 100%)",
    padding: "clamp(44px,6vw,80px) 0",
    width: "100%",
  },
  bannerTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-2xl)",
    fontWeight: 800,
    color: "white",
    marginBottom: 10,
  },
  bannerSub: { color: "rgba(255,255,255,0.82)", marginBottom: "var(--space-md)", fontSize: "var(--text-base)" },
  bannerBtn: {
    background: "white",
    color: "var(--brand-primary)",
    padding: "clamp(12px,2vw,16px) clamp(24px,4vw,44px)",
    fontSize: "var(--text-base)",
    fontWeight: 700,
    borderRadius: "var(--radius-full)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },
};
