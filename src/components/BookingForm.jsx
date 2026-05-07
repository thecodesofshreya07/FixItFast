import { useState, useEffect } from "react";
import { addBooking, SERVICES } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function BookingForm({ selectedService }) {
  const { customer } = useAuth(); // ← get logged-in customer

  const [form, setForm] = useState({
    Booking_Id: Math.floor(Math.random() * 90000) + 10000,
    Customer_Id: "",
    Professional_Id: "",
    Service_Id: "",
    Booking_date: "",
    Booking_Status: "Pending",
  });

  // Auto-fill Customer_Id and service details when component loads
  useEffect(() => {
    if (customer) {
      setForm(prev => ({ ...prev, Customer_Id: customer.Customer_Id }));
    }
  }, [customer]);

  useEffect(() => {
    if (selectedService) {
      setForm(prev => ({
        ...prev,
        Professional_Id: selectedService.Professional_Id,
        Service_Id: selectedService.Service_Id,
      }));
    }
  }, [selectedService]);

  const handleSubmit = e => {
    e.preventDefault();
    addBooking(form).then(() => show({
      type: "success",
      message: "Booking Successfull"
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.Booking_Id} disabled />

      {/* Show customer name instead of asking for ID */}
      <input value={customer?.Customer_name || ""} disabled placeholder="Customer" />

      <input value={selectedService?.Service_type || ""} disabled placeholder="Service" />
      <input value={selectedService?.Professional_Id || ""} disabled placeholder="Professional" />

      <input
        type="date"
        name="Booking_date"
        onChange={e => setForm({ ...form, Booking_date: e.target.value })}
      />

      <button type="submit">Confirm Booking</button>
    </form>
  );
}