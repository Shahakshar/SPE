package org.dev.nextgen.authenticationandauthorizationmicroservice.models;

public class RegisterRequest {

    private String name;
    private String email;
    private String phone;
    private Integer age;
    private String gender;
    private String address;
    private String role;
    private String dr_description;
    private String imageUrl;
    private String expertise;
    private boolean available;
    private Double hourlyRate;
    private String password;

    public RegisterRequest() {}

    public RegisterRequest(String name, String email, String phone, Integer age, String gender, String address, String role, String dr_description, String imageUrl, String expertise, boolean available, Double hourlyRate, String password) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.age = age;
        this.gender = gender;
        this.address = address;
        this.role = role;
        this.dr_description = dr_description;
        this.imageUrl = imageUrl;
        this.expertise = expertise;
        this.available = available;
        this.hourlyRate = hourlyRate;
        this.password = password;
    }

    public RegisterRequest(
            String name,
            String email,
            String phone,
            Integer age,
            String gender,
            String role,
            String password
    ) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.age = age;
        this.gender = gender;
        this.role = role;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDr_description() {
        return dr_description;
    }

    public void setDr_description(String dr_description) {
        this.dr_description = dr_description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getExpertise() {
        return expertise;
    }

    public void setExpertise(String expertise) {
        this.expertise = expertise;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public Double getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(Double hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
