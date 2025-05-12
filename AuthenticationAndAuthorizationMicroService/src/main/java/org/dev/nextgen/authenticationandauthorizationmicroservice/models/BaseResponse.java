package org.dev.nextgen.authenticationandauthorizationmicroservice.models;

public class BaseResponse {

    private String message;
    private String status;
    private String error;
    private Object data;

    public BaseResponse(String message, String status, String error, Object data) {
        this.message = message;
        this.status = status;
        this.error = error;
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
