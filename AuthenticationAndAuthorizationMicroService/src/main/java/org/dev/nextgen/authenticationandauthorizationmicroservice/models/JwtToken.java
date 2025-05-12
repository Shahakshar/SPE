package org.dev.nextgen.authenticationandauthorizationmicroservice.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jwt_tokens")
public class JwtToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @OneToOne
    @JoinColumn(name = "email", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime issuedAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private Long sessionDuration;

    public JwtToken(Long id, String token, User user, LocalDateTime issuedAt, LocalDateTime expiresAt, Long sessionDuration) {
        this.id = id;
        this.token = token;
        this.user = user;
        this.issuedAt = issuedAt;
        this.expiresAt = expiresAt;
        this.sessionDuration = sessionDuration;
    }

    public JwtToken() {}

}
