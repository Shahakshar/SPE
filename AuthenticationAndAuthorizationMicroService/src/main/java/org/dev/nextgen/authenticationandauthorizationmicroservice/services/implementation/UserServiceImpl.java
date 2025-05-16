package org.dev.nextgen.authenticationandauthorizationmicroservice.services.implementation;

import org.dev.nextgen.authenticationandauthorizationmicroservice.configuration.CustomPasswordEncoder;
import org.dev.nextgen.authenticationandauthorizationmicroservice.models.BaseResponse;
import org.dev.nextgen.authenticationandauthorizationmicroservice.models.LoginResponse;
import org.dev.nextgen.authenticationandauthorizationmicroservice.models.RegisterRequest;
import org.dev.nextgen.authenticationandauthorizationmicroservice.models.User;
import org.dev.nextgen.authenticationandauthorizationmicroservice.repository.UserRepository;
import org.dev.nextgen.authenticationandauthorizationmicroservice.services.UserService;
import org.dev.nextgen.authenticationandauthorizationmicroservice.utils.JwtUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CustomPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(UserRepository userRepository, CustomPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public BaseResponse registerUser(RegisterRequest request) {
        if (checkUserParameters(request) != null) {
            return checkUserParameters(request);
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAge(request.getAge());
        user.setGender(request.getGender());
        user.setAddress(request.getAddress());
        user.setRole(request.getRole());

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        if (request.getRole().equals("DOCTOR")) {

            if (request.getExpertise() == null || request.getExpertise().isEmpty()) {
                return new BaseResponse("Expertise is required for doctors", "400", "Bad Request", null);
            }
            user.setDescription(request.getDr_description());
            user.setImageUrl(request.getImageUrl());
            user.setExpertise(request.getExpertise());
            user.setAvailable(request.isAvailable());
            user.setRating(0.0);
            user.setHourlyRate(request.getHourlyRate());
        } else {
            user.setDescription(null);
            user.setImageUrl(null);
            user.setExpertise("");
            user.setAvailable(false);
            user.setRating(0.0);
            user.setHourlyRate(0.0);
        }

        try {
            // Save the user and get the saved entity
            User savedUser = userRepository.save(user);
            return new BaseResponse("User registered successfully", "201", null, savedUser.getId());
        } catch (Exception e) {
            // Log the exception
            return new BaseResponse("Failed to register user: " + e.getMessage(), "500", "Internal Server Error", null);
        }
    }

    @Override
    public BaseResponse authenticate(String email, String password) {

        boolean isEmailValid = userRepository.findByEmail(email)
                .map(user -> user.getEmail().equals(email))
                .orElse(false);
        if (!isEmailValid) {
            return new BaseResponse("Invalid email or password", "401", "Unauthorized", null);
        }

        boolean isPasswordCorrect = userRepository.findByEmail(email)
                .map(user -> passwordEncoder.matches(password, user.getPassword()))
                .orElse(false);

        if (!isPasswordCorrect) {
            return new BaseResponse("Invalid email or password", "401", "Unauthorized", null);
        }

        User user = userRepository.findByEmail(email).get();
        String token = jwtUtil.generateToken(user);

        LoginResponse loginResponse = new LoginResponse(token, user);

        return new BaseResponse("Login successful", "200", "OK", loginResponse);
    }

    @Override
    public BaseResponse getAllUsers() {
        return null;
    }

    @Override
    public BaseResponse updateUser(String email, RegisterRequest request) {
        return null;
    }

    @Override
    public BaseResponse deleteUser(String email) {
        return null;
    }

    @Override
    public BaseResponse getUserByEmail(String email) {
        if (userRepository.findByEmail(email).isEmpty()) {
            return new BaseResponse("User registered successfully", "400", "NOT Found", null);
        }
        return  new BaseResponse("User registered successfully", "200", "OK", userRepository.findByEmail(email).get());
    }

    @Override
    public BaseResponse getUserByPhone(String phone) {
        return null;
    }

    private BaseResponse checkUserParameters(RegisterRequest request) {
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return new BaseResponse("Password is required", "400", "Bad Request", null);
        }
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return new BaseResponse("Email is required", "400", "Bad Request", null);
        }
        if (request.getPhone() == null || request.getPhone().isEmpty()) {
            return new BaseResponse("Phone number is required", "400", "Bad Request", null);
        }
        if (request.getRole() == null || request.getRole().isEmpty()) {
            return new BaseResponse("Role is required", "400", "Bad Request", null);
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new BaseResponse("Email already in use", "409", "Conflict", null);
        }

        return null;
    }
}
