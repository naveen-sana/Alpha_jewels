package com.jewellery.config;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jewellery.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    /*
     * These requests do not require JWT processing.
     *
     * OPTIONS is especially important because browsers send
     * OPTIONS requests for CORS preflight before login/register/etc.
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request)
            throws ServletException {

        if (request == null) {
            return true;
        }

        // Always allow CORS preflight requests to bypass JWT
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String path = request.getRequestURI();

        if (path == null) {
            return false;
        }

        return path.startsWith("/api/users/")
                || path.startsWith("/api/health")
                || path.equals("/health")
                || path.startsWith("/api/products")
                || path.startsWith("/api/categories")
                || path.startsWith("/api/seed-database-now");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        /*
         * Extra protection:
         * Never try to authenticate CORS preflight requests.
         */
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorizationHeader = request.getHeader("Authorization");

        /*
         * No Authorization header:
         * Continue normally. Spring Security will decide whether
         * the requested endpoint requires authentication.
         */
        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        /*
         * If authentication already exists, don't authenticate again.
         */
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authorizationHeader.substring(7).trim();

            if (!token.isEmpty()) {

                var claims = jwtService.parseToken(token);

                String email = claims.email();
                String role = claims.role();

                if (email != null && !email.isBlank()) {

                    String normalizedRole =
                            role == null || role.isBlank()
                                    ? "USER"
                                    : role.toUpperCase();

                    var authority =
                            new SimpleGrantedAuthority(
                                    "ROLE_" + normalizedRole
                            );

                    var authentication =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    List.of(authority)
                            );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                }
            }

        } catch (Exception e) {

            /*
             * Invalid/expired JWT should not crash the request.
             * Clear authentication and let Spring Security determine
             * whether the endpoint requires authentication.
             */
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}