package org.dev.nextgen.authenticationandauthorizationmicroservice.utils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;

@Component
public class JwtRequestInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    public  JwtRequestInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        if (token.isEmpty() || jwtUtil.isTokenExpired(token)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token Expired or Invalid");
            return false;
        }
        return true;
    }

}
