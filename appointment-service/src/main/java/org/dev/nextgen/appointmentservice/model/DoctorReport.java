package org.dev.nextgen.appointmentservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorReport {
    private Long doctorId;
    private int totalAppointments;
    private int completedAppointments;
    private int cancelledAppointments;
    private double totalEarnings;
    private double totalRefunds;
}
