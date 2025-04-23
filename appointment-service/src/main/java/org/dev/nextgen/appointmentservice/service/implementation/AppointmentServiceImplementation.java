package org.dev.nextgen.appointmentservice.service.implementation;

import org.dev.nextgen.appointmentservice.domain.AppointmentStatus;
import org.dev.nextgen.appointmentservice.dto.AppointmentRequest;
import org.dev.nextgen.appointmentservice.dto.ProfileDTO;
import org.dev.nextgen.appointmentservice.model.Treatment;
import org.dev.nextgen.appointmentservice.dto.UserDTO;
import org.dev.nextgen.appointmentservice.model.Appointment;
import org.dev.nextgen.appointmentservice.model.DoctorReport;
import org.dev.nextgen.appointmentservice.repository.AppointmentRepository;
import org.dev.nextgen.appointmentservice.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service    
@RequiredArgsConstructor
public class AppointmentServiceImplementation implements AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Override
    public Appointment createAppointment(AppointmentRequest request, UserDTO userDTO, ProfileDTO profileDTO, Treatment treatment) throws Exception {
        int appointmentDuration = treatment.getDuration();

        LocalDateTime appointmentStartTime = request.getStartTime();
        LocalDateTime appointmentEndTime = appointmentStartTime.plusMinutes(appointmentDuration);

        // Check if time slot is available
        Boolean isSlotAvailable = isTimeSlotAvailable(profileDTO, appointmentStartTime, appointmentEndTime);

        // Create the appointment
        Appointment newAppointment = new Appointment();

        // Set patient information
        newAppointment.setPatientId(userDTO.getId() != null ? userDTO.getId() : 0L); // 0 for guest users
        newAppointment.setPatientName(userDTO.getName());
        newAppointment.setPatientEmail(userDTO.getEmail());
        newAppointment.setPatientPhone(userDTO.getPhone());
        newAppointment.setPatientAge(userDTO.getAge());
        newAppointment.setPatientGender(userDTO.getGender());

        // Set doctor and service information
        newAppointment.setDoctorId(profileDTO.getId());
        newAppointment.setServiceId(treatment.getId());

        // Set appointment details
        newAppointment.setStatus(AppointmentStatus.PENDING);
        newAppointment.setStartTime(appointmentStartTime);
        newAppointment.setEndTime(appointmentEndTime);
        newAppointment.setConsultationFee(treatment.getPrice());
        newAppointment.setReason(request.getReason());
        newAppointment.setNotes(request.getNotes());
        newAppointment.setCreatedAt(LocalDateTime.now());

        // Generate unique meeting room ID
        String meetingRoomId = "DR-" + profileDTO.getId() + "-PT-" +
                (userDTO.getId() != null ? userDTO.getId() : "GUEST") + "-" +
                System.currentTimeMillis();
        newAppointment.setMeetingRoomId(meetingRoomId);

        return appointmentRepository.save(newAppointment);
    }

    private String generateMeetingRoomId(Long doctorId, Long patientId, LocalDateTime startTime) {
        // Generate a unique meeting room ID
        return "DR-" + doctorId + "-PT-" + patientId + "-" + startTime.toLocalDate().toString().replace("-", "");
    }

    public Boolean isTimeSlotAvailable(ProfileDTO profileDTO, LocalDateTime appointmentStartTime, LocalDateTime appointmentEndTime) throws Exception {
        // Get all existing appointments for the doctor
        List<Appointment> existingAppointments = getAppointmentsByDoctor(profileDTO.getId());

        // Check if doctor is available
        if (!profileDTO.isAvailable()) {
            throw new Exception("Doctor is not available for appointments");
        }

        // Extract the day of week to check doctor's working hours
        LocalDate appointmentDate = appointmentStartTime.toLocalDate();

        // Check if appointment is during doctor's working hours (assume working hours are 9 AM to 5 PM)
        LocalTime doctorStartTime = LocalTime.of(9, 0); // Can be moved to doctor profile
        LocalTime doctorEndTime = LocalTime.of(17, 0); // Can be moved to doctor profile

        LocalDateTime doctorDayStart = LocalDateTime.of(appointmentDate, doctorStartTime);
        LocalDateTime doctorDayEnd = LocalDateTime.of(appointmentDate, doctorEndTime);

        if (appointmentStartTime.isBefore(doctorDayStart) || appointmentEndTime.isAfter(doctorDayEnd)) {
            throw new Exception("Appointment time must be within doctor's working hours");
        }

        // Check if the requested slot overlaps with existing appointments
        for (Appointment existingAppointment : existingAppointments) {
            // Skip cancelled appointments
            if (existingAppointment.getStatus() == AppointmentStatus.CANCELLED) {
                continue;
            }

            LocalDateTime existingStart = existingAppointment.getStartTime();
            LocalDateTime existingEnd = existingAppointment.getEndTime();

            // Check for overlap
            if (appointmentStartTime.isBefore(existingEnd) && appointmentEndTime.isAfter(existingStart)) {
                throw new Exception("Doctor is not available at the requested time. Please choose a different time slot.");
            }

            // Check for exact match
            if (appointmentStartTime.isEqual(existingStart) || appointmentEndTime.isEqual(existingEnd)) {
                throw new Exception("This time slot is already booked. Please choose a different time slot.");
            }
        }

        return true;
    }

    @Override
    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    @Override
    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @Override
    public Appointment getAppointmentById(Long id) throws Exception {
        Appointment appointment = appointmentRepository.findById(id).orElse(null);
        if (appointment == null) {
            throw new Exception("Appointment not found");
        }
        return appointment;
    }

    @Override
    public Appointment updateAppointmentStatus(Long appointmentId, AppointmentStatus status) throws Exception {
        Appointment appointment = getAppointmentById(appointmentId);
        appointment.setStatus(status);

        // If appointment is completed, add additional information
        if (status == AppointmentStatus.COMPLETED) {
            appointment.setCompletedAt(LocalDateTime.now());
        }

        // If appointment is cancelled, record cancellation time
        if (status == AppointmentStatus.CANCELLED) {
            appointment.setCancelledAt(LocalDateTime.now());
        }

        return appointmentRepository.save(appointment);
    }

    @Override
    public List<Appointment> getAppointmentsByDate(LocalDate date, Long doctorId) {
        List<Appointment> allAppointments = getAppointmentsByDoctor(doctorId);

        if (date == null) {
            return allAppointments;
        }

        return allAppointments.stream()
                .filter(appointment -> isSameDate(appointment.getStartTime(), date))
                .collect(Collectors.toList());
    }

    private boolean isSameDate(LocalDateTime dateTime, LocalDate date) {
        return dateTime.toLocalDate().isEqual(date);
    }

    @Override
    public List<Appointment> getUpcomingAppointmentsForDoctor(Long doctorId) {
        List<Appointment> allAppointments = getAppointmentsByDoctor(doctorId);
        LocalDateTime now = LocalDateTime.now();

        return allAppointments.stream()
                .filter(appointment ->
                        (appointment.getStatus() == AppointmentStatus.CONFIRMED ||
                                appointment.getStatus() == AppointmentStatus.PENDING) &&
                                appointment.getStartTime().isAfter(now))
                .collect(Collectors.toList());
    }

    @Override
    public List<Appointment> getUpcomingAppointmentsForPatient(Long patientId) {
        List<Appointment> allAppointments = getAppointmentsByPatient(patientId);
        LocalDateTime now = LocalDateTime.now();

        return allAppointments.stream()
                .filter(appointment ->
                        (appointment.getStatus() == AppointmentStatus.CONFIRMED ||
                                appointment.getStatus() == AppointmentStatus.PENDING) &&
                                appointment.getStartTime().isAfter(now))
                .collect(Collectors.toList());
    }

    @Override
    public DoctorReport getDoctorReport(Long doctorId) {
        List<Appointment> appointments = getAppointmentsByDoctor(doctorId);

        double totalEarnings = appointments.stream()
                .filter(appointment -> appointment.getStatus() == AppointmentStatus.COMPLETED)
                .mapToDouble(Appointment::getConsultationFee)
                .sum();

        int totalAppointments = appointments.size();

        List<Appointment> cancelledAppointments = appointments.stream()
                .filter(appointment -> appointment.getStatus() == AppointmentStatus.CANCELLED)
                .collect(Collectors.toList());

        double totalRefunds = cancelledAppointments.stream()
                .mapToDouble(Appointment::getConsultationFee)
                .sum();

        int completedAppointments = (int) appointments.stream()
                .filter(appointment -> appointment.getStatus() == AppointmentStatus.COMPLETED)
                .count();

        DoctorReport report = new DoctorReport();
        report.setDoctorId(doctorId);
        report.setCancelledAppointments(cancelledAppointments.size());
        report.setTotalEarnings(totalEarnings);
        report.setTotalAppointments(totalAppointments);
        report.setCompletedAppointments(completedAppointments);
        report.setTotalRefunds(totalRefunds);

        return report;
    }
}