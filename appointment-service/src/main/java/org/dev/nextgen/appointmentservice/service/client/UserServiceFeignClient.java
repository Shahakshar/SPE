package org.dev.nextgen.appointmentservice.service.client;

import org.dev.nextgen.appointmentservice.dto.UsersDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", url = "http://user-service.spe.svc.cluster.local:6001")
public interface UserServiceFeignClient {
    @GetMapping("/api/v1/users/{id}")
    ResponseEntity<UsersDTO> getUserById(@PathVariable Long id) throws Exception;
}


