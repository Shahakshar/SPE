package org.dev.nextgen.userservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users") // Using "users" to avoid reserved word issues
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String address;

    @Column(name = "medical_history", columnDefinition = "TEXT")
    private String medicalHistory;

    // Role information
    @Column(nullable = false)
    private String role; // "DOCTOR" or "PATIENT" or other roles

    // Doctor specific fields (null for non-doctors)
    @Column(name = "dr_description")
    private String description;

    @Column(name = "dr_image")
    private String imageUrl;

    @Column(name = "dr_specialization", nullable = false)
    private String expertise;

    @Column(name = "dr_available")
    private Boolean available;

    @Column(name = "dr_rating", nullable = false)
    private Double rating;

    @Column(name = "dr_hourly_rate", nullable = false)
    private Double hourlyRate;

    @JsonIgnore
    @Column(name = "password", nullable = false)
    private String password;

}