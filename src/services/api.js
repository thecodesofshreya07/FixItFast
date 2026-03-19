// ─── API SERVICE LAYER ───────────────────────────────────────────────────────
// Dummy implementation with localStorage persistence so data survives page reloads.
// When the real backend is ready, replace each function body with an axios call.
//
// import axios from "axios";
// const API = axios.create({ baseURL: "http://localhost:5000" });

// ── STORAGE HELPERS ───────────────────────────────────────────────────────────
// All data lives in localStorage under these keys so nothing is lost on reload.
const KEYS = {
  customers: "fif_customers",
  nextId:    "fif_next_customer_id",
  bookings:  "fif_bookings",
  payments:  "fif_payments",
};

const load  = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const save  = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

// ── LIVE DATA (initialised from localStorage) ─────────────────────────────────
// These are module-level references so all API functions share the same state.
// On every mutating operation we write back to localStorage immediately.

const getCustomers    = ()  => load(KEYS.customers, []);
const saveCustomers   = (v) => save(KEYS.customers, v);

const getNextId       = ()  => load(KEYS.nextId, 1);
const saveNextId      = (v) => save(KEYS.nextId, v);

const _getBookings    = ()  => load(KEYS.bookings, []);
const _saveBookings   = (v) => save(KEYS.bookings, v);

const _getPayments    = ()  => load(KEYS.payments, []);
const _savePayments   = (v) => save(KEYS.payments, v);

// ── STATIC DATA ───────────────────────────────────────────────────────────────

export const PROFESSIONALS = [
  { Professional_Id: 101, Professional_name: "Amit",   Skill: "Plumbing",               Contact: "9001122334", Rating: 4.8 },
  { Professional_Id: 102, Professional_name: "Rahul",  Skill: "Electrical",             Contact: "9002233445", Rating: 4.7 },
  { Professional_Id: 103, Professional_name: "Suresh", Skill: "Cleaning",               Contact: "9003344556", Rating: 4.9 },
  { Professional_Id: 104, Professional_name: "Mahesh", Skill: "AC Repair",              Contact: "9004455667", Rating: 4.6 },
  { Professional_Id: 105, Professional_name: "Rakesh", Skill: "Carpentry",              Contact: "9005566778", Rating: 4.8 },
  { Professional_Id: 106, Professional_name: "Vijay",  Skill: "Painting",               Contact: "9006677889", Rating: 4.7 },
  { Professional_Id: 107, Professional_name: "Anil",   Skill: "Pest Control",           Contact: "9007788990", Rating: 4.5 },
  { Professional_Id: 108, Professional_name: "Kiran",  Skill: "Appliance Repair",       Contact: "9008899001", Rating: 4.8 },
  { Professional_Id: 109, Professional_name: "Sunil",  Skill: "Water Purifier Service", Contact: "9009900112", Rating: 4.6 },
  { Professional_Id: 110, Professional_name: "Deepak", Skill: "Home Sanitization",      Contact: "9010011223", Rating: 4.9 },
];

export const SERVICES = [
  { Service_Id: 201, Service_type: "Plumbing",               Service_charge: 500,  icon: "🔧", Professional_Id: 101, description: "Fix leaks, clogs, pipe repairs & installations" },
  { Service_Id: 202, Service_type: "Electrical",             Service_charge: 600,  icon: "⚡", Professional_Id: 102, description: "Wiring, switchboards, fan & fixture fitting" },
  { Service_Id: 203, Service_type: "Cleaning",               Service_charge: 800,  icon: "🧹", Professional_Id: 103, description: "Deep home cleaning, bathroom & kitchen scrub" },
  { Service_Id: 204, Service_type: "AC Repair",              Service_charge: 1200, icon: "❄️", Professional_Id: 104, description: "AC servicing, gas refill & cooling issues" },
  { Service_Id: 205, Service_type: "Carpentry",              Service_charge: 700,  icon: "🪚", Professional_Id: 105, description: "Furniture repair, door hinges & custom work" },
  { Service_Id: 206, Service_type: "Painting",               Service_charge: 1500, icon: "🎨", Professional_Id: 106, description: "Interior/exterior painting & touch-ups" },
  { Service_Id: 207, Service_type: "Pest Control",           Service_charge: 1000, icon: "🐛", Professional_Id: 107, description: "Cockroach, termite & rodent treatment" },
  { Service_Id: 208, Service_type: "Appliance Repair",       Service_charge: 900,  icon: "🔌", Professional_Id: 108, description: "Washing machine, refrigerator & microwave fix" },
  { Service_Id: 209, Service_type: "Water Purifier Service", Service_charge: 650,  icon: "💧", Professional_Id: 109, description: "RO/UV purifier cleaning & filter change" },
  { Service_Id: 210, Service_type: "Home Sanitization",      Service_charge: 1100, icon: "🧴", Professional_Id: 110, description: "Full home disinfection & sanitization spray" },
];

