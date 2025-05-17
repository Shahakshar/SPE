import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = 'http://localhost:6002';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
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


  /// ==================== User Service

  getAllUsers: () => apiClient.get('/api/v1/users/list'),

  // Get all doctors
  getAllDoctors: () => apiClient.get('/api/v1/users/doctors'),

  // Get all patients
  getAllPatients: () => apiClient.get('/api/v1/users/patients'),

  // Get a user by ID
  getUserById: (id) => apiClient.get(`/api/v1/users/${id}`),

  // Get available doctors only
  getAvailableDoctors: () => apiClient.get('/api/v1/users/doctors/available'),

  // Get doctors by specialization
  getDoctorsBySpecialization: (specialization) =>
    apiClient.get(`/api/v1/users/doctors/specialization/${specialization}`),

  // Get doctors by minimum rating
  getDoctorsByMinimumRating: (minRating) =>
    apiClient.get(`/api/v1/users/doctors/rating/${minRating}`),

  // Get doctors by maximum hourly rate
  getDoctorsByMaxHourlyRate: (maxRate) =>
    apiClient.get(`/api/v1/users/doctors/rate/${maxRate}`),

  // Search users by name
  searchUsersByName: (name) =>
    apiClient.get(`/api/v1/users/search?name=${name}`),

  // Get user by email
  getUserByEmail: (email) =>
    apiClient.get(`/api/v1/users/email/${email}`),

  // Create new user
  createUser: (userData) => apiClient.post('/api/v1/users', userData),

  // Update existing user
  updateUser: (id, userData) => apiClient.put(`/api/v1/users/${id}`, userData),

  // Delete a user
  deleteUser: (id) => apiClient.delete(`/api/v1/users/${id}`),

  // Get future appointments by doctor and date
  // getFutureAppointmentsByDate: (doctorId, date) =>
  //   apiClient.get(`/api/futureAppointments/doctor/${doctorId}/date?date=${date}`),

};

export default appointmentService;