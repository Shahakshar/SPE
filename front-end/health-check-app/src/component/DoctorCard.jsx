import React from 'react';

const DoctorCard = ({ doctor, onBook }) => {
  const isAvailable = doctor.available;

  return (
    <div
      className={`relative bg-white shadow-xl rounded-3xl overflow-hidden transition-all transform ${
        isAvailable ? 'hover:scale-105' : 'opacity-50 blur-sm pointer-events-none'
      }`}
    >
      {/* Doctor Image */}
      <div className="relative">
        <img
          src={doctor.imageUrl}
          alt={doctor.name}
          className="w-full h-48 object-cover rounded-t-3xl"
        />
        <span
          className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full ${
            isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {isAvailable ? 'Available' : 'Not Available'}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h2 className="text-xl font-bold text-gray-800">{doctor.name}</h2>
        <p className="text-indigo-600 font-medium">{doctor.expertise}</p>
        <p className="text-gray-600 text-sm">{doctor.description}</p>

        <div className="flex justify-between text-sm mt-2 border-t pt-2 text-gray-700">
          <span>⭐ <strong>{doctor.rating}</strong></span>
          <span className="text-blue-600 font-semibold">₹{doctor.hourlyRate}/hr</span>
        </div>

        <div className="text-sm text-gray-500 mt-2 space-y-1">
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Phone:</strong> {doctor.phone}</p>
        </div>

        {/* Book Button */}
        <button
          onClick={() => onBook(doctor)}
          disabled={!isAvailable}
          className={`w-full mt-4 py-2 px-4 rounded-xl font-semibold text-white transition ${
            isAvailable
              ? 'bg-blue-600 hover:bg-blue-700 shadow'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isAvailable ? 'Book Appointment' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
