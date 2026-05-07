// ─── src/services/api.js ─────────────────────────────────────────────────────
// All HTTP calls to the Express backend go through this le.
// Base URL reads from the Vite env variable VITE_API_URL.
// If not set, it falls back to http://localhost:5000

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// ── Global error normaliser ───────────────────────────────────────────────────
// Converts axios error responses into plain JS Error objects so every
// calling page can just catch(err) and use err.message.
API.interceptors.response.use(
  res => res,
  err => {
    const message =
      err.response?.data?.error ||
      err.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// OTP AUTH
// ═══════════════════════════════════════════════════════════════════════════════

export const sendOtp = (payload) =>
  API.post("/send-otp", payload);

export const verifyOtp = (payload) =>
  API.post("/verify-otp", payload);


// ═══════════════════════════════════════════════════════════════════════════════
// BOOKING CANCEL
// ═══════════════════════════════════════════════════════════════════════════════

export const cancelBooking = (bookingId, reason) =>
  API.patch(`/cancelBooking/${bookingId}`, { reason });


// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENT REFUND / CANCEL
// ═══════════════════════════════════════════════════════════════════════════════

export const refundPayment = (paymentId) =>
  API.post(`/refundPayment/${paymentId}`);


// ═══════════════════════════════════════════════════════════════════════════════
// ONLINE / UPI PAYMENT (RAZORPAY)
// ═══════════════════════════════════════════════════════════════════════════════

export const createOrder = (amount) =>
  API.post("/create-order", { amount });

export const verifyPayment = (data) =>
  API.post("/verify-payment", data);
/** POST /register — creates a new Customer row in the DB */
export const register = (payload) =>
  API.post("/register", payload);

/** POST /login — validates Contact + Password, returns customer data */
export const loginCustomer = (payload) =>
  API.post("/login", payload);

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES & PROFESSIONALS
// ═══════════════════════════════════════════════════════════════════════════════
// // ── Static fallback data (used by frontend UI) ──
// export const professionals = [
//   { Professional_Id: 101, Professional_name: "Amit",   Skill: "Plumbing",               Contact: "9001122334", Rating: 4.8 },
//   { Professional_Id: 102, Professional_name: "Rahul",  Skill: "Electrical",             Contact: "9002233445", Rating: 4.7 },
//   { Professional_Id: 103, Professional_name: "Suresh", Skill: "Cleaning",               Contact: "9003344556", Rating: 4.9 },
//   { Professional_Id: 104, Professional_name: "Mahesh", Skill: "AC Repair",              Contact: "9004455667", Rating: 4.6 },
//   { Professional_Id: 105, Professional_name: "Rakesh", Skill: "Carpentry",              Contact: "9005566778", Rating: 4.8 },
//   { Professional_Id: 106, Professional_name: "Vijay",  Skill: "Painting",               Contact: "9006677889", Rating: 4.7 },
//   { Professional_Id: 107, Professional_name: "Anil",   Skill: "Pest Control",           Contact: "9007788990", Rating: 4.5 },
//   { Professional_Id: 108, Professional_name: "Kiran",  Skill: "Appliance Repair",       Contact: "9008899001", Rating: 4.8 },
//   { Professional_Id: 109, Professional_name: "Sunil",  Skill: "Water Purifier Service", Contact: "9009900112", Rating: 4.6 },
//   { Professional_Id: 110, Professional_name: "Deepak", Skill: "Home Sanitization",      Contact: "9010011223", Rating: 4.9 },
// ];

// export const services = [
//   { Service_Id: 201, Service_type: "Plumbing",               Service_charge: 500,  icon: "🔧", Professional_Id: 101, description: "Fix leaks, clogs, pipe repairs & installations" },
//   { Service_Id: 202, Service_type: "Electrical",             Service_charge: 600,  icon: "⚡", Professional_Id: 102, description: "Wiring, switchboards, fan & fixture fitting" },
//   { Service_Id: 203, Service_type: "Cleaning",               Service_charge: 800,  icon: "🧹", Professional_Id: 103, description: "Deep home cleaning, bathroom & kitchen scrub" },
//   { Service_Id: 204, Service_type: "AC Repair",              Service_charge: 1200, icon: "❄️", Professional_Id: 104, description: "AC servicing, gas refill & cooling issues" },
//   { Service_Id: 205, Service_type: "Carpentry",              Service_charge: 700,  icon: "🪚", Professional_Id: 105, description: "Furniture repair, door hinges & custom work" },
//   { Service_Id: 206, Service_type: "Painting",               Service_charge: 1500, icon: "🎨", Professional_Id: 106, description: "Interior/exterior painting & touch-ups" },
//   { Service_Id: 207, Service_type: "Pest Control",           Service_charge: 1000, icon: "🐛", Professional_Id: 107, description: "Cockroach, termite & rodent treatment" },
//   { Service_Id: 208, Service_type: "Appliance Repair",       Service_charge: 900,  icon: "🔌", Professional_Id: 108, description: "Washing machine, refrigerator & microwave fix" },
//   { Service_Id: 209, Service_type: "Water Purifier Service", Service_charge: 650,  icon: "💧", Professional_Id: 109, description: "RO/UV purifier cleaning & filter change" },
//   { Service_Id: 210, Service_type: "Home Sanitization",      Service_charge: 1100, icon: "🧴", Professional_Id: 110, description: "Full home disinfection & sanitization spray" },
// ];

/** GET /getServices — fetches all services from DB (enriched with icon/desc) */
export const getServices = () =>
  API.get("/getServices");

/** GET /getProfessionals — fetches all professionals from DB */
export const getProfessionals = () => {
  return API.get("/getProfessionals");
};
// ═══════════════════════════════════════════════════════════════════════════════
// BOOKINGS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /getBookings?customerId=X
 * Returns all bookings for the logged-in customer.
 */
export const getBookings = (customerId) =>
  API.get("/getBookings", { params: { customerId } });

/**
 * POST /addBooking
 * Body: { Booking_Id, Customer_Id, Professional_Id, Service_Id, Booking_date, Booking_Status }
 * Inserts into Booking + Booking_Service in a single DB transaction.
 */
export const addBooking = (booking) =>
  API.post("/addBooking", booking);

/**
 * PATCH /updateBookingStatus/:id
 * Marks a booking as Completed.
 * Called automatically by addPayment — frontend doesn't need to call this directly.
 */
export const markBookingCompleted = (bookingId) =>
  API.patch(`/updateBookingStatus/${bookingId}`, { status: "Completed" });

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /addPayment
 * Body: { Payment_Id, Booking_Id, Amount, Payment_mode, Payment_date }
 * The backend inserts the payment AND updates Booking_Status to Completed
 * in one atomic transaction — no separate markBookingCompleted call needed.
 */
export const addPayment = (payment) =>
  API.post("/addPayment", payment);

/**
 * GET /getPayments?bookingIds=301,302,303
 * Returns payments for the provided booking IDs (the customer's own bookings).
 * @param {number[]} bookingIds - array of Booking_Id values
 */
export const getPayments = (bookingIds = []) => {
  if (bookingIds.length === 0) return Promise.resolve({ data: { data: [] } });
  return API.get("/getPayments", { params: { bookingIds: bookingIds.join(",") } });
};
