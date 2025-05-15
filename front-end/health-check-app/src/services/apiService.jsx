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
  }
};

export default appointmentService;