// ── ASYNC DELAY SIMULATOR ─────────────────────────────────────────────────────
const delay = (ms = 250) => new Promise(res => setTimeout(res, ms));

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Register a new customer.
 * Backend equivalent → POST /register
 */
export const register = async ({ Customer_name, Address, Contact, Password }) => {
  await delay(500);
  const customers = getCustomers();
  if (customers.find(c => c.Contact === Contact))
    throw new Error("An account with this contact number already exists.");

  const id = getNextId();
  const newCustomer = { Customer_Id: id, Customer_name, Address, Contact, Password };
  saveCustomers([...customers, newCustomer]);
  saveNextId(id + 1);

  const { Password: _, ...safe } = newCustomer;
  return { data: safe };
};

/**
 * Login.
 * Backend equivalent → POST /login
 */
export const loginCustomer = async ({ Contact, Password }) => {
  await delay(500);
  const customer = getCustomers().find(
    c => c.Contact === Contact && c.Password === Password
  );
  if (!customer) throw new Error("Invalid contact number or password.");
  const { Password: _, ...safe } = customer;
  return { data: safe };
};

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES & PROFESSIONALS
// ═══════════════════════════════════════════════════════════════════════════════

/** Backend equivalent → GET /getServices */
export const getServices = async () => {
  await delay();
  return { data: SERVICES };
};

/** Backend equivalent → GET /getProfessionals */
export const getProfessionals = async () => {
  await delay();
  return { data: PROFESSIONALS };
};

// ═══════════════════════════════════════════════════════════════════════════════
// BOOKINGS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get bookings for a customer (or all if no customerId).
 * Backend equivalent → GET /getBookings?customerId=X
 */
export const getBookings = async (customerId) => {
  await delay();
  const all = _getBookings();
  const filtered = customerId
    ? all.filter(b => b.Customer_Id === customerId)
    : all;
  return { data: filtered };
};

/**
 * Add a new booking.
 * Backend equivalent → POST /addBooking
 */
export const addBooking = async (booking) => {
  await delay(500);
  const updated = [..._getBookings(), booking];
  _saveBookings(updated);
  return { data: booking };
};

/**
 * Update booking status to "Completed" after payment.
 * In real backend → PUT /updateBooking/:id  or  PATCH /bookings/:id/status
 * This is a FRONTEND responsibility here since there is no backend yet.
 */
export const markBookingCompleted = async (bookingId) => {
  await delay(200);
  const updated = _getBookings().map(b =>
    b.Booking_Id === bookingId
      ? { ...b, Booking_Status: "Completed" }
      : b
  );
  _saveBookings(updated);
  return { data: { Booking_Id: bookingId, Booking_Status: "Completed" } };
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Add payment AND mark the linked booking as Completed.
 * Backend equivalent → POST /addPayment  (backend should handle status update too)
 */
export const addPayment = async (payment) => {
  await delay(500);
  const updated = [..._getPayments(), payment];
  _savePayments(updated);
  // Always mark the booking completed when payment is recorded
  await markBookingCompleted(payment.Booking_Id);
  return { data: payment };
};

/**
 * Get all payments.
 * Backend equivalent → GET /getPayments
 */
export const getPayments = async () => {
  await delay();
  return { data: _getPayments() };
};