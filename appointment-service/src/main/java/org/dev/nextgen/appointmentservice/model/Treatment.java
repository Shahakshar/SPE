package org.dev.nextgen.appointmentservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "treatment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Treatment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private double price;
    private int duration; // in minutes
}
