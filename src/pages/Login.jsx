import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginCustomer } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Toast, useToast } from "../components/Card";

export default function Login() {
  const navigate        = useNavigate();
  const location        = useLocation();
  const { login }       = useAuth();
  const { toast, show, hide } = useToast();

  const from = location.state?.from?.pathname || "/";

  const [form,     setForm    ] = useState({ Contact: "", Password: "" });
  const [errors,   setErrors  ] = useState({});
  const [loading,  setLoading ] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.Contact.trim())  e.Contact  = "Contact number is required";
    if (!form.Password.trim()) e.Password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await loginCustomer(form);
      login(res.data.data);
      navigate(from, { replace: true });
    } catch (err) {
      show(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ── Left panel (hidden on mobile via CSS) ── */}
      <div className="auth-left">
        <div style={s.leftContent}>
          <Link to="/" style={s.logoLink}>
            <span style={{ fontSize: "1.8rem" }}>🔧</span>
            <span style={s.logoText}>FixItFast<span style={{ color: "var(--brand-accent)" }}>.</span></span>
          </Link>
          <h2 style={s.leftTitle}>Your home,<br />our expertise.</h2>
          <p style={s.leftSub}>Book trusted professionals for any home fix — quickly, easily, reliably.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            {["✅ Verified Professionals", "⏱️ On-Time Guarantee", "🛡️ Service Warranty"].map(f => (
              <span key={f} style={s.trustChip}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">
        <div className="auth-form-card">

          {/* Mobile-only logo (shown via CSS when left panel is hidden) */}
          <div className="auth-mobile-logo" style={{ display: "none", alignItems: "center", gap: 8, marginBottom: 28 }}>
            <span style={{ fontSize: "1.5rem" }}>🔧</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--text-primary)" }}>
              FixItFast<span style={{ color: "var(--brand-primary)" }}>.</span>
            </span>
          </div>

          <h1 style={s.formTitle}>Welcome back</h1>
          <p style={s.formSub}>Log in to your FixItFast account</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input
                className="form-input"
                placeholder="Enter your registered contact number"
                value={form.Contact}
                onChange={e => setForm({ ...form, Contact: e.target.value })}
              />
              {errors.Contact && <span style={s.error}>{errors.Contact}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="form-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  style={{ paddingRight: 48 }}
                  value={form.Password}
                  onChange={e => setForm({ ...form, Password: e.target.value })}
                />
                <button type="button" style={s.eyeBtn} onClick={() => setShowPass(v => !v)} aria-label="Toggle password">
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.Password && <span style={s.error}>{errors.Password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "1rem", marginTop: 4 }}
            >
              {loading ? "Logging in…" : "Log In →"}
            </button>
          </form>

          <p style={s.switchText}>
            Don't have an account?{" "}
            <Link to="/signup" style={s.switchLink}>Sign up free</Link>
          </p>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  );
}

const s = {
  leftContent: { display: "flex", flexDirection: "column", gap: 28, maxWidth: 420 },
  logoLink:    { display: "flex", alignItems: "center", gap: 10, textDecoration: "none" },
  logoText:    { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.4rem", color: "white", letterSpacing: "-0.02em" },
  leftTitle:   { fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "white", lineHeight: 1.1, letterSpacing: "-0.03em" },
  leftSub:     { fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 },
  trustChip:   { fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 },
  formTitle:   { fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 4vw, 2rem)", fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" },
  formSub:     { color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 28 },
  eyeBtn:      { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", padding: 4, lineHeight: 1, boxShadow: "none" },
  error:       { fontSize: "0.8rem", color: "#E53E3E", fontWeight: 500 },
  switchText:  { marginTop: 24, textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)" },
  switchLink:  { color: "var(--brand-primary)", fontWeight: 700, textDecoration: "none" },
};
