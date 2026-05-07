import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addPayment,
  getBookings,
  getPayments,
  getServices,
  getProfessionals,
  cancelBooking,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Toast, useToast } from "../components/Card";

const PAYMENT_MODES = [
  { id: "UPI", label: "UPI", icon: "📱", desc: "GPay · PhonePe · Paytm" },
  { id: "Card", label: "Card", icon: "💳", desc: "Credit / Debit card" },
  { id: "Cash", label: "Cash on Site", icon: "💵", desc: "Pay on arrival" },
];

export default function Payment() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast, show, hide } = useToast();
  const prefill = location.state || {};

  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState(prefill.bookingId || "");
  const [paymentMode, setPaymentMode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [cancelling, setCancelling] = useState(null); // bookingId being cancelled
  const [errors, setErrors] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  // ── Helpers (depend on state, defined before useEffect) ──────────────────────
  const getService = (id) => services.find(s => s.Service_Id === id);
  const getProfessional = (id) => professionals.find(p => p.Professional_Id === id);
  const formatDate = (d) => { try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return d; } };

  // ── Load everything ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser?.Customer_Id) return;

    const load = async () => {
      try {
        setLoadingData(true);

        // Fetch services, professionals and bookings in parallel
        const [svcRes, proRes, bookRes] = await Promise.all([
          getServices(),
          getProfessionals(),
          getBookings(currentUser.Customer_Id),
        ]);

        const allServices = svcRes.data.data || svcRes.data || [];
        const allProfessionals = proRes.data.data || proRes.data || [];
        const allBookings = bookRes.data.data || bookRes.data || [];

        setServices(allServices);
        setProfessionals(allProfessionals);

        // Fetch payments for these bookings
        const bookingIds = allBookings.map(b => b.Booking_Id);
        const payRes = await getPayments(bookingIds);
        const allPayments = payRes.data.data || payRes.data || [];

        // Pending = status is Pending AND no successful payment exists
        const paidIds = new Set(
          allPayments
            .filter(p => p.Payment_status !== "Cancelled")
            .map(p => String(p.Booking_Id))
        );

        const pending = allBookings.filter(
          b => b.Booking_Status === "Pending" && !paidIds.has(String(b.Booking_Id))
        );

        // Payment history: only payments for this customer's bookings
        const myIds = new Set(allBookings.map(b => String(b.Booking_Id)));
        const myPayments = allPayments.filter(p => myIds.has(String(p.Booking_Id)));

        setPendingBookings(pending);
        setPaymentHistory(myPayments);
        setAllBookings(allBookings); // store all bookings including completed ones
      } catch (err) {
        show({ type: "error", message: err.message || "Failed to load data" });
      } finally {
        setLoadingData(false);
      }
    };

    load();
  }, [currentUser]);

  const selectedBooking = pendingBookings.find(b => String(b.Booking_Id) === String(selectedBookingId));
  const selectedService = selectedBooking ? getService(selectedBooking.Service_Id) : null;

  // Cart total: sum of all pending bookings
  const cartTotal = pendingBookings.reduce((sum, b) => {
    const svc = getService(b.Service_Id);
    return sum + (svc?.Service_charge || 0);
  }, 0);

  // ── Pay ───────────────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!selectedBookingId) e.booking = "Please select a booking";
    if (!paymentMode) e.paymentMode = "Please select a payment method";
    return e;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setProcessing(true);
    try {
      const payment = {
        Payment_Id: Math.floor(Math.random() * 90000) + 10000,
        Booking_Id: selectedBooking.Booking_Id,
        Amount: selectedService?.Service_charge || 0,
        Payment_mode: paymentMode,
        Payment_date: new Date().toISOString().split("T")[0],
      };
      await addPayment(payment);
      setPendingBookings(prev => prev.filter(b => b.Booking_Id !== selectedBooking.Booking_Id));
      setPaymentHistory(prev => [payment, ...prev]);
      show({ type: "success", message: `Payment of ₹${payment.Amount} successful! ✅` });
      setSelectedBookingId("");
      setPaymentMode("");
    } catch (err) {
      show({ type: "error", message: err.message || "Payment failed. Please try again." });
    } finally {
      setProcessing(false);
    }
  };

  // ── Cancel Booking ────────────────────────────────────────────────────────────
  const handleCancelBooking = async (bookingId) => {
    setConfirm({
      message: "Cancel this booking?",
      onConfirm: async () => {
        setCancelling(bookingId);
        try {
          await cancelBooking(bookingId, "Cancelled by customer");
          setPendingBookings(prev => prev.filter(b => b.Booking_Id !== bookingId));
          if (String(selectedBookingId) === String(bookingId)) {
            setSelectedBookingId(""); setPaymentMode("");
          }
          show({ type: "success", message: "Booking cancelled successfully." });
        } catch (err) {
          show({ type: "error", message: err.message || "Failed to cancel booking." });
        } finally {
          setCancelling(null);
        }
      }
    });
  };

  const ConfirmDialog = () => !confirm ? null : (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(2px)",
    }}>
      <div style={{
        background: "white", borderRadius: "var(--radius-lg)", padding: "28px 24px",
        maxWidth: 360, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "1.5rem", marginBottom: 10 }}>⚠️</p>
        <p style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 8 }}>{confirm.message}</p>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 20 }}>This action cannot be undone.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={() => setConfirm(null)}
            style={{
              padding: "9px 20px", borderRadius: "var(--radius-md)",
              border: "1.5px solid var(--border)", background: "white",
              fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => { confirm.onConfirm(); setConfirm(null); }}
            style={{
              padding: "9px 20px", borderRadius: "var(--radius-md)",
              border: "none", background: "#DC2626", color: "white",
              fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="eyebrow">💳 Payments</div>
          <h1 className="section-title">Make a Payment</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 8, fontSize: "0.9rem" }}>
            {loadingData
              ? "Loading…"
              : pendingBookings.length > 0
                ? `${pendingBookings.length} booking${pendingBookings.length > 1 ? "s" : ""} awaiting payment`
                : "No pending payments"}
          </p>
        </div>
      </div>

      <div className="container animate-fade-up" style={{ padding: "32px 24px 64px" }}>

        {/* ── Cart Total Banner ── */}
        {!loadingData && pendingBookings.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 12,
            background: "linear-gradient(135deg, var(--brand-primary), #ff7043)",
            borderRadius: "var(--radius-lg)", padding: "16px 24px", marginBottom: 28,
            boxShadow: "0 4px 20px var(--brand-glow)",
          }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Pending Amount
              </p>
              <p style={{ color: "white", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1.1, marginTop: 2 }}>
                ₹{cartTotal.toLocaleString("en-IN")}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>
                {pendingBookings.length} service{pendingBookings.length > 1 ? "s" : ""} in queue
              </p>
              <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {pendingBookings.map(b => {
                  const svc = getService(b.Service_Id);
                  return (
                    <span key={b.Booking_Id} style={{
                      background: "rgba(255,255,255,0.2)", color: "white",
                      fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px",
                      borderRadius: "var(--radius-full)", backdropFilter: "blur(4px)",
                    }}>
                      {svc?.icon} {svc?.Service_type}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="two-col-sm">

          {/* ── Left column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Pending bookings */}
            <div style={{ background: "white", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
              <div style={{ padding: "18px 20px 14px", background: "linear-gradient(180deg,var(--bg-muted) 0%,white 100%)", borderBottom: "1px solid var(--border)" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem" }}>Select Booking</h2>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>Choose which booking to pay for</p>
              </div>

              {loadingData ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "24px 20px", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                  <div className="spinner" /> Loading…
                </div>
              ) : pendingBookings.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "32px 20px", textAlign: "center" }}>
                  <span style={{ fontSize: "2rem" }}>🎉</span>
                  <p style={{ fontWeight: 700, color: "var(--text-secondary)" }}>All caught up!</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>No pending payments.</p>
                  <button className="btn btn-primary" style={{ marginTop: 6 }} onClick={() => navigate("/services")}>Book a Service</button>
                </div>
              ) : (
                <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {pendingBookings.map(booking => {
                    const svc = getService(booking.Service_Id);
                    const pro = getProfessional(booking.Professional_Id);
                    const isActive = String(selectedBookingId) === String(booking.Booking_Id);
                    const isCancellingThis = cancelling === booking.Booking_Id;
                    return (
                      <div key={booking.Booking_Id} style={{ position: "relative" }}>
                        <button
                          type="button"
                          onClick={() => { setSelectedBookingId(booking.Booking_Id); setErrors({}); }}
                          style={{
                            display: "flex", alignItems: "center", gap: 12,
                            padding: "13px 14px", borderRadius: "var(--radius-md)",
                            border: `${isActive ? "2px" : "1.5px"} solid ${isActive ? "var(--brand-primary)" : "var(--border)"}`,
                            background: isActive ? "linear-gradient(135deg,#FFF5F0,#FFF0E8)" : "var(--bg-muted)",
                            boxShadow: isActive ? "0 0 0 3px var(--brand-glow)" : "none",
                            cursor: "pointer", transition: "all 0.2s", fontFamily: "var(--font-body)",
                            width: "100%", textAlign: "left",
                          }}
                        >
                          <span style={{ fontSize: "1.6rem", lineHeight: 1, flexShrink: 0 }}>{svc?.icon || "🔧"}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{svc?.Service_type || "Service"}</p>
                            <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {pro?.Professional_name} · {formatDate(booking.Booking_date)}
                            </p>
                          </div>


                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <p style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--brand-primary)", fontFamily: "var(--font-display)" }}>
                              ₹{svc?.Service_charge}
                            </p>
                            <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "2px 7px", background: "#FFF3E0", color: "#E65100", borderRadius: "var(--radius-full)", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                              Pending
                            </span>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleCancelBooking(booking.Booking_Id); }}
                              disabled={isCancellingThis}
                              style={{
                                background: "white", border: "1px solid #FCA5A5",
                                color: "#DC2626", borderRadius: "var(--radius-sm)",
                                fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px",
                                cursor: "pointer", width: "100%",
                                opacity: isCancellingThis ? 0.6 : 1,
                              }}
                            >
                              {isCancellingThis ? "…" : "✕ Cancel"}
                            </button>
                          </div>
                        </button>
                      </div>


                    );
                  })}
                  {errors.booking && <p style={{ fontSize: "0.8rem", color: "#E53E3E", fontWeight: 500 }}>{errors.booking}</p>}
                </div>
              )}
            </div>

            {/* Payment method */}
            <div style={{ background: "white", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
              <div style={{ padding: "18px 20px 14px", background: "linear-gradient(180deg,var(--bg-muted) 0%,white 100%)", borderBottom: "1px solid var(--border)" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem" }}>Payment Method</h2>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>How would you like to pay?</p>
              </div>
              <div style={{ padding: "16px 16px 18px" }}>
                <div className="pay-mode-grid">
                  {PAYMENT_MODES.map(mode => {
                    const isActive = paymentMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => { setPaymentMode(mode.id); setErrors(p => ({ ...p, paymentMode: "" })); }}
                        style={{
                          position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                          padding: "14px 8px", borderRadius: "var(--radius-md)", cursor: "pointer",
                          border: `${isActive ? "2px" : "1.5px"} solid ${isActive ? "var(--brand-primary)" : "var(--border)"}`,
                          background: isActive ? "linear-gradient(135deg,#FFF5F0,#FFF0E8)" : "white",
                          boxShadow: isActive ? "0 0 0 3px var(--brand-glow)" : "none",
                          transition: "all 0.2s", fontFamily: "var(--font-body)", textAlign: "center",
                        }}
                      >
                        {isActive && <span style={{ position: "absolute", top: 6, right: 6, width: 16, height: 16, borderRadius: "50%", background: "var(--brand-primary)", color: "white", fontSize: "0.55rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>}
                        <span style={{ fontSize: "1.6rem" }}>{mode.icon}</span>
                        <p style={{ fontWeight: 700, fontSize: "0.82rem" }}>{mode.label}</p>
                        <p style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>{mode.desc}</p>
                      </button>
                    );
                  })}
                </div>
                {errors.paymentMode && <p style={{ fontSize: "0.8rem", color: "#E53E3E", fontWeight: 500, marginTop: 8 }}>{errors.paymentMode}</p>}
              </div>
            </div>

            {/* Pay button */}
            <button
              onClick={handlePay}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "15px", fontSize: "1rem" }}
              disabled={processing || pendingBookings.length === 0}
            >
              {processing
                ? "Processing…"
                : selectedService
                  ? `Pay ₹${selectedService.Service_charge} →`
                  : "Pay Now →"}
            </button>
          </div>

          {/* ── Right column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Order summary */}
            <div style={{ background: "white", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
              <div style={{ padding: "18px 20px 14px", background: "linear-gradient(180deg,var(--bg-muted) 0%,white 100%)", borderBottom: "1px solid var(--border)" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem" }}>Order Summary</h2>
              </div>
              {selectedBooking && selectedService ? (
                <div style={{ padding: "0 20px 20px" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "2rem" }}>{selectedService.icon}</span>
                    <div>
                      <p style={{ fontWeight: 800, fontFamily: "var(--font-display)", fontSize: "0.95rem" }}>{selectedService.Service_type}</p>
                      <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 2 }}>{selectedService.description}</p>
                    </div>
                  </div>
                  {[
                    { label: "Professional", value: getProfessional(selectedBooking.Professional_Id)?.Professional_name || "—" },
                    { label: "Booked for", value: formatDate(selectedBooking.Booking_date) },
                    { label: "Payment via", value: paymentMode || "Not selected" },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                      <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{r.label}</span>
                      <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{r.value}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, marginTop: 4, borderTop: "2px solid var(--border)" }}>
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--brand-primary)", fontFamily: "var(--font-display)" }}>₹{selectedService.Service_charge}</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "28px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                  <p style={{ fontSize: "1.4rem", marginBottom: 6 }}>👆</p>
                  <p style={{ fontSize: "0.85rem" }}>Select a booking above to see summary</p>
                </div>
              )}
            </div>

            {/* Security badge */}
            <div className="card" style={{ padding: "14px 16px", background: "linear-gradient(135deg,#F0FFF4,#DCFCE7)", borderColor: "#BBF7D0" }}>
              <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#166534", marginBottom: 3 }}>🔒 Secure & Encrypted</p>
              <p style={{ fontSize: "0.74rem", color: "#166534", opacity: 0.85, lineHeight: 1.55 }}>All transactions are protected and processed securely.</p>
            </div>
          </div>
        </div>

        {/* ── Payment History ── */}
        {!loadingData && paymentHistory.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem" }}>Payment History</h2>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 12px", background: "var(--bg-muted)", color: "var(--text-muted)", borderRadius: "var(--radius-full)", border: "1px solid var(--border)" }}>
                {paymentHistory.length} payment{paymentHistory.length > 1 ? "s" : ""}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {paymentHistory.map(p => {
                const booking = allBookings.find(b => String(b.Booking_Id) === String(p.Booking_Id));
                const svc = booking ? getService(booking.Service_Id) : null;
                const modeIcon = svc?.icon || PAYMENT_MODES.find(m => m.id === p.Payment_mode)?.icon || "💰";
                return (
                  <div key={p.Payment_Id} className="card" style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 18px", flexWrap: "wrap", gap: 10,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: "1.5rem", width: 42, height: 42, background: "var(--bg-muted)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{modeIcon}</span>
                      <div>

                        <p style={{ fontWeight: 700, fontSize: "0.88rem" }}>
                          {svc ? `${svc.icon} ${svc.Service_type}` : `Booking #${p.Booking_Id}`}
                        </p>
                        <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 2 }}>
                          via {p.Payment_mode} · {formatDate(p.Payment_date)}
                        </p>

                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontWeight: 800, fontSize: "1rem", color: "#2E7D32", fontFamily: "var(--font-display)" }}>
                          ₹{p.Amount}
                        </p>
                        <span style={{
                          fontSize: "0.62rem", fontWeight: 700, padding: "2px 8px", background: "#E8F5E9", color: "#2E7D32",
                          borderRadius: "var(--radius-full)", textTransform: "uppercase",
                        }}>
                          Paid
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <ConfirmDialog />
      {toast?.message && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  );
}
