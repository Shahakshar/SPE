import { Link } from "react-router-dom";

export default function DoctorCard({ doctor }) {
  return (
    <Link to={`/book/${doctor.id}`} className="block bg-white rounded-2xl shadow p-4 hover:shadow-md transition">
      <img src={doctor.avatar} alt={doctor.name} className="w-16 h-16 rounded-full mx-auto" />
      <h3 className="text-lg font-semibold mt-2 text-center">{doctor.name}</h3>
      <p className="text-sm text-gray-500 text-center">{doctor.specialization}</p>
    </Link>
  );
}
