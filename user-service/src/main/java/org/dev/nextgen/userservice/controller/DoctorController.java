package org.dev.nextgen.userservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v1/doctors")
@RestController
public class DoctorController {

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to the Doctor API";
    }

}
