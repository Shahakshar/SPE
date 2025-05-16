import React, { useEffect, useState } from 'react';
// import AppointmentCard from '../component/AppointmentCard'; // adjust path as needed
import { useSelector } from 'react-redux';
import DoctorCard from '../component/DoctorCard'; // adjust path as needed

const Dashboard = () => {

    const user = useSelector((state) => state.auth.user);
    const [doctorsList, setDoctorsList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <h1 className="text-2xl font-bold">Please log in to view your dashboard.</h1>
                </div>
            );
        }

        const fetchAppointments = async () => {
            try {
                const endpoint =
                    user.user.role === 'DOCTOR'
                        ? `http://gateway.local/api/v1/doctors/welcome`
                        : `http://gateway.local/api/v1/patients/doctors/available`;

                const response = await fetch(endpoint, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    }
                });

                if (!response.ok) throw new Error(`Error ${response.status}`);

                const data = await response.json();
                setDoctorsList(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Available Doctors</h1>
    
            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
    
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {doctorsList.length > 0 ? (
                    doctorsList.map(doctor => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">No available doctors found.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
