import { doctors } from "../data/doctors";

export default function AppointmentList({ data, title }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ul className="space-y-2">
        {data.map((apt) => {
          const doctor = doctors.find((d) => d.id === apt.doctorId);
          return (
            <li key={apt.id} className="border p-3 rounded-md">
              <p><strong>Doctor:</strong> {doctor.name}</p>
              <p><strong>Date:</strong> {apt.date}</p>
              <p><strong>Time:</strong> {apt.time}</p>
              <p><strong>Symptoms:</strong> {apt.symptoms}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
