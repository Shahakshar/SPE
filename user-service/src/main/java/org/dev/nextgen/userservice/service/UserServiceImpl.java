package org.dev.nextgen.userservice.service;

import org.dev.nextgen.userservice.model.Profile;
import org.dev.nextgen.userservice.repository.UserServiceRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl {

    private final UserServiceRepo userServiceRepo;

    public UserServiceImpl(UserServiceRepo userServiceRepo) {
        this.userServiceRepo = userServiceRepo;
    }

    public List<Profile> getAllUsers() {
        return userServiceRepo.findAll();
    }

    public boolean addUsers(List<Profile> users) {
        try {
            userServiceRepo.saveAll(users);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
