package org.dev.nextgen.userservice.controller;

import org.dev.nextgen.userservice.model.User;
import org.dev.nextgen.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("api/v1/patients")
@RestController
public class PatientController {

    private final UserService userService;

    public PatientController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to the Patient API";
    }

//    @GetMapping("/doctor-list")
//    public ResponseEntity<List<User>> getAllDoctors() {
//        List<User> doctors = userService.getAllDoctors();
//        return ResponseEntity.ok(doctors);
//    }

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

}
