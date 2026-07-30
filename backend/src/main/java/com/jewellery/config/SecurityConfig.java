

package com.jewellery.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {
	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
	    this.jwtAuthenticationFilter = jwtAuthenticationFilter;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
	    return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

	    http
	        .csrf(csrf -> csrf.disable())
	        .cors(Customizer.withDefaults())
	        .authorizeHttpRequests(auth -> auth
	        		.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
	        		.requestMatchers("/api/users/register", "/api/users/login",
	        		        "/api/users/forgot-password", "/api/users/reset-password", "/error").permitAll()
	        		.requestMatchers(HttpMethod.GET, "/api/products").permitAll()
	        		.requestMatchers("/api/cart/**", "/api/wishlist/**").authenticated()
	        		.requestMatchers("/api/admin/**").hasRole("ADMIN")
	            .anyRequest().authenticated()
	        )
	        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	        .formLogin(form -> form.disable())
	        .httpBasic(basic -> basic.disable())
	        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

	    return http.build();
	}

	/**
	 * Allows the Vite development server and a separately served frontend to call
	 * the public authentication endpoints. Without this, browser preflight
	 * requests are rejected by Spring Security with HTTP 403.
	 */
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();
	    configuration.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));
	    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
	    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
	    configuration.setExposedHeaders(List.of("Authorization"));

	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", configuration);
	    return source;
	}
}
  
