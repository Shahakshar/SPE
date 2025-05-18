import React from 'react';

const DoctorCard = ({ doctor, onBook }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-4">
        <img
          src={doctor.imageUrl || '/default-doctor-avatar.png'}
          alt={doctor.name}
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold">{doctor.name}</h3>
          <p className="text-sm text-blue-600">{doctor.expertise}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">{doctor.description}</p>
        <div className="flex items-center mt-2">
          <span className="text-yellow-400">★</span>
          <span className="ml-1 text-sm text-gray-600">{doctor.rating.toFixed(1)}</span>
          <span className="mx-2">•</span>
          <span className="text-sm text-gray-600">${doctor.hourlyRate}/hour</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded-full text-xs ${
          doctor.available 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {doctor.available ? 'Available' : 'Unavailable'}
        </span>
        
        <button
          onClick={() => onBook(doctor)}
          disabled={!doctor.available}
          className={`px-4 py-2 rounded-md ${
            doctor.available
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
