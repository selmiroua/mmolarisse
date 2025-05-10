package com.projet.molarisse.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.cors.CorsConfiguration;
import org.springframework.security.web.cors.CorsConfigurationSource;
import org.springframework.security.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {
    private final JwtFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> 
                        req.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/auth/**").permitAll()
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/users/**").hasAuthority("ADMIN")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("ADMIN")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("ADMIN")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("ADMIN")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("ADMIN")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("ADMIN")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/products/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/categories/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/cart/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/checkout/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/orders/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/payments/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
                        req.requestMatchers("/api/v1/reviews/**").hasAuthority("USER")
                )
                .authorizeHttpRequests(req -> 
 