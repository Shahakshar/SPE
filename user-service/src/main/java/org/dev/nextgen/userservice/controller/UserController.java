package org.dev.nextgen.userservice.controller;

import org.dev.nextgen.userservice.model.Profile;
import org.dev.nextgen.userservice.service.UserServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserServiceImpl userService;

    public UserController(UserServiceImpl userService) {
        this.userService = userService;
    }

    @GetMapping("/list")
    public ResponseEntity<List<Profile>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/add")
    public ResponseEntity<String> addUsers(List<Profile> users) {
        boolean isAdded = userService.addUsers(users);
        if (isAdded) {
            return ResponseEntity.ok("Users added successfully");
        } else {
            return ResponseEntity.status(500).body("Failed to add users");
        }
    }

}
