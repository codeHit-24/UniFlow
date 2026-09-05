package com.hitanshi.uniflow.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/users/register",
                                "/users/login"
                        ).permitAll()

                        .requestMatchers("/Students/me")
                        .hasRole("STUDENT")

                        .requestMatchers("/Students/**")
                        .hasRole("ADMIN")

                        .requestMatchers("/Courses/me")
                        .hasRole("FACULTY")

                        .requestMatchers("/Courses/**")
                        .hasRole("ADMIN")

                        .requestMatchers("/enrollments/me")
                        .hasRole("STUDENT")

                        .requestMatchers("/enrollments/my-students")
                        .hasRole("FACULTY")

                        .requestMatchers("/enrollments/course/**")
                        .hasRole("FACULTY")

                        .requestMatchers("/enrollments/faculty/student-count")
                        .hasRole("FACULTY")

                        .requestMatchers("/enrollments/**")
                        .hasRole("ADMIN")

                        .anyRequest().authenticated()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

}