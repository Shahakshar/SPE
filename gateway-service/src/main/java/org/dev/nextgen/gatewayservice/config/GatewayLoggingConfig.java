package org.dev.nextgen.gatewayservice.config;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayLoggingConfig {
    @Bean
    public GlobalFilter loggingFilter() {
        return (exchange, chain) -> {
            System.out.println("Incoming Request Path: " + exchange.getRequest().getPath());
            System.out.println("Incoming Request Method: " + exchange.getRequest().getMethod());
            return chain.filter(exchange);
        };
    }
}