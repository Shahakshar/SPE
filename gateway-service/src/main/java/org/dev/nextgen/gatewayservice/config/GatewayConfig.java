package org.dev.nextgen.gatewayservice.config;

import org.dev.nextgen.gatewayservice.utils.RoleBasedAuthorizationFilter;
import org.dev.nextgen.gatewayservice.utils.jwtUtils;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouterLocation(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r->r.path("/api/auth/**")
                        .uri("http://localhost:3001"))
                .route("user-service", r -> r.path("/api/v1/patients/**")
                        .uri("http://localhost:6001"))
                .route("user-service", r -> r.path("/api/v1/doctors/**")
                        .uri("http://localhost:6001"))
                .route("appointment-service", r -> r.path("/api/appointments/**")
                        .uri("http://localhost:6002"))
                .build();
    }

}
