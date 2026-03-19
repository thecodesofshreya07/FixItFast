import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { pathname }            = useLocation();
  const navigate                = useNavigate();
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const links = [
    { to: "/",         label: "Home"     },
    { to: "/services", label: "Services" },
    ...(currentUser ? [
      { to: "/book",     label: "Book"     },
      { to: "/bookings", label: "Bookings" },
      { to: "/payment",  label: "Payment"  },
    ] : []),
  ];

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <nav className="navbar-inner container">

        {/* ── Logo ── */}
        <Link to="/" style={s.logo}>
          <span style={{ fontSize: "1.35rem" }}>🔧</span>
          <span style={s.logoText}>FixItFast<span style={{ color: "var(--brand-primary)" }}>.</span></span>
        </Link>

        {/* ── Desktop nav links ── */}
        <div className="navbar-links">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} style={{ ...s.link, ...(pathname === to ? s.linkActive : {}) }}>
              {label}
              {pathname === to && <span style={s.dot} />}
            </Link>
          ))}
        </div>

        {/* ── Desktop right actions ── */}
        <div className="navbar-actions">
          {currentUser ? (
            <div style={{ position: "relative" }}>
              <button style={s.avatarBtn} onClick={() => setDropOpen(o => !o)}>
                <span style={s.avatarCircle}>{currentUser.Customer_name?.[0]?.toUpperCase()}</span>
                <span style={s.avatarName}>{currentUser.Customer_name}</span>
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>▾</span>
              </button>

              {dropOpen && (
                <div style={s.dropdown}>
                  <div style={s.dropHead}>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{currentUser.Customer_name}</p>
                    <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 2 }}>{currentUser.Contact}</p>
                    <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 1 }}>{currentUser.Address}</p>
                  </div>
                  <div style={s.dropDiv} />
                  {[
                    { label: "📋 My Bookings", to: "/bookings" },
                    { label: "💳 Payments",    to: "/payment"  },
                  ].map(item => (
                    <button key={item.to} style={s.dropItem} onClick={() => { navigate(item.to); setDropOpen(false); }}>
                      {item.label}
                    </button>
                  ))}
                  <div style={s.dropDiv} />
                  <button style={{ ...s.dropItem, color: "#E53E3E" }} onClick={handleLogout}>
                    🚪 Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login"  className="btn btn-ghost"   style={{ fontSize: "0.85rem", padding: "9px 18px" }}>Log In</Link>
              <Link to="/signup" className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "10px 20px" }}>Sign Up</Link>
            </>
          )}

          {/* Hamburger */}
          <button className="navbar-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span className="navbar-bar" style={{ transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span className="navbar-bar" style={{ opacity: menuOpen ? 0 : 1 }} />
            <span className="navbar-bar" style={{ transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="navbar-mobile">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`navbar-mobile-link${pathname === to ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          {!currentUser ? (
            <>
              <Link to="/login"  className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/signup" className="navbar-mobile-link" style={{ color: "var(--brand-primary)", fontWeight: 700, borderBottom: "none" }} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          ) : (
            <>
              <div style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{currentUser.Customer_name}</p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>{currentUser.Address}</p>
              </div>
              <button
                onClick={handleLogout}
                style={{ padding: "13px 0", background: "none", border: "none", cursor: "pointer", color: "#E53E3E", fontWeight: 600, fontFamily: "var(--font-body)", fontSize: "1rem", textAlign: "left" }}
              >
                🚪 Log Out
              </button>
            </>
          )}
        </div>
      )}

      {/* Click-away for dropdown */}
      {dropOpen && <div style={{ position: "fixed", inset: 0, zIndex: 98 }} onClick={() => setDropOpen(false)} />}
    </header>
  );
}

const s = {
  logo: { display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 },
  logoText: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.15rem", color: "var(--text-primary)", letterSpacing: "-0.02em" },
  link: { position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "7px 13px", fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none", borderRadius: "var(--radius-full)", transition: "var(--transition)" },
  linkActive: { color: "var(--brand-primary)", background: "rgba(255,90,31,0.07)", fontWeight: 700 },
  dot: { display: "block", width: 4, height: 4, borderRadius: "50%", background: "var(--brand-primary)" },
  avatarBtn: { display: "flex", alignItems: "center", gap: 8, background: "var(--bg-muted)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-full)", padding: "5px 12px 5px 5px", cursor: "pointer", fontFamily: "var(--font-body)", transition: "var(--transition)", position: "relative", zIndex: 99 },
  avatarCircle: { width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, var(--brand-primary), var(--brand-deep))", color: "white", fontWeight: 800, fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center" },
  avatarName: { fontWeight: 600, fontSize: "0.83rem", color: "var(--text-primary)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  dropdown: { position: "absolute", top: "calc(100% + 10px)", right: 0, width: 220, background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", zIndex: 99, overflow: "hidden" },
  dropHead: { padding: "14px 16px", background: "var(--bg-muted)" },
  dropDiv: { height: 1, background: "var(--border)" },
  dropItem: { display: "block", width: "100%", padding: "11px 16px", background: "none", border: "none", textAlign: "left", fontSize: "0.875rem", fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--text-primary)", cursor: "pointer" },
};
