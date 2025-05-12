package org.dev.nextgen.authenticationandauthorizationmicroservice.repository;

import org.dev.nextgen.authenticationandauthorizationmicroservice.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT MIN(u.id) FROM User u")
    Long findMinId();

    @Query("SELECT MAX(u.id) FROM User u")
    Long findMaxId();



}
