package org.dev.nextgen.authenticationandauthorizationmicroservice.repository;

import org.dev.nextgen.authenticationandauthorizationmicroservice.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.password = ?1")
    void updateAllUserPasswords(String newPassword);


}
