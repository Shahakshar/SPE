package org.dev.nextgen.appointmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequest {
    // Doctor and service information
    private Long doctorId;
    private Long serviceId;

    // Appointment details
    private LocalDateTime startTime;
    private String reason;
    private String notes;
    private double consultationFee;
    private int duration; // in minutes

    // Patient information
    private Long patientId; // Optional: if user is registered
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private Integer patientAge;
    private String patientGender;
    private String patientAddress;
    private String medicalHistory;
    private boolean newPatient;
}