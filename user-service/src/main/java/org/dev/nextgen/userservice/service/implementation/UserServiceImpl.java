package org.dev.nextgen.userservice.service.implementation;

import org.dev.nextgen.userservice.model.User;
import org.dev.nextgen.userservice.repository.UserRepository;
import org.dev.nextgen.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    @Override
    public List<User> getAllDoctors() {
        return userRepository.findByRole("DOCTOR");
    }

    @Override
    public List<User> getAllPatients() {
        return userRepository.findByRole("PATIENT");
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getDoctorById(Long id) {
        return userRepository.findById(id)
                .filter(user -> "DOCTOR".equals(user.getRole()));
    }

    @Override
    public Optional<User> getPatientById(Long id) {
        return userRepository.findById(id)
                .filter(user -> "PATIENT".equals(user.getRole()));
    }

    @Override
    @Transactional
    public User saveUser(User user) {
        // Validate user data based on role
        if ("DOCTOR".equals(user.getRole())) {
            validateDoctorData(user);
        } else if ("PATIENT".equals(user.getRole())) {
            validatePatientData(user);
        }

        return userRepository.save(user);
    }

    @Override
    @Transactional
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<User> findDoctorsBySpecialization(String specialization) {
        return userRepository.findByRole("DOCTOR").stream()
                .filter(doctor -> specialization.equalsIgnoreCase(doctor.getExpertise()))
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findAvailableDoctors() {
        return userRepository.findByRole("DOCTOR").stream()
                .filter(doctor -> Boolean.TRUE.equals(doctor.getAvailable()))
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findDoctorsByMinimumRating(Double minRating) {
        return userRepository.findByRole("DOCTOR").stream()
                .filter(doctor -> doctor.getRating() != null && doctor.getRating() >= minRating)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findDoctorsByMaxHourlyRate(Double maxRate) {
        return userRepository.findByRole("DOCTOR").stream()
                .filter(doctor -> doctor.getHourlyRate() != null && doctor.getHourlyRate() <= maxRate)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> searchUsersByName(String name) {
        User example = new User();
        example.setName(name);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)
                .withIgnoreCase();

        return userRepository.findAll(Example.of(example, matcher));
    }

    @Override
    public Optional<User> findUserByEmail(String email) {
        User example = new User();
        example.setEmail(email);

        return userRepository.findOne(Example.of(example));
    }

    @Override
    public List<String> getAllSpecializations() {
        return userRepository.findAllSpecializations();
    }

    /**
     * Validates doctor-specific data
     * @param doctor The doctor user to validate
     */
    private void validateDoctorData(User doctor) {
        if (doctor.getName() == null || doctor.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Doctor name cannot be empty");
        }

        if (doctor.getEmail() == null || doctor.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Doctor email cannot be empty");
        }

        if (doctor.getPhone() == null || doctor.getPhone().trim().isEmpty()) {
            throw new IllegalArgumentException("Doctor phone cannot be empty");
        }

        if (doctor.getExpertise() == null || doctor.getExpertise().trim().isEmpty()) {
            throw new IllegalArgumentException("Doctor specialization cannot be empty");
        }

        // Set default values for optional fields if not provided
        if (doctor.getAvailable() == null) {
            doctor.setAvailable(true);
        }

        if (doctor.getRating() == null) {
            doctor.setRating(0.0);
        }

        if (doctor.getHourlyRate() == null) {
            doctor.setHourlyRate(0.0);
        }
    }

    /**
     * Validates patient-specific data
     * @param patient The patient user to validate
     */
    private void validatePatientData(User patient) {
        if (patient.getName() == null || patient.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Patient name cannot be empty");
        }

        if (patient.getEmail() == null || patient.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Patient email cannot be empty");
        }

        if (patient.getPhone() == null || patient.getPhone().trim().isEmpty()) {
            throw new IllegalArgumentException("Patient phone cannot be empty");
        }
    }


}