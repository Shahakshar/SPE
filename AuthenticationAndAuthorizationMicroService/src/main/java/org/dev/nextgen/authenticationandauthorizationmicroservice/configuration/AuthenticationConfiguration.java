package org.dev.nextgen.authenticationandauthorizationmicroservice.configuration;

import org.dev.nextgen.authenticationandauthorizationmicroservice.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.expression.ExpressionException;

//@Configuration
//public class AuthenticationConfiguration {
//
//    private final UserRepository userRepository;
//
//    public AuthenticationConfiguration(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    @Bean
//    UserDetailsService userDetailsService() {
//        return username -> (UserDetails) userRepository.findByEmail(username)
//                .orElseThrow(() -> new ExpressionException("Employee With Email: " + username + " Not Found"));
//    }
//
//    @Bean
//    public CustomPasswordEncoder customPasswordEncoder() {
//        return new CustomPasswordEncoder();
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration config) throws Exception {
//        return config.getAuthenticationManager();
//    }
//
//    @Bean
//    AuthenticationProvider authenticationProvider() {
//        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//
//        authProvider.setUserDetailsService(userDetailsService());
//        authProvider.setPasswordEncoder(customPasswordEncoder());
//
//        return authProvider;
//    }
//
//}