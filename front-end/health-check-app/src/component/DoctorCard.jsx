import React from 'react';

const DoctorCard = ({ doctor, onBook }) => {
    const isAvailable = doctor.available;

    return (
        <div
            className={`relative bg-white shadow-xl rounded-2xl overflow-hidden transition-all transform ${
                isAvailable ? 'hover:scale-105' : 'opacity-50 blur-sm pointer-events-none'
            }`}
        >
            <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.expertise}</p>
                <p className="text-gray-500 text-sm">{doctor.description}</p>
                <div className="mt-2 flex justify-between text-sm">
                    <span className="text-green-600">Rating: ⭐ {doctor.rating}</span>
                    <span className="text-blue-500">₹{doctor.hourlyRate}/hr</span>
                </div>
                <div className="text-sm text-gray-700 mt-2">
                    <p><strong>Email:</strong> {doctor.email}</p>
                    <p><strong>Phone:</strong> {doctor.phone}</p>
                </div>
                <div className="mt-4">
                    <button
                        onClick={() => onBook(doctor)}
                        disabled={!isAvailable}
                        className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition ${
                            isAvailable
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {isAvailable ? 'Book Now' : 'Not Available'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;
