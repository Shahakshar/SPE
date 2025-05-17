package org.dev.nextgen.userservice.service.implementation;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.dev.nextgen.userservice.model.User;
import org.dev.nextgen.userservice.repository.UserRepository;
import org.dev.nextgen.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EntityManager entityManager;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, EntityManager entityManager) {
        this.userRepository = userRepository;
        this.entityManager = entityManager;
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

    @Override
    public List<User> filterDoctors(String specialization, Double minRating, Double rate, Boolean available) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> cq = cb.createQuery(User.class);
        Root<User> root = cq.from(User.class);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("role"), "DOCTOR"));

        if (specialization != null && !specialization.isEmpty())
            predicates.add(cb.equal(root.get("expertise"), specialization));

        if (minRating != null)
            predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), minRating));

        if (rate != null)
            predicates.add(cb.greaterThanOrEqualTo(root.get("hourlyRate"), rate));

        if (available != null)
            predicates.add(cb.equal(root.get("available"), available));

        cq.where(cb.and(predicates.toArray(new Predicate[0])));
        return entityManager.createQuery(cq).getResultList();
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

    // find role by id.

}