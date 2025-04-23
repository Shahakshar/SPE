package org.dev.nextgen.userservice.model;

import jakarta.persistence.*;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user") // Use backticks in SQL to avoid reserved word issues
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;
    private Integer age;
    private String gender;
    private String address;

    @Column(name = "medical_history", columnDefinition = "TEXT")
    private String medicalHistory;
}
