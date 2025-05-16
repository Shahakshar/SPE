package org.dev.nextgen.userservice.controller;

import org.dev.nextgen.userservice.model.BaseResponse;
import org.dev.nextgen.userservice.model.User;
import org.dev.nextgen.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/api/v1/patients")
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

    @GetMapping("/doctor-list")
    public ResponseEntity<BaseResponse> getAllDoctors() {
        List<User> doctors = userService.getAllDoctors();
        BaseResponse response = new BaseResponse("200", "Success", null, doctors);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctors/available")
    public ResponseEntity<BaseResponse> getAvailableDoctors() {
        List<User> availableDoctors = userService.findAvailableDoctors();
        BaseResponse response = new BaseResponse("200", "Success", null, availableDoctors);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/specialization-list")
    public ResponseEntity<BaseResponse> getAllSpecializations() {
        List<String> specializations = userService.getAllSpecializations();
        BaseResponse response = new BaseResponse("200", "Success", null, specializations);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctors/specialization/{specialization}")
    public ResponseEntity<BaseResponse> getDoctorsBySpecialization(
            @PathVariable String specialization) {
        List<User> doctors = userService.findDoctorsBySpecialization(specialization);
        BaseResponse response = new BaseResponse("200", "Success", null, doctors);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctors/rating/{minRating}")
    public ResponseEntity<BaseResponse> getDoctorsByMinimumRating(
            @PathVariable Double minRating) {
        List<User> doctors = userService.findDoctorsByMinimumRating(minRating);
        BaseResponse response = new BaseResponse("200", "Success", null, doctors);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctors/rate/{maxRate}")
    public ResponseEntity<BaseResponse> getDoctorsByMaxHourlyRate(
            @PathVariable Double maxRate) {
        List<User> doctors = userService.findDoctorsByMaxHourlyRate(maxRate);
        BaseResponse response = new BaseResponse("200", "Success", null, doctors);
        return ResponseEntity.ok(response);
    }

}
