
package org.dev.nextgen.appointmentservice.service;

import org.dev.nextgen.appointmentservice.domain.AppointmentStatus;
import org.dev.nextgen.appointmentservice.dto.AppointmentRequest;
import org.dev.nextgen.appointmentservice.dto.ProfileDTO;
import org.dev.nextgen.appointmentservice.dto.UserDTO;
import org.dev.nextgen.appointmentservice.model.Appointment;
import org.dev.nextgen.appointmentservice.model.DoctorReport;
import org.dev.nextgen.appointmentservice.model.Treatment;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentService {

    Appointment createAppointment(AppointmentRequest request, UserDTO userDTO, ProfileDTO profileDTO, Treatment treatment) throws Exception;

    Boolean isTimeSlotAvailable(ProfileDTO profileDTO, LocalDateTime appointmentStartTime, LocalDateTime appointmentEndTime) throws Exception;

    List<Appointment> getAppointmentsByPatient(Long patientId);

    List<Appointment> getAppointmentsByDoctor(Long doctorId);

    Appointment getAppointmentById(Long id) throws Exception;

    Appointment updateAppointmentStatus(Long appointmentId, AppointmentStatus status) throws Exception;

    List<Appointment> getAppointmentsByDate(LocalDate date, Long doctorId);

    List<Appointment> getUpcomingAppointmentsForDoctor(Long doctorId);

    List<Appointment> getUpcomingAppointmentsForPatient(Long patientId);

    DoctorReport getDoctorReport(Long doctorId);
}