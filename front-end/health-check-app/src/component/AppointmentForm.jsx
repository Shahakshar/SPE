import { useState } from "react";

export default function AppointmentForm({ doctor, onSubmit }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ doctorId: doctor.id, date, time, symptoms });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold">Book Appointment with {doctor.name}</h2>
      <input type="date" className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="time" className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" value={time} onChange={(e) => setTime(e.target.value)} required />
      <textarea placeholder="Describe your symptoms..." className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} required />
      <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition">Book Appointment</button>
    </form>
  );
}
