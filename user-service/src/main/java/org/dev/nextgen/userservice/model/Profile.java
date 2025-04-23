package org.dev.nextgen.userservice.model;

import jakarta.persistence.*;

@Table(name = "profile")
@Entity
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dr_name", nullable = false)
    private String name;

    @Column(name = "dr_specialization", nullable = false)
    private String description;

    @Column(name = "dr_image", nullable = false)
    private String imageUrl;

    @Column(name = "dr_specialization", nullable = false)
    private String expertise;

    @Column(name="dr_available", nullable = false)
    private boolean available;

    @Column(name = "dr_rating", nullable = false)
    private double rating;

    @Column(name = "dr_hourly_rate", nullable = false)
    private double hourlyRate;

    @Column(name = "dr_email", nullable = false)
    private String email;

    @Column(name = "dr_phone", nullable = false)
    private String phone;

}
