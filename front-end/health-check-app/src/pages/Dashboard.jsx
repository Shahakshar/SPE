import React, { useEffect, useState } from 'react';
import AppointmentCard from '../component/AppointmentCard'; // adjust path as needed

const Dashboard = () => {
    const user = {
        name: 'Dr. John',
        role: 'doctor',
        id: '123',
        token: 'abcde12345'
    };

    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchAppointments = async () => {
            try {
                const endpoint =
                    user.role === 'doctor'
                        ? `/api/appointments/doctor/${user.id}/all`
                        : `/api/appointments/patient/${user.id}/all`;

                const response = await fetch(endpoint, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    }
                });

                if (!response.ok) throw new Error(`Error ${response.status}`);

                const data = await response.json();
                setAppointments(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchAppointments();
    }, []);

    const today = new Date().toISOString().slice(0, 10);

    const todayAppointments = appointments.filter(a => a.date === today);
    const upcomingAppointments = appointments.filter(a => a.date > today);
    const pastAppointments = appointments.filter(a => a.date < today);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user.name} ({user.role})</h1>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Today's Appointments</h2>
                {todayAppointments.length > 0 ? todayAppointments.map(appt =>
                    <AppointmentCard key={appt.id} appointment={appt} type="today" />
                ) : <p className="text-gray-600">No appointments for today.</p>}
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Upcoming Appointments</h2>
                {upcomingAppointments.length > 0 ? upcomingAppointments.map(appt =>
                    <AppointmentCard key={appt.id} appointment={appt} type="upcoming" />
                ) : <p className="text-gray-600">No upcoming appointments.</p>}
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">Past Appointments</h2>
                {pastAppointments.length > 0 ? pastAppointments.map(appt =>
                    <AppointmentCard key={appt.id} appointment={appt} type="past" />
                ) : <p className="text-gray-600">No past appointments.</p>}
            </section>
        </div>
    );
};

export default Dashboard;
