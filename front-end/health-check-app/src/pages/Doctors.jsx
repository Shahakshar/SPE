// pages/Doctors.js
import { doctors } from "../data/doctors";
import { Link } from "react-router-dom";

export default function Doctors() {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">
          👩‍⚕️ Meet Our Doctors
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition duration-300"
            >
              <img
                src={doc.image}
                alt={doc.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800">{doc.name}</h2>
              <p className="text-indigo-600 text-sm font-medium">
                {doc.specialization}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                🧑‍⚕️ {doc.experience} years experience
              </p>
              <p className="text-gray-700 mt-2 text-sm">
                💰 <span className="font-medium">${doc.fee}</span> consultation
              </p>
              <Link
                to={`/book/${doc.id}`}
                className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition duration-300 text-sm"
              >
                Book Appointment
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
