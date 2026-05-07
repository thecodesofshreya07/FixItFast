import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Toast, useToast } from "../components/Card";
import { sendOtp, verifyOtp, register } from "../services/api";
import { useEffect } from "react";

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  // 1 = form entry
  // 2 = OTP verification
  const { login } = useAuth();
  const { toast, show, hide } = useToast();

  const [form, setForm] = useState({ Customer_name: "", Address: "", Email: "", Password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const set = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.Customer_name.trim()) e.Customer_name = "Full name is required";
    if (!form.Address.trim()) e.Address = "Address is required";
    if (!form.Email.trim()) {
      e.Email = "Email is required";
    }
    else if (!/\S+@\S+\.\S+/.test(form.Email)) {
      e.Email = "Enter a valid email";
    }
    if (!form.Password) e.Password = "Password is required";
    else if (form.Password.length < 6) e.Password = "Minimum 6 characters";
    if (form.Password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  useEffect(() => {
    setErrors({});
  }, [step]);

  const validateForOtp = () => {
    const e = {};

    if (!form.Customer_name.trim()) e.Customer_name = "Full name is required";
    if (!form.Address.trim()) e.Address = "Address is required";
    if (!form.Email.trim()) e.Email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.Email)) e.Email = "Enter a valid email";

    // 🔥 ADD THIS (important fix)
    if (!form.Password) e.Password = "Password is required";
    else if (form.Password.length < 6) e.Password = "Minimum 6 characters";

    if (form.Password !== form.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    return e;
  };

  const handleSubmit = async (e) => {
    //console.log("handleSubmit fired", { loading, otp, otp_length: otp.length });
    if (typeof e?.preventDefault === "function") e.preventDefault();
    if (loading) return;

    // 1. Validate OTP format first (no API call yet)
    if (!otp || otp.length !== 6) {
      show({ type: "error", message: "Enter valid 6-digit OTP" });
      return;
    }

    // 2. Validate form fields before touching the OTP store
    const errs = validate();
     //console.log("validation errors:", errs);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true); // disable button only when we're actually going async

    try {
      //console.log("calling verifyOtp..."); // 👈 ADD THIS
      // 3. NOW verify OTP (store will be cleared only on success)
      await verifyOtp({ email: form.Email, otp });
//console.log("verifyOtp success, calling register..."); // 👈 ADD THIS
      const { confirmPassword, ...payload } = form;
      const res = await register(payload);
//console.log("register success:", res); // 👈 ADD THIS
      login(res.data.data);
      show({ type: "success", message: "Account created successfully!" });
      setOtp("");
      navigate("/services");

    } catch (err) {
      //console.error("CAUGHT ERROR:", err); // 👈 ADD THIS
      show({
        type: "error",
        message: err.response?.data?.error || err.message,
      });
    } finally {
      setLoading(false);
    }
  };



  const handleSendOtp = async () => {
    const errs = validateForOtp();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      setLoadingOtp(true);
      await sendOtp({ email: form.Email });
      show({
        type: "success",
        message: "OTP sent to email"
      });
      setStep(2);
    } catch (err) {
      show({
        type: "error",
        message: err.message
      });
    } finally {
      setLoadingOtp(false);
    }
  };


  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (step === 2) {
      handleSubmit(e);
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

          <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {step === 1 && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" placeholder="e.g. Harry Messi" value={form.Customer_name} onChange={set("Customer_name")} />
                  {errors.Customer_name && <span style={s.error}>{errors.Customer_name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input className="form-input" placeholder="e.g. Thane, Maharashtra" value={form.Address} onChange={set("Address")} />
                  {errors.Address && <span style={s.error}>{errors.Address}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="Enter your email"
                    value={form.Email}
                    onChange={e => setForm({ ...form, Email: e.target.value })}
                  />
                  {errors.Email && <span style={s.error}>{errors.Email}</span>}
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
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSendOtp}
                  disabled={loadingOtp || step === 2}
                >
                  {loadingOtp ? "Sending OTP..." : "Generate OTP"}
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <div className="form-group">
                  <label>Enter OTP</label>
                  <input
                    className="form-input"
                    value={otp}
                    maxLength={6}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter OTP sent to email"
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify OTP & Create Account"}
                </button>
              </>
            )}
          </form>

          <p style={s.switchText}>
            Already have an account?{" "}
            <Link to="/login" style={s.switchLink}>Log in</Link>
          </p>
        </div>
      </div>

      {toast?.message && (
        <Toast
          message={toast.message}
          type={toast.type || "info"}
          onClose={hide}
        />
      )}    </div>
  );
}

const s = {
  leftContent: { display: "flex", flexDirection: "column", gap: 28, maxWidth: 420 },
  logoLink: { display: "flex", alignItems: "center", gap: 10, textDecoration: "none" },
  logoText: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.4rem", color: "white", letterSpacing: "-0.02em" },
  leftTitle: { fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, color: "white", lineHeight: 1.15, letterSpacing: "-0.03em" },
  leftSub: { fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 },
  stepNum: { width: 30, height: 30, borderRadius: "50%", background: "var(--brand-primary)", color: "white", fontWeight: 800, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  formTitle: { fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 4vw, 2rem)", fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" },
  formSub: { color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 28 },
  eyeBtn: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", padding: 4, lineHeight: 1, boxShadow: "none" },
  error: { fontSize: "0.8rem", color: "#E53E3E", fontWeight: 500 },
  switchText: { marginTop: 24, textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)" },
  switchLink: { color: "var(--brand-primary)", fontWeight: 700, textDecoration: "none" },
};
