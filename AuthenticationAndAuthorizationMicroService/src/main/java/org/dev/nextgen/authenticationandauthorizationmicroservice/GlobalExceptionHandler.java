package org.dev.nextgen.authenticationandauthorizationmicroservice;

import org.dev.nextgen.authenticationandauthorizationmicroservice.models.BaseResponse;
import org.dev.nextgen.authenticationandauthorizationmicroservice.utils.exceptions.EmailAlreadyExistsException;
import org.dev.nextgen.authenticationandauthorizationmicroservice.utils.exceptions.NotFoundException;
import org.dev.nextgen.authenticationandauthorizationmicroservice.utils.exceptions.UsernameAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<BaseResponse> handleUsernameAlreadyExists(UsernameAlreadyExistsException ex) {
        BaseResponse response = new BaseResponse(
                "Username is already taken",
                "FAILURE",
                ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler
    public ResponseEntity<BaseResponse> handleNotFound(NotFoundException ex) {
        BaseResponse response = new BaseResponse(
                "Not Found!",
                "FAILURE",
                ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    public ResponseEntity<BaseResponse> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        BaseResponse response = new BaseResponse(
                "Email is already taken",
                "FAILURE",
                ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse> handleGenericException(Exception ex) {
        BaseResponse response = new BaseResponse(
                "Something went wrong",
                "FAILURE",
                ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
