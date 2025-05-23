import axios from 'axios';

// Base URL For Appointment service (6002)
const API_BASE_URL = window.env?.VITE_API_BASE_URL || "http://gateway.local";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});


const apiClientAuth = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

// User service (port 6001)
const apiClientUser = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/users`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});


// Appointment services
const appointmentService = {
  // Create a new appointment
  createAppointment: (appointmentData) => {
    return apiClient.post('/api/appointments', appointmentData);
  },

  // Get appointment by ID
  getAppointmentById: (id) => {
    return apiClient.get(`/api/appointments/${id}`);
  },



  // Get appointments by patient ID
  getAppointmentsByPatient: (patientId) => {
    return apiClient.get(`/api/appointments/patient/${patientId}`);
  },

  // Get appointments by doctor ID
  getAppointmentsByDoctor: (doctorId) => {
    return apiClient.get(`/api/appointments/doctor/${doctorId}`);
  },

  // Get appointments by doctor and date
  getAppointmentsByDate: (doctorId, date) => {
    return apiClient.get(`/api/appointments/doctor/${doctorId}/date?date=${date}`);
  },

  // Update appointment status
  updateAppointmentStatus: (id, status) => {
    return apiClient.put(`/api/appointments/${id}/status?status=${status}`);
  },

  getAvailableSlots: (doctorId, date) => {
  return apiClient.get(`/api/appointments/available-slots`, {
    params: { doctorId, date }
  });
},

  // ============================
  // NEW - Future Appointments APIs
  // ============================

  // Get all future appointments for a doctor
  getAllFutureAppointmentsForDoctor: (doctorId) => {
    return apiClient.get(`/api/futureAppointments/doctor/${doctorId}/all`);
  },

  // Get all future appointments for a patient
  getAllFutureAppointmentsForPatient: (patientId) => {
    return apiClient.get(`/api/futureAppointments/patient/${patientId}/all`);
  },

  // Get upcoming appointments for a doctor
  getUpcomingAppointmentsForDoctor: (doctorId) => {
    return apiClient.get(`/api/futureAppointments/doctor/${doctorId}/upcoming`);
  },

  // Get upcoming appointments for a patient
  getUpcomingAppointmentsForPatient: (patientId) => {
    return apiClient.get(`/api/futureAppointments/patient/${patientId}/upcoming`);
  },

  // Get appointments for a doctor on a specific date
  getFutureAppointmentsByDate: (doctorId, date) => {
    return apiClient.get(`/api/futureAppointments/doctor/${doctorId}/date?date=${date}`);
  },


  // ========================
  // Auth Endpoints (3001)
  // ========================

  // Register a new user
  register: (registerData) => apiClientAuth.post('/register', registerData),

  // Login user
  login: (loginData) => apiClientAuth.post('/login', loginData),

  // ========================
  // User Service Endpoints (6001)
  // ========================

  // User CRUD
  getAllUsers: () => apiClientUser.get('/list'),
  getUserById: (id) => apiClientUser.get(`/${id}`),
  getUserByEmail: (email) => apiClientUser.get(`/email/${email}`),
  createUser: (userData) => apiClientUser.post('/', userData),
  updateUser: (id, userData) => apiClientUser.put(`/${id}`, userData),
  deleteUser: (id) => apiClientUser.delete(`/${id}`),

  // Doctor-specific
  getAllDoctors: () => apiClientUser.get('/doctors'),
  getAvailableDoctors: () => apiClientUser.get('/doctors/available'),
  getDoctorsBySpecialization: (specialization) =>
    apiClientUser.get(`/doctors/specialization/${specialization}`),
  getDoctorsByMinimumRating: (minRating) =>
    apiClientUser.get(`/doctors/rating/${minRating}`),
  getDoctorsByMaxHourlyRate: (maxRate) =>
    apiClientUser.get(`/doctors/rate/${maxRate}`),

  // Patient-specific
  getAllPatients: () => apiClientUser.get('/patients'),

  // Search
  searchUsersByName: (name) =>
    apiClientUser.get(`/search?name=${encodeURIComponent(name)}`),

  // For patient dashboard (if applicable)
  getSpecializationList: () =>
    apiClientUser.get('/specialization-list'),

  getDoctorList: (token) =>
    apiClientUser.get('/doctor-list'),
  getDoctorWelcomeData: (token) =>
    apiClientUser.get('/doctors/welcome'),
  filterDoctors: (params, token) =>
    apiClientUser.get(`/doctors/filter?${new URLSearchParams(params)}`),
};

export default appointmentService;