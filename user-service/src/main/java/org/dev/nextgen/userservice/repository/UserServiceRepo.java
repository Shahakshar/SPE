package org.dev.nextgen.userservice.repository;

import org.dev.nextgen.userservice.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserServiceRepo extends JpaRepository<Profile, Long> {
    // Custom query methods can be defined here if needed
    // For example, findByName, findBySpecialization, etc.


}
