package org.dev.nextgen.authenticationandauthorizationmicroservice.services;

import org.dev.nextgen.authenticationandauthorizationmicroservice.models.BaseResponse;
import org.dev.nextgen.authenticationandauthorizationmicroservice.models.RegisterRequest;

public interface UserService {

    BaseResponse registerUser(RegisterRequest request);

    BaseResponse authenticate(String email, String password);

    BaseResponse getAllUsers();

    BaseResponse updateUser(String email, RegisterRequest request);

    BaseResponse deleteUser(String email);

    BaseResponse getUserByEmail(String email);

    BaseResponse getUserByPhone(String phone);

    BaseResponse changePasswordOfAllUsers(String newPassword);

}
