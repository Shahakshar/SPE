import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiService from "../services/apiService";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [token, setToken] = useState(null);

  useEffect(() => {
    // const storedUser = localStorage.getItem("user");
    // if (storedUser) {
    //     const parsedUser = JSON.parse(storedUser);
    //     setToken(parsedUser.token);
    // }
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAllDoctors();
        setDoctors(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors. Please try again later.");
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-indigo-600 text-xl">Loading doctors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">
          👩‍⚕️ Meet Our Doctors
        </h1>

        {doctors.length === 0 ? (
          <div className="text-center text-gray-500">No doctors available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition duration-300"
              >
                <img
                  src={doc.image || "/default-doctor.png"}
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
        )}
      </div>
    </div>
  );
}