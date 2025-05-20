package org.dev.nextgen.appointmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsersDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Integer age;
    private String gender;
    private String address;
    private String medicalHistory;
    private String role;

    // Doctor-specific fields
    private String description;
    private String imageUrl;
    private String expertise;
    private Boolean available;
    private Double rating;
    private Double hourlyRate;

}
