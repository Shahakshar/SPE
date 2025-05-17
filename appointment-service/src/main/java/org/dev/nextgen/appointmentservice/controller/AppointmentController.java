package org.dev.nextgen.appointmentservice.controller;

import lombok.RequiredArgsConstructor;
import org.dev.nextgen.appointmentservice.domain.AppointmentStatus;
import org.dev.nextgen.appointmentservice.dto.AppointmentRequest;
import org.dev.nextgen.appointmentservice.dto.ProfileDTO;
import org.dev.nextgen.appointmentservice.dto.UserDTO;
import org.dev.nextgen.appointmentservice.model.Appointment;
import org.dev.nextgen.appointmentservice.model.DoctorReport;
import org.dev.nextgen.appointmentservice.model.Treatment;
import org.dev.nextgen.appointmentservice.service.AppointmentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;


    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequest request) {
        try {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(request.getPatientId());
            userDTO.setName(request.getPatientName());
            userDTO.setEmail(request.getPatientEmail());
            userDTO.setPhone(request.getPatientPhone());
            userDTO.setAge(request.getPatientAge());
            userDTO.setGender(request.getPatientGender());
            userDTO.setAddress(request.getPatientAddress());

            ProfileDTO profileDTO = new ProfileDTO();
            profileDTO.setId(request.getDoctorId());
            profileDTO.setAvailable(true);


            Treatment treatment = new Treatment();
            treatment.setId(request.getServiceId());
            treatment.setPrice(request.getConsultationFee());
            treatment.setDuration(request.getDuration());

            Appointment appointment = appointmentService.createAppointment(request, userDTO, profileDTO, treatment);
            return new ResponseEntity<>(appointment, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long id) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(id);
            return new ResponseEntity<>(appointment, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable Long patientId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByPatient(patientId);
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByDoctor(doctorId);
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/doctor/{doctorId}/date")
    public ResponseEntity<List<Appointment>> getAppointmentsByDate(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Appointment> appointments = appointmentService.getAppointmentsByDate(date, doctorId);
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status) {
        try {
            Appointment updatedAppointment = appointmentService.updateAppointmentStatus(id, status);
            return new ResponseEntity<>(updatedAppointment, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/doctor/{doctorId}/report")
    public ResponseEntity<DoctorReport> getDoctorReport(@PathVariable Long doctorId) {
        DoctorReport report = appointmentService.getDoctorReport(doctorId);
        return new ResponseEntity<>(report, HttpStatus.OK);
    }

    @GetMapping("/available-slots")
    public ResponseEntity<List<String>> getAvailableSlots(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<String> availableSlots = appointmentService.getAvailableTimeSlots(doctorId, date);
        return ResponseEntity.ok(availableSlots);
    }
}