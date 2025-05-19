//package org.dev.nextgen.gatewayservice.utils;
//
//import org.springframework.cloud.gateway.filter.GatewayFilterChain;
//import org.springframework.cloud.gateway.filter.GlobalFilter;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.server.reactive.ServerHttpRequest;
//import org.springframework.http.server.reactive.ServerHttpResponse;
//import org.springframework.stereotype.Component;
//import org.springframework.web.server.ServerWebExchange;
//import reactor.core.publisher.Mono;
//
//import java.util.List;
//import java.util.Map;
//import java.util.logging.Logger;
//
//@Component
//public class RoleBasedAuthorizationFilter implements GlobalFilter {
//
//    private final jwtUtils jwtUtils;
//    private final Map<String, List<String>> roleEndpointMap = Map.of(
//            "DOCTOR", List.of("api/v1/users/**", "api/appointments/**"),
//            "PATIENT", List.of("api/v1/users/**", "api/appointments/**")
//    );
//
//    public RoleBasedAuthorizationFilter(jwtUtils jwtUtils) {
//        this.jwtUtils = jwtUtils;
//    }
//
//    @Override
//    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
//        ServerHttpRequest request = exchange.getRequest();
//        String path = request.getPath().toString();
//
//        if (path.contains("api/auth")) {
//            return chain.filter(exchange);
//        }
//
//        String token = request.getHeaders().getFirst("Authorization");
////        System.out.println("token: " + token);
//        if (token != null && token.startsWith("Bearer ")) {
//            token = token.substring(7);
//
//            try {
//                String role = jwtUtils.getRoleFromToken(token);
//                String email = jwtUtils.getEmailFromToken(token);
//                String subject = jwtUtils.getSubjectFromToken(token);
//
////                System.err.print("Role: "+role);
////                System.err.print("Email: "+email);
////                System.err.print("Subject: "+subject);
//
//                if (hashAccess(role, path)) {
//                    ServerHttpRequest modifiedRequest = request.mutate()
//                            .header("role", role)
//                            .header("email", email)
//                            .header("subject", subject)
//                            .build();
//                    return chain.filter(exchange.mutate().request(modifiedRequest).build());
//                } else {
//                    return sendAccessDeniedResponse(exchange);
//                }
//
//            } catch (Exception e) {
//                return sendUnauthorizedResponse(exchange);
//            }
//        } else {
//            return sendUnauthorizedResponse(exchange);
//        }
//    }
//
//    private boolean hashAccess(String role, String path) {
//        List<String> allowedPaths = roleEndpointMap.get(role);
////        System.out.println("allowedPaths: " + allowedPaths);
//        if (allowedPaths == null) {
//            return false;
//        }
//
//        System.out.println(path);
//        return allowedPaths.stream()
//                .anyMatch(pattern -> pathMatches(pattern, path));
//    }
//
//    private boolean pathMatches(String pattern, String path) {
//        if (pattern.endsWith("/**")) {
//            String prefix = pattern.substring(0, pattern.length() - 3);
//            return path.contains(prefix);
//        }
//        return pattern.contains(path);
//    }
//
//    private Mono<Void> sendUnauthorizedResponse(ServerWebExchange exchange) {
//        ServerHttpResponse response = exchange.getResponse();
//        response.setStatusCode(HttpStatus.UNAUTHORIZED);
//        return response.setComplete();
//    }
//
//    private Mono<Void> sendAccessDeniedResponse(ServerWebExchange exchange) {
//        ServerHttpResponse response = exchange.getResponse();
//        response.setStatusCode(HttpStatus.FORBIDDEN);
//        return response.setComplete();
//    }
//}
