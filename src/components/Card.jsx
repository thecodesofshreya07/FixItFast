// ── Card ─────────────────────────────────────────────
export function Card({ children, style, className = "", onClick }) {
  return (
    <div
      className={`card ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────
import { useEffect, useState } from "react";

export function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3400);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      {message}
    </div>
  );
}

// ── useToast hook ─────────────────────────────────────
export function useToast() {
  const [toast, setToast] = useState(null);
  const show = (arg, type = "success") => {
    // Case 1: object style
    if (arg && typeof arg === "object") {
      setToast({
        message: arg.message || "Something happened",
        type: arg.type || "success",
      });
      return;
    }
    // Case 2: string style
    setToast({
      message: arg,
      type,
    });
  };
  const hide = () => setToast(null);
  return { toast, show, hide };
}

// ── Spinner ───────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "60px", gap: 12, color: "var(--text-muted)"
    }}>
      <div style={{
        width: 24, height: 24,
        border: "3px solid var(--border)",
        borderTopColor: "var(--brand-primary)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontWeight: 500 }}>Loading...</span>
    </div>
  );
}

// ── StarRating ────────────────────────────────────────
export function StarRating({ rating }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      <span style={{ color: "#F59E0B", fontSize: "0.85rem" }}>★</span>
      <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-secondary)" }}>{rating}</span>
    </span>
  );
}

export default Card;
