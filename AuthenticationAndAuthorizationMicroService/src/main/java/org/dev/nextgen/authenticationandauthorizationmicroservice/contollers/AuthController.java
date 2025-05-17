package org.dev.nextgen.authenticationandauthorizationmicroservice.contollers;

import org.dev.nextgen.authenticationandauthorizationmicroservice.models.BaseResponse;
import org.dev.nextgen.authenticationandauthorizationmicroservice.models.LoginRequest;
import org.dev.nextgen.authenticationandauthorizationmicroservice.models.RegisterRequest;
import org.dev.nextgen.authenticationandauthorizationmicroservice.services.UserService;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/welcome")
    public BaseResponse welcome() {
        return new BaseResponse("Welcome to Auth Api", "200", null, null);
    }

//    @GetMapping("/email/{email}")
//    public ResponseEntity<BaseResponse> getUser(@PathVariable String email) {
//        BaseResponse baseResponse = userService.getUserByEmail(email);
//        return ResponseEntity.status(HttpStatusCode.valueOf(Integer.parseInt(baseResponse.getStatus()))).body(baseResponse);
//    }

    @PostMapping("/register")
    public ResponseEntity<BaseResponse> register(@RequestBody RegisterRequest request) {
        BaseResponse baseResponse = userService.registerUser(request);

        return ResponseEntity.status(HttpStatusCode.valueOf(Integer.parseInt(baseResponse.getStatus()))).body(baseResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<BaseResponse> login(@RequestBody LoginRequest request) {
        BaseResponse baseResponse = userService.authenticate(request.email(), request.password());

        return ResponseEntity.status(HttpStatusCode.valueOf(Integer.parseInt(baseResponse.getStatus()))).body(baseResponse);
    }
}

