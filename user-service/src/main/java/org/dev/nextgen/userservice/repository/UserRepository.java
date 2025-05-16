package org.dev.nextgen.userservice.repository;

import org.dev.nextgen.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find users by role
     * @param role The role to filter by
     * @return List of users with the specified role
     */
    List<User> findByRole(String role);

    /**
     * Find user by email
     * @param email The email to search for
     * @return Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Find users by name containing the search term (case-insensitive)
     * @param name The name search term
     * @return List of users with matching names
     */
    List<User> findByNameContainingIgnoreCase(String name);

    /**
     * Find doctors by specialization
     * @param specialization The specialization to search for
     * @return List of doctors with the specified specialization
     */
    @Query("SELECT u FROM User u WHERE u.role = 'DOCTOR' AND u.expertise = :specialization")
    List<User> findDoctorsBySpecialization(@Param("specialization") String specialization);

    /**
     * Find available doctors
     * @return List of available doctors
     */
    @Query("SELECT u FROM User u WHERE u.role = 'DOCTOR' AND u.available = true")
    List<User> findAvailableDoctors();

    /**
     * Find doctors with rating greater than or equal to specified value
     * @param rating The minimum rating threshold
     * @return List of doctors with the specified minimum rating
     */
    @Query("SELECT u FROM User u WHERE u.role = 'DOCTOR' AND u.rating >= :rating")
    List<User> findDoctorsByMinimumRating(@Param("rating") Double rating);

    /**
     * Find doctors with hourly rate less than or equal to specified value
     * @param rate The maximum hourly rate
     * @return List of doctors with hourly rates below the specified threshold
     */
    @Query("SELECT u FROM User u WHERE u.role = 'DOCTOR' AND u.hourlyRate <= :rate")
    List<User> findDoctorsByMaxHourlyRate(@Param("rate") Double rate);

    @Query("SELECT DISTINCT u.expertise FROM User u WHERE u.role = 'DOCTOR'")
    List<String> findAllSpecializations();
}