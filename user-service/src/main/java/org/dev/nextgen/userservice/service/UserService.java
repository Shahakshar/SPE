package org.dev.nextgen.userservice.service;

import org.dev.nextgen.userservice.model.User;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for User operations
 */
public interface UserService {

    /**
     * Get all users regardless of role
     * @return List of all users
     */
    List<User> getAllUsers();

    /**
     * Get users filtered by specific role
     * @param role The role to filter by (e.g., "DOCTOR", "PATIENT")
     * @return List of users with the specified role
     */
    List<User> getUsersByRole(String role);

    /**
     * Get all doctors in the system
     * @return List of users with doctor role
     */
    List<User> getAllDoctors();

    /**
     * Get all patients in the system
     * @return List of users with patient role
     */
    List<User> getAllPatients();

    /**
     * Find a user by their ID
     * @param id The user ID
     * @return Optional containing the user if found
     */
    Optional<User> getUserById(Long id);

    /**
     * Find a doctor by their ID
     * @param id The doctor ID
     * @return Optional containing the doctor if found
     */
    Optional<User> getDoctorById(Long id);

    /**
     * Find a patient by their ID
     * @param id The patient ID
     * @return Optional containing the patient if found
     */
    Optional<User> getPatientById(Long id);

    /**
     * Save a new user or update an existing one
     * @param user The user to save
     * @return The saved user with updated ID
     */
    User saveUser(User user);

    /**
     * Delete a user by their ID
     * @param id The ID of the user to delete
     * @return true if deleted, false if user not found
     */
    boolean deleteUser(Long id);

    /**
     * Find users by specialization (for doctors)
     * @param specialization The specialization to search for
     * @return List of doctors with the given specialization
     */
    List<User> findDoctorsBySpecialization(String specialization);

    /**
     * Find doctors available for appointments
     * @return List of available doctors
     */
    List<User> findAvailableDoctors();

    /**
     * Find doctors by minimum rating
     * @param minRating The minimum rating threshold
     * @return List of doctors with ratings at or above the threshold
     */
    List<User> findDoctorsByMinimumRating(Double minRating);

    /**
     * Find doctors by maximum hourly rate
     * @param maxRate The maximum hourly rate
     * @return List of doctors with hourly rates at or below the threshold
     */
    List<User> findDoctorsByMaxHourlyRate(Double maxRate);

    /**
     * Search for users by name (partial match)
     * @param name The name to search for
     * @return List of users with matching names
     */
    List<User> searchUsersByName(String name);

    /**
     * Find user by email
     * @param email The email to search for
     * @return Optional containing the user if found
     */
    Optional<User> findUserByEmail(String email);
}