package org.dev.nextgen.appointmentservice.controller;

import lombok.RequiredArgsConstructor;
import org.dev.nextgen.appointmentservice.model.Appointment;
import org.dev.nextgen.appointmentservice.model.MeetingRoom;
import org.dev.nextgen.appointmentservice.repository.AppointmentRepository;
import org.dev.nextgen.appointmentservice.service.AppointmentService;
import org.dev.nextgen.appointmentservice.service.MeetingRoomService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/futureAppointments")
@RequiredArgsConstructor
public class FutureAppointmentsController {
    private final AppointmentService appointmentService;
    private final MeetingRoomService meetingRoomService;

    @GetMapping("/doctor/{doctorId}/all")
    public ResponseEntity<List<Appointment>> getAllAppointmentsForDoctor(
            @PathVariable Long doctorId) {

        List<Appointment> appointments = appointmentService.getAppointmentsByDoctor(doctorId);
        loadMeetingRoomsForAppointments(appointments);

        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/patient/{patientId}/all")
    public ResponseEntity<List<Appointment>> getAllAppointmentsForPatient(
            @PathVariable Long patientId) {

        List<Appointment> appointments = appointmentService.getAppointmentsByPatient(patientId);
        loadMeetingRoomsForAppointments(appointments);

        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/doctor/{doctorId}/upcoming")
    public ResponseEntity<List<Appointment>> getUpcomingAppointmentsForDoctor(
            @PathVariable Long doctorId) {

        // Use the service method for upcoming appointments rather than filtering here
        List<Appointment> upcomingAppointments = appointmentService.getUpcomingAppointmentsForDoctor(doctorId);
        loadMeetingRoomsForAppointments(upcomingAppointments);

        return new ResponseEntity<>(upcomingAppointments, HttpStatus.OK);
    }

    @GetMapping("/patient/{patientId}/upcoming")
    public ResponseEntity<List<Appointment>> getUpcomingAppointmentsForPatient(
            @PathVariable Long patientId) {

        // Use the service method for upcoming appointments rather than filtering here
        List<Appointment> upcomingAppointments = appointmentService.getUpcomingAppointmentsForPatient(patientId);
        loadMeetingRoomsForAppointments(upcomingAppointments);

        return new ResponseEntity<>(upcomingAppointments, HttpStatus.OK);
    }

    @GetMapping("/doctor/{doctorId}/date")
    public ResponseEntity<List<Appointment>> getAppointmentsByDateForDoctor(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<Appointment> appointments = appointmentService.getAppointmentsByDate(date, doctorId);
        loadMeetingRoomsForAppointments(appointments);

        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    /**
     * Helper method to load meeting rooms for appointments
     */
    private void loadMeetingRoomsForAppointments(List<Appointment> appointments) {
        for (Appointment appointment : appointments) {
            try {
                if (appointment.getMeetingRoom() == null && appointment.getMeetingRoomId() != null) {
                    MeetingRoom meetingRoom = meetingRoomService.getMeetingRoomByRoomCode(appointment.getMeetingRoomId());
                    if (meetingRoom != null) {
                        appointment.setMeetingRoom(meetingRoom);
                    }
                }
            } catch (Exception e) {
                System.err.println("Error loading meeting room for appointment " + appointment.getId() + ": " + e.getMessage());
            }
        }
    }
}