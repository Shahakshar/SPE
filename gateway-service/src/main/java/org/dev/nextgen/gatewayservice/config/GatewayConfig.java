package org.dev.nextgen.gatewayservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class GatewayConfig {

    @Value("${cors.allowed.origins}")
    private String allwedOrigins;

    @Bean
    public RouteLocator customRouterLocation(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-microservice", r->r.path("/api/auth/**")
                        .uri("http://auth-microservice.spe.svc.cluster.local:3001"))
                .route("user-service", r -> r.path("/api/v1/users/**")
                        .uri("http://user-service.spe.svc.cluster.local:6001"))
                .route("appointment-service", r -> r.path("/api/appointments/**")
                        .uri("http://appointment-service.spe.svc.cluster.local:6002"))
                .route("appointment-service", r -> r.path("/api/futureAppointments/**")
                        .uri("http://appointment-service.spe.svc.cluster.local:6002"))
                .build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.addAllowedOriginPattern("*");
        corsConfig.setMaxAge(3600L);
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(Arrays.asList("*"));
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }

}
