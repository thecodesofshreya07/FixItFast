import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Toast, useToast } from "../components/Card";

export default function Signup() {
  const navigate        = useNavigate();
  const { login }       = useAuth();
  const { toast, show, hide } = useToast();

  const [form, setForm] = useState({ Customer_name: "", Address: "", Contact: "", Password: "", confirmPassword: "" });
  const [errors,   setErrors  ] = useState({});
  const [loading,  setLoading ] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.Customer_name.trim())    e.Customer_name   = "Full name is required";
    if (!form.Address.trim())          e.Address         = "Address is required";
    if (!form.Contact.trim())          e.Contact         = "Contact number is required";
    else if (!/^\d{10}$/.test(form.Contact.trim())) e.Contact = "Enter a valid 10-digit number";
    if (!form.Password)                e.Password        = "Password is required";
    else if (form.Password.length < 6) e.Password        = "Minimum 6 characters";
    if (form.Password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { confirmPassword: _, ...payload } = form;
      const res = await register(payload);
      login(res.data.data);
      navigate("/services");
    } catch (err) {
      show(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ── Left panel (hidden on mobile) ── */}
      <div className="auth-left">
        <div style={s.leftContent}>
          <Link to="/" style={s.logoLink}>
            <span style={{ fontSize: "1.8rem" }}>🔧</span>
            <span style={s.logoText}>FixItFast<span style={{ color: "var(--brand-accent)" }}>.</span></span>
          </Link>
          <h2 style={s.leftTitle}>Join thousands of happy homeowners.</h2>
          <p style={s.leftSub}>Create your free account and get instant access to 10+ home services with verified professionals.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 4 }}>
            {[
              { n: "1", label: "Create your account" },
              { n: "2", label: "Browse & pick a service" },
              { n: "3", label: "Book in under 2 minutes" },
            ].map(step => (
              <div key={step.n} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={s.stepNum}>{step.n}</span>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", fontWeight: 500 }}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">
        <div className="auth-form-card">

          {/* Mobile-only logo */}
          <div className="auth-mobile-logo" style={{ display: "none", alignItems: "center", gap: 8, marginBottom: 28 }}>
            <span style={{ fontSize: "1.5rem" }}>🔧</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--text-primary)" }}>
              FixItFast<span style={{ color: "var(--brand-primary)" }}>.</span>
            </span>
          </div>

          <h1 style={s.formTitle}>Create account</h1>
          <p style={s.formSub}>Sign up to book services on FixItFast</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="e.g. Harry Messi" value={form.Customer_name} onChange={set("Customer_name")} />
              {errors.Customer_name && <span style={s.error}>{errors.Customer_name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-input" placeholder="e.g. Badlapur, Maharashtra" value={form.Address} onChange={set("Address")} />
              {errors.Address && <span style={s.error}>{errors.Address}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input className="form-input" placeholder="10-digit mobile number" maxLength={10} value={form.Contact} onChange={set("Contact")} />
              {errors.Contact && <span style={s.error}>{errors.Contact}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="form-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  style={{ paddingRight: 48 }}
                  value={form.Password}
                  onChange={set("Password")}
                />
                <button type="button" style={s.eyeBtn} onClick={() => setShowPass(v => !v)} aria-label="Toggle password">
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.Password && <span style={s.error}>{errors.Password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" placeholder="Re-enter your password" value={form.confirmPassword} onChange={set("confirmPassword")} />
              {errors.confirmPassword && <span style={s.error}>{errors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "1rem", marginTop: 6 }}
            >
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <p style={s.switchText}>
            Already have an account?{" "}
            <Link to="/login" style={s.switchLink}>Log in</Link>
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
  leftTitle:   { fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, color: "white", lineHeight: 1.15, letterSpacing: "-0.03em" },
  leftSub:     { fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 },
  stepNum:     { width: 30, height: 30, borderRadius: "50%", background: "var(--brand-primary)", color: "white", fontWeight: 800, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  formTitle:   { fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 4vw, 2rem)", fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" },
  formSub:     { color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 28 },
  eyeBtn:      { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", padding: 4, lineHeight: 1, boxShadow: "none" },
  error:       { fontSize: "0.8rem", color: "#E53E3E", fontWeight: 500 },
  switchText:  { marginTop: 24, textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)" },
  switchLink:  { color: "var(--brand-primary)", fontWeight: 700, textDecoration: "none" },
};
