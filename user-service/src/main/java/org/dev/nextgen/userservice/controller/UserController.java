package org.dev.nextgen.userservice.controller;

import org.dev.nextgen.userservice.model.User;
import org.dev.nextgen.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/list")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getAllDoctors() {
        List<User> doctors = userService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/patients")
    public ResponseEntity<List<User>> getAllPatients() {
        List<User> patients = userService.getAllPatients();
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/doctors/available")
    public ResponseEntity<List<User>> getAvailableDoctors() {
        List<User> availableDoctors = userService.findAvailableDoctors();
        return ResponseEntity.ok(availableDoctors);
    }

    @GetMapping("/doctors/specialization/{specialization}")
    public ResponseEntity<List<User>> getDoctorsBySpecialization(
            @PathVariable String specialization) {
        List<User> doctors = userService.findDoctorsBySpecialization(specialization);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/doctors/rating/{minRating}")
    public ResponseEntity<List<User>> getDoctorsByMinimumRating(
            @PathVariable Double minRating) {
        List<User> doctors = userService.findDoctorsByMinimumRating(minRating);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/doctors/rate/{maxRate}")
    public ResponseEntity<List<User>> getDoctorsByMaxHourlyRate(
            @PathVariable Double maxRate) {
        List<User> doctors = userService.findDoctorsByMaxHourlyRate(maxRate);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsersByName(
            @RequestParam String name) {
        List<User> users = userService.searchUsersByName(name);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.findUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User savedUser = userService.saveUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return (ResponseEntity<User>) userService.getUserById(id)
                .map(existingUser -> {
                    user.setId(id);
                    try {
                        User updatedUser = userService.saveUser(user);
                        return ResponseEntity.ok(updatedUser);
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userService.deleteUser(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}