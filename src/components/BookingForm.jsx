import { useState, useEffect } from "react";
import { addBooking } from "../services/api";

export default function BookingForm({ selectedService }) {
  const [form, setForm] = useState({
    Booking_Id: Math.floor(Math.random() * 1000),
    Customer_Id: "",
    Professional_Id: "",
    Booking_date: ""
  });

  useEffect(() => {
    if (selectedService) {
      setForm(prev => ({
        ...prev,
        Professional_Id: selectedService.professional
      }));
    }
  }, [selectedService]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    addBooking(form).then(() => alert("Booking Successful"));
  };

  return (
    <form onSubmit={handleSubmit}>

      <input value={form.Booking_Id} disabled />

      <input
        name="Customer_Id"
        placeholder="Enter Customer ID (1-10)"
        onChange={handleChange}
      />

      <input
        value={selectedService?.name || ""}
        disabled
        placeholder="Service"
      />

      <input
        value={form.Professional_Id}
        disabled
        placeholder="Assigned Professional"
      />

      <input
        type="date"
        name="Booking_date"
        onChange={handleChange}
      />

      <button>Confirm Booking</button>
    </form>
  );
}