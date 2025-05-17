import React, { useEffect, useState } from 'react';
import DoctorCard from '../component/DoctorCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        // console.log("Stored User:", storedUser);
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser.user || null);
            setToken(parsedUser.token || null);
        }
    }, []);
    const [originalDoctorsList, setOriginalDoctorsList] = useState([]);
    const [filteredDoctorsList, setFilteredDoctorsList] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [filters, setFilters] = useState({
        specialization: '',
        minRating: '',
        rate: '',
        available: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !token) return;

        if (user.role === "PATIENT") {
            const fetchSpecializations = async () => {
                try {
                    const response = await fetch(`http://gateway.local/api/v1/patients/specialization-list`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    const data = await response.json();
                    setSpecializations(data.data || []);
                } catch (err) {
                    console.error('Failed to fetch specializations:', err);
                }
            };

            fetchSpecializations();
        }

        const fetchAppointments = async () => {
            try {
                const endpoint =
                    user.role === 'DOCTOR'
                        ? `http://gateway.local/api/v1/doctors/welcome`
                        : `http://gateway.local/api/v1/patients/doctor-list`;

                const response = await fetch(endpoint, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
                });

                if (!response.ok) throw new Error(`Error ${response.status}`);

                const data = await response.json();
                setOriginalDoctorsList(data.data || []);
                setFilteredDoctorsList(data.data || []);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchAppointments();
    }, [user, token]);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        if (value.trim() === '') {
            setFilteredDoctorsList(originalDoctorsList);
        } else {
            const filtered = originalDoctorsList.filter((doctor) =>
                doctor.name.toLowerCase().includes(value) ||
                doctor.expertise?.toLowerCase().includes(value) ||
                doctor.email?.toLowerCase().includes(value)
            );
            setFilteredDoctorsList(filtered);
        }
    };

    const handleBooking = (doctor) => {
        navigate(`/book-appointment/${doctor.id}`, {
            state: { doctor },
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = async () => {
        const queryParams = new URLSearchParams();

        if (filters.specialization) queryParams.append('specialization', filters.specialization);
        if (filters.minRating) queryParams.append('minRating', filters.minRating);
        if (filters.rate) queryParams.append('rate', filters.rate);
        if (filters.available !== '') queryParams.append('available', filters.available);

        try {
            const response = await fetch(`http://gateway.local/api/v1/patients/doctors/filter?${queryParams.toString()}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            const data = await response.json();
            setFilteredDoctorsList(data.data || []);
        } catch (err) {
            setError('Failed to apply filters');
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Please log in to view your dashboard.</h1>
            </div>
        );
    } else {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Available Doctors</h1>

                {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by name, expertise, or email..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full border px-4 py-2 rounded-md shadow focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                {/* Filters */}
                {user && user?.role === "PATIENT" && <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <select
                            name="specialization"
                            value={filters.specialization}
                            onChange={handleFilterChange}
                            className="w-full border px-4 py-2 rounded-md"
                        >
                            <option value="">All Specializations</option>
                            {specializations.map((spec, index) => (
                                <option key={index} value={spec}>
                                    {spec}
                                </option>
                            ))}
                        </select>

                        <input
                            name="minRating"
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            placeholder="Min Rating"
                            value={filters.minRating}
                            onChange={handleFilterChange}
                            className="w-full border px-4 py-2 rounded-md"
                        />

                        <input
                            name="rate"
                            type="number"
                            step="0.01"
                            placeholder="Max Consultation Rate"
                            value={filters.rate}
                            onChange={handleFilterChange}
                            className="w-full border px-4 py-2 rounded-md"
                        />

                        <select
                            name="available"
                            value={filters.available}
                            onChange={handleFilterChange}
                            className="w-full border px-4 py-2 rounded-md"
                        >
                            <option value="">Availability</option>
                            <option value="true">Available Now</option>
                            <option value="false">Not Available</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <button
                            onClick={applyFilters}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>}


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredDoctorsList.length > 0 ? (
                        filteredDoctorsList.map(doctor => (
                            <DoctorCard key={doctor.id} doctor={doctor} onBook={handleBooking} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">No available doctors found.</p>
                    )}
                </div>
            </div>
        );
    }
};

export default Dashboard;
