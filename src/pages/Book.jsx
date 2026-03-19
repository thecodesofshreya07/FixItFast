import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addBooking, PROFESSIONALS } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Toast, useToast } from "../components/Card";

const today = new Date().toISOString().split("T")[0];

export default function Book() {
  const location        = useLocation();
  const navigate        = useNavigate();
  const { currentUser } = useAuth();
  const { toast, show, hide } = useToast();

  const selectedService = location.state;
  const professional    = selectedService
    ? PROFESSIONALS.find(p => p.Professional_Id === selectedService.Professional_Id)
    : null;

  const [bookingDate, setBookingDate] = useState("");
  const [loading,     setLoading    ] = useState(false);
  const [dateError,   setDateError  ] = useState("");
  const [submitted,   setSubmitted  ] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate) { setDateError("Please choose a date"); return; }
    if (!selectedService) return;
    setDateError("");
    setLoading(true);
    try {
      await addBooking({
        Booking_Id:      Math.floor(Math.random() * 9000) + 1000,
        Customer_Id:     currentUser.Customer_Id,
        Professional_Id: selectedService.Professional_Id,
        Service_Id:      selectedService.Service_Id,
        Booking_date:    bookingDate,
        Booking_Status:  "Pending",
      });
      setSubmitted(true);
      show("Booking confirmed! 🎉", "success");
    } catch {
      show("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ─────────────────────────────────
  if (submitted) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <div className="card animate-fade-up" style={{ maxWidth: 460, width: "100%", margin: "0 auto", padding: "clamp(28px,5vw,52px) clamp(20px,5vw,40px)", textAlign: "center", borderRadius: "var(--radius-xl)" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #E8F5E9, #C8E6C9)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 0 12px rgba(76,175,80,0.08)", fontSize: "2.2rem" }}>✅</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem,4vw,1.7rem)", fontWeight: 800, marginBottom: 10 }}>Booking Confirmed!</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.65 }}>
            Your <strong>{selectedService?.Service_type}</strong> is booked for{" "}
            <strong>{new Date(bookingDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong>.
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 6 }}>
            {professional?.Professional_name} will be your assigned professional.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => navigate("/bookings")}>View My Bookings →</button>
            <button className="btn btn-ghost"   onClick={() => navigate("/services")}>Book Another</button>
          </div>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <button className="btn btn-ghost" style={{ marginBottom: 16, fontSize: "0.82rem" }} onClick={() => navigate("/services")}>
            ← Back to Services
          </button>
          <div className="eyebrow">New Booking</div>
          <h1 className="section-title">Book a Service</h1>
        </div>
      </div>

      <div className="container animate-fade-up" style={{ padding: "32px 24px 64px" }}>

        {!selectedService && (
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, background: "#FFF8F0", border: "1px solid rgba(255,90,31,0.25)", borderRadius: "var(--radius-md)", padding: "14px 18px", fontSize: "0.88rem", color: "var(--brand-deep)", marginBottom: 24 }}>
            <span>⚠️ No service selected.</span>
            <button className="btn btn-primary" style={{ marginLeft: "auto", fontSize: "0.82rem", padding: "8px 16px" }} onClick={() => navigate("/services")}>Browse Services</button>
          </div>
        )}

        {/* Two-column layout via CSS class */}
        <div className="two-col">

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>

            <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid var(--border)", background: "linear-gradient(180deg,var(--bg-muted) 0%,white 100%)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem" }}>Your Booking</h2>
              <p style={{ fontSize: "0.83rem", color: "var(--text-muted)", marginTop: 2 }}>Fill in the details to confirm</p>
            </div>

            {/* Customer card */}
            <div className="book-form-section" style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Booked By</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--bg-muted)", borderRadius: "var(--radius-md)", padding: "13px 15px", border: "1px solid var(--border)", flexWrap: "wrap" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,var(--brand-primary),var(--brand-deep))", color: "white", fontWeight: 800, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "var(--shadow-brand)" }}>
                  {currentUser?.Customer_name?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <p style={{ fontWeight: 700, fontSize: "0.93rem" }}>{currentUser?.Customer_name}</p>
                  <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 1 }}>📍 {currentUser?.Address}</p>
                  <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 1 }}>📞 {currentUser?.Contact}</p>
                </div>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", background: "#E8F5E9", color: "#2E7D32", borderRadius: "var(--radius-full)" }}>✓ Verified</span>
              </div>
            </div>

            {/* Service */}
            {selectedService && (
              <div className="book-form-section" style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Service</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg,#FFF5F0,#FFF0E8)", borderRadius: "var(--radius-md)", padding: "13px 15px", border: "1px solid rgba(255,90,31,0.12)", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "1.8rem", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", background: "white", borderRadius: "var(--radius-sm)", flexShrink: 0, boxShadow: "var(--shadow-xs)" }}>{selectedService.icon}</span>
                  <div style={{ flex: 1, minWidth: 100 }}>
                    <p style={{ fontWeight: 700, fontSize: "0.93rem" }}>{selectedService.Service_type}</p>
                    <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 2 }}>{selectedService.description}</p>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--brand-primary)", fontFamily: "var(--font-display)" }}>₹{selectedService.Service_charge}</span>
                </div>
              </div>
            )}

            {/* Professional */}
            {professional && (
              <div className="book-form-section" style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Assigned Professional</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--bg-muted)", borderRadius: "var(--radius-md)", padding: "12px 15px", border: "1px solid var(--border)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#667EEA,#764BA2)", color: "white", fontWeight: 800, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {professional.Professional_name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{professional.Professional_name}</p>
                    <p style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{professional.Skill} · ⭐ {professional.Rating}</p>
                  </div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", background: "rgba(102,126,234,0.12)", color: "#667EEA", borderRadius: "var(--radius-full)" }}>Expert</span>
                </div>
              </div>
            )}

            {/* Date */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
              <div className="form-group">
                <label className="form-label">Preferred Date *</label>
                <input type="date" className="form-input" min={today} value={bookingDate} onChange={e => { setBookingDate(e.target.value); setDateError(""); }} />
                {dateError && <span style={{ fontSize: "0.8rem", color: "#E53E3E", fontWeight: 500 }}>{dateError}</span>}
              </div>
            </div>

            <div style={{ padding: "20px 24px" }}>
              <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "15px", fontSize: "1rem" }} disabled={loading || !selectedService}>
                {loading ? "Confirming…" : "Confirm Booking →"}
              </button>
            </div>
          </form>

          {/* ── Summary sidebar ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ padding: "18px 20px 16px", background: "linear-gradient(180deg,var(--bg-muted) 0%,white 100%)", borderBottom: "1px solid var(--border)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem" }}>Order Summary</h3>
              </div>
              {selectedService ? (
                <>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "16px 20px", background: "linear-gradient(135deg,#FFF5F0,#FFF0E8)", borderBottom: "1px solid rgba(255,90,31,0.1)" }}>
                    <span style={{ fontSize: "2.5rem", lineHeight: 1 }}>{selectedService.icon}</span>
                    <div>
                      <p style={{ fontWeight: 800, fontFamily: "var(--font-display)", fontSize: "1rem" }}>{selectedService.Service_type}</p>
                      <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: 3 }}>{selectedService.description}</p>
                    </div>
                  </div>
                  <div style={{ padding: "4px 20px 20px" }}>
                    {[
                      { label: "Professional", value: professional?.Professional_name || "—" },
                      { label: "Customer",     value: currentUser?.Customer_name || "—" },
                      { label: "Date",         value: bookingDate ? new Date(bookingDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "Not selected" },
                      { label: "Status",       value: "Pending" },
                    ].map(r => (
                      <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                        <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{r.label}</span>
                        <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{r.value}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, marginTop: 4, borderTop: "2px solid var(--border)" }}>
                      <span style={{ fontWeight: 700 }}>Total</span>
                      <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--brand-primary)", fontFamily: "var(--font-display)" }}>₹{selectedService.Service_charge}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                  <p style={{ fontSize: "2rem", marginBottom: 8 }}>🛒</p>
                  <p style={{ fontSize: "0.9rem" }}>No service selected</p>
                </div>
              )}
            </div>

            <div className="card" style={{ padding: "16px 18px", background: "linear-gradient(135deg,#FFF5F0,#FFF0E8)", borderColor: "rgba(255,90,31,0.15)" }}>
              <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--brand-deep)", marginBottom: 4 }}>💬 Need help?</p>
              <p style={{ fontSize: "0.78rem", color: "var(--brand-deep)", opacity: 0.8, lineHeight: 1.6 }}>Call <strong>1800-XXX-XXXX</strong> (toll-free) · Mon–Sat 9am–7pm</p>
            </div>
          </div>

        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  );
}
