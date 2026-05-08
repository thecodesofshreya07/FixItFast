import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../services/api";
import { Toast, useToast } from "../components/Card";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { toast, show, hide } = useToast(); // ✅ was missing entirely

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSendOtp = async () => {
    if (!email.trim()) {
      show({ type: "error", message: "Please enter your email" });
      return;
    }
    try {
      setLoading(true);
      await forgotPassword({ email });
      show({ type: "success", message: "OTP sent to your email" });
      setStep(2);
    } catch (err) {
      show({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!otp || otp.length !== 6) {
      show({ type: "error", message: "Enter a valid 6-digit OTP" });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      show({ type: "error", message: "Password must be at least 6 characters" });
      return;
    }
    if (newPassword !== confirmPassword) {
      show({ type: "error", message: "Passwords do not match" });
      return;
    }
    try {
      setLoading(true);
      await resetPassword({ email, otp, newPassword });
      show({ type: "success", message: "Password updated successfully!" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      show({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ── Left panel ── */}
      <div className="auth-left">
        <div style={s.leftContent}>
          <Link to="/" style={s.logoLink}>
            <span style={{ fontSize: "1.8rem" }}>🔧</span>
            <span style={s.logoText}>FixItFast<span style={{ color: "var(--brand-accent)" }}>.</span></span>
          </Link>
          <h2 style={s.leftTitle}>Reset your password.</h2>
          <p style={s.leftSub}>Enter your registered email and we'll send you a one-time password to get back in.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 4 }}>
            {[
              { n: "1", label: "Enter your email" },
              { n: "2", label: "Verify OTP from email" },
              { n: "3", label: "Set a new password" },
            ].map(st => (
              <div key={st.n} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{
                  ...s.stepNum,
                  background: step > Number(st.n) ? "#4CAF50" : "var(--brand-primary)"
                }}>{step > Number(st.n) ? "✓" : st.n}</span>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", fontWeight: 500 }}>{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">
        <div className="auth-form-card">

          {/* Mobile logo */}
          <div className="auth-mobile-logo" style={{ display: "none", alignItems: "center", gap: 8, marginBottom: 28 }}>
            <span style={{ fontSize: "1.5rem" }}>🔧</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--text-primary)" }}>
              FixItFast<span style={{ color: "var(--brand-primary)" }}>.</span>
            </span>
          </div>

          <h1 style={s.formTitle}>
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h1>
          <p style={s.formSub}>
            {step === 1
              ? "Enter your registered email to receive an OTP"
              : `OTP sent to ${email} — check your inbox (and spam)`}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Step 1: Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={step === 2}
                style={{ opacity: step === 2 ? 0.6 : 1 }}
              />
            </div>

            {/* Step 2: OTP + new password */}
            {step === 2 && (
              <>
                <div className="form-group">
                  <label className="form-label">OTP</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="form-input"
                      type={showPass ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      style={{ paddingRight: 48 }}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      style={s.eyeBtn}
                      onClick={() => setShowPass(v => !v)}
                    >
                      {showPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            {step === 1 ? (
              <button
                className="btn btn-primary"
                onClick={handleSendOtp}
                disabled={loading}
                style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "1rem" }}
              >
                {loading ? "Sending OTP..." : "Send OTP →"}
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  onClick={handleReset}
                  disabled={loading || otp.length !== 6}
                  style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "1rem" }}
                >
                  {loading ? "Updating..." : "Reset Password →"}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(""); setNewPassword(""); setConfirmPassword(""); }}
                  style={{ background: "none", border: "none", color: "var(--brand-primary)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", textAlign: "center" }}
                >
                  ← Change email / Resend OTP
                </button>
              </>
            )}
          </div>

          <p style={s.switchText}>
            Remembered it?{" "}
            <Link to="/login" style={s.switchLink}>Log in</Link>
          </p>
        </div>
      </div>

      {toast?.message && (
        <Toast message={toast.message} type={toast.type || "info"} onClose={hide} />
      )}
    </div>
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
