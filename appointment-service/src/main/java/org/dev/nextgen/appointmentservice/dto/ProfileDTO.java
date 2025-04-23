package org.dev.nextgen.appointmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private String expertise;
    private boolean available;
    private double rating;
    private double hourlyRate;
    private String email;
    private String phone;
}
