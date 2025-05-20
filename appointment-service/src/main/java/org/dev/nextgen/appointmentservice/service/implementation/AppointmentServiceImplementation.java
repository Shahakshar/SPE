package org.dev.nextgen.appointmentservice.service.implementation;

import jakarta.transaction.Transactional;
import org.dev.nextgen.appointmentservice.domain.AppointmentStatus;
import org.dev.nextgen.appointmentservice.dto.AppointmentRequest;
import org.dev.nextgen.appointmentservice.dto.ProfileDTO;
import org.dev.nextgen.appointmentservice.dto.UsersDTO;
import org.dev.nextgen.appointmentservice.model.MeetingRoom;
import org.dev.nextgen.appointmentservice.model.Treatment;
import org.dev.nextgen.appointmentservice.dto.UserDTO;
import org.dev.nextgen.appointmentservice.model.Appointment;
import org.dev.nextgen.appointmentservice.model.DoctorReport;
import org.dev.nextgen.appointmentservice.repository.AppointmentRepository;
import org.dev.nextgen.appointmentservice.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.dev.nextgen.appointmentservice.service.MeetingRoomService;
import org.dev.nextgen.appointmentservice.service.client.UserServiceFeignClient;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImplementation implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final MeetingRoomService meetingRoomService;
    private final UserServiceFeignClient userServiceFeignClient;

    // Define time slots with standardized format
    private static final List<String> TIME_SLOTS = List.of(
            "09:00 AM", "10:00 AM", "11:00 AM",
            "02:00 PM", "03:00 PM", "04:00 PM"
    );

    // Working hours constants
    private static final LocalTime WORKING_HOURS_START = LocalTime.of(9, 0);
    private static final LocalTime WORKING_HOURS_END = LocalTime.of(17, 0);

    // Format for time slots
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a");

    @Override
    @Transactional
    public Appointment createAppointment(AppointmentRequest request, UserDTO userDTO, ProfileDTO profileDTO, Treatment treatment) throws Exception {
        int appointmentDuration = treatment.getDuration();

        LocalDateTime appointmentStartTime = request.getStartTime();
        LocalDateTime appointmentEndTime = appointmentStartTime.plusMinutes(appointmentDuration);

        // Validate time slot is available
        Boolean isSlotAvailable = isTimeSlotAvailable(profileDTO, appointmentStartTime, appointmentEndTime);
        if (!isSlotAvailable) {
            throw new Exception("The selected time slot is not available. Please choose another time slot.");
        }

        Appointment newAppointment = new Appointment();

        newAppointment.setPatientId(userDTO.getId() != null ? userDTO.getId() : 0L); // 0 for guest users
        newAppointment.setPatientName(userDTO.getName());
        newAppointment.setPatientEmail(userDTO.getEmail());
        newAppointment.setPatientPhone(userDTO.getPhone());
        newAppointment.setPatientAge(userDTO.getAge());
        newAppointment.setPatientGender(userDTO.getGender());

        newAppointment.setDoctorId(profileDTO.getId());
        UsersDTO usersDTO = userServiceFeignClient.getUserById(profileDTO.getId()).getBody();

        newAppointment.setDoctorName(usersDTO.getName());
        newAppointment.setServiceId(treatment.getId());

        newAppointment.setStatus(AppointmentStatus.PENDING);
        newAppointment.setStartTime(appointmentStartTime);
        newAppointment.setEndTime(appointmentEndTime);
        newAppointment.setConsultationFee(treatment.getPrice());
        newAppointment.setReason(request.getReason());
        newAppointment.setNotes(request.getNotes());
        newAppointment.setCreatedAt(LocalDateTime.now());

        Appointment savedAppointment = appointmentRepository.save(newAppointment);

        MeetingRoom meetingRoom = meetingRoomService.createMeetingRoom(savedAppointment);

        savedAppointment.setMeetingRoomId(meetingRoom.getRoomCode());
        return appointmentRepository.save(savedAppointment);
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

        // Check if the appointment is on a Sunday (day of week 7)
        if (appointmentDate.getDayOfWeek().getValue() == 7) {
            throw new Exception("Appointments are not available on Sundays");
        }

        // Check if appointment is during doctor's working hours
        LocalDateTime doctorDayStart = LocalDateTime.of(appointmentDate, WORKING_HOURS_START);
        LocalDateTime doctorDayEnd = LocalDateTime.of(appointmentDate, WORKING_HOURS_END);

        if (appointmentStartTime.isBefore(doctorDayStart) || appointmentEndTime.isAfter(doctorDayEnd)) {
            throw new Exception("Appointment time must be within doctor's working hours (9 AM to 5 PM)");
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

        // Check if the appointment start time matches one of our standard time slots
        LocalTime appointmentTime = appointmentStartTime.toLocalTime();
        String formattedTime = appointmentTime.format(TIME_FORMATTER).toUpperCase();

        boolean isStandardTimeSlot = TIME_SLOTS.stream()
                .anyMatch(slot -> slot.equalsIgnoreCase(formattedTime));

        if (!isStandardTimeSlot) {
            throw new Exception("Please select one of the standard appointment time slots");
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
        if (dateTime == null) return false;
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

    public MeetingRoom getMeetingRoomForAppointment(Long appointmentId) throws Exception {
        // First check if appointment exists
        getAppointmentById(appointmentId);
        return meetingRoomService.getMeetingRoomByAppointmentId(appointmentId);
    }

    /**
     * Gets available time slots for a specific doctor on a specific date
     */
    @Override
    public List<String> getAvailableTimeSlots(Long doctorId, LocalDate date) {
        // Check if date is null or in the past
        LocalDate today = LocalDate.now();
        if (date == null || date.isBefore(today)) {
            return new ArrayList<>();
        }

        // Check if date is a Sunday (no slots available on Sundays)
        if (date.getDayOfWeek().getValue() == 7) {
            return new ArrayList<>();
        }

        // Get all existing appointments for this doctor on this date
        List<Appointment> existingAppointments = appointmentRepository
                .findByDoctorIdAndDate(doctorId, date);

        // If repository method is not working, get appointments by doctor and filter by date
        if (existingAppointments == null) {
            existingAppointments = getAppointmentsByDoctor(doctorId).stream()
                    .filter(appointment -> isSameDate(appointment.getStartTime(), date))
                    .collect(Collectors.toList());
        }

        // Convert to a set of time strings for easier comparison
        Set<String> bookedTimes = existingAppointments.stream()
                .filter(appointment -> appointment.getStatus() != AppointmentStatus.CANCELLED)
                .map(appointment -> {
                    LocalTime time = appointment.getStartTime().toLocalTime();
                    return time.format(TIME_FORMATTER).toUpperCase();
                })
                .collect(Collectors.toSet());

        // Filter the time slots to only include available ones
        return TIME_SLOTS.stream()
                .filter(slotStr -> !bookedTimes.contains(slotStr.toUpperCase()))
                .collect(Collectors.toList());
    }
}