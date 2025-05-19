import React, { useEffect, useState } from 'react';
import DoctorCard from '../component/DoctorCard';
import { useNavigate } from 'react-router-dom';
import appointmentService from '../services/apiService';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalDoctorsList, setOriginalDoctorsList] = useState([]);
  const [filteredDoctorsList, setFilteredDoctorsList] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filters, setFilters] = useState({
    specialization: '',
    minRating: '',
    rate: '',
    available: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.user || null);
      setToken(parsedUser.token || null);

      try {
        // Fetch doctors list
        const doctorsResponse = await appointmentService.getAllDoctors();
        const doctorsList = doctorsResponse.data || [];

        setOriginalDoctorsList(doctorsList);
        setFilteredDoctorsList(doctorsList);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load doctors data');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.user);
    }
  }, []);

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
    navigate(`/book/${doctor.id}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    const params = {};
    if (filters.specialization) params.specialization = filters.specialization;
    if (filters.minRating) params.minRating = filters.minRating;
    if (filters.rate) params.rate = filters.rate;
    if (filters.available !== '') params.available = filters.available;

    try {
      const res = await appointmentService.filterDoctors(params, token);
      setFilteredDoctorsList(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to apply filters');
    }
  };

  // Add loading state handling
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Add error state handling
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">⚠️ Error</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Redirect if user is a doctor
  if (user?.role === 'DOCTOR') {
    return null;
  }

  // Auth check remains the same
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Please log in to view your dashboard.</h1>
      </div>
    );
  }

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
      {user && user?.role === 'PATIENT' && (
        <div>
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
        </div>
      )}

      {/* Updated Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredDoctorsList.length > 0 ? (
          filteredDoctorsList.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={{
                id: doctor.id,
                name: doctor.name,
                expertise: doctor.expertise,
                imageUrl: doctor.imageUrl,
                rating: doctor.rating,
                hourlyRate: doctor.hourlyRate,
                description: doctor.description,
                available: doctor.available,
              }}
              onBook={handleBooking}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No doctors available matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